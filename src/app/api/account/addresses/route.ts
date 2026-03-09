import { getServerSession } from 'next-auth'

import { apiError, apiSuccess } from '@/lib/api'
import { authOptions } from '@/lib/auth'
import { createAddress, listAddresses } from '@/server/services/addresses/address.service'
import { addressCreateSchema } from '@/server/validators/address.validator'

export async function GET(request: Request) {
  const requestId = request.headers.get('x-request-id') ?? undefined
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return apiError('UNAUTHORIZED', 'Authentication required.', 401, undefined, requestId)
  }

  const addresses = await listAddresses(session.user.id)

  return apiSuccess(addresses, 200, requestId)
}

export async function POST(request: Request) {
  const requestId = request.headers.get('x-request-id') ?? undefined
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return apiError('UNAUTHORIZED', 'Authentication required.', 401, undefined, requestId)
  }

  const body = await request.json().catch(() => null)
  const parsed = addressCreateSchema.safeParse(body)

  if (!parsed.success) {
    return apiError('INVALID_ADDRESS_PAYLOAD', 'Invalid address payload.', 400, parsed.error.flatten(), requestId)
  }

  const address = await createAddress(session.user.id, parsed.data)

  return apiSuccess(address, 201, requestId)
}
