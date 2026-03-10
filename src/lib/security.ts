import { apiError } from '@/lib/api'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

export const assertCsrf = (request: Request, requestId?: string) => {
  if (SAFE_METHODS.has(request.method.toUpperCase())) {
    return null
  }

  const csrfHeader = request.headers.get('x-csrf-token')
  const csrfCookie = request.headers
    .get('cookie')
    ?.split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('csrf-token='))
    ?.split('=')[1]

  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    return apiError('CSRF_INVALID', 'CSRF token validation failed.', 403, undefined, requestId)
  }

  return null
}

export const sanitizeText = (value: string) => value.replace(/[<>]/g, '').trim()
