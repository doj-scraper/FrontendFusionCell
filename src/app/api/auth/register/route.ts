import { headers } from 'next/headers'

import { apiError, apiSuccess } from '@/lib/api'
import { logger } from '@/lib/logger'
import { monitoring } from '@/lib/monitoring'
import { getRateLimitPolicy } from '@/lib/rate-limit-policy'
import { getClientIdentifier, rateLimit } from '@/lib/rate-limit'
import { assertCsrf, sanitizeText } from '@/lib/security'
import { registerUser } from '@/server/services/auth/register.service'
import { registerSchema } from '@/server/validators/auth.validator'

export async function POST(request: Request) {
  const startedAt = Date.now()
  const headerStore = await headers()
  const requestId = headerStore.get('x-request-id') ?? undefined

  const csrfError = assertCsrf(request, requestId)
  if (csrfError) {
    return csrfError
  }

  const body = await request.json().catch(() => null)
  const parsed = registerSchema.safeParse(body)

  if (!parsed.success) {
    return apiError(
      'INVALID_PAYLOAD',
      'Invalid registration payload',
      400,
      parsed.error.flatten(),
      requestId,
    )
  }

  const clientId = getClientIdentifier(headerStore)
  const policy = getRateLimitPolicy('/api/auth/register')
  const limiterKey = `${policy.keyPrefix}:${clientId}:${parsed.data.email}`

  if (!rateLimit(limiterKey, policy.limit, policy.windowMs)) {
    monitoring.recordRateLimited()

    logger.warn('Rate limited registration attempt', {
      requestId,
      context: {
        clientId,
        email: parsed.data.email,
      },
    })

    return apiError(
      'RATE_LIMITED',
      'Too many registration attempts. Please try again shortly.',
      429,
      undefined,
      requestId,
    )
  }

  const result = await registerUser({
    ...parsed.data,
    name: parsed.data.name ? sanitizeText(parsed.data.name) : undefined,
    companyName: parsed.data.companyName ? sanitizeText(parsed.data.companyName) : undefined,
  })

  if (!result.ok) {
    return apiError('EMAIL_IN_USE', 'An account with this email already exists.', 409, undefined, requestId)
  }

  monitoring.recordRouteLatency('/api/auth/register', Date.now() - startedAt)

  logger.info('User registered', {
    requestId,
    context: {
      userId: result.user.id,
    },
  })

  return apiSuccess(result.user, 201, requestId)
}
