import { getServerSession } from 'next-auth'

import { apiError, apiSuccess } from '@/lib/api'
import { authOptions } from '@/lib/auth'
import { setDefaultAddress } from '@/server/services/addresses/address.service'

type Params = { params: Promise<{ addressId: string }> }

export async function POST(request: Request, { params }: Params) {
  const requestId = request.headers.get('x-request-id') ?? undefined
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return apiError('UNAUTHORIZED', 'Authentication required.', 401, undefined, requestId)
  }

  const { addressId } = await params

  try {
    const address = await setDefaultAddress(session.user.id, addressId)
    return apiSuccess(address, 200, requestId)
  } catch (error) {
    if (error instanceof Error && error.message === 'ADDRESS_NOT_FOUND') {
      return apiError('ADDRESS_NOT_FOUND', 'Address not found.', 404, undefined, requestId)
    }

    return apiError('ADDRESS_DEFAULT_FAILED', 'Unable to set default address.', 500, undefined, requestId)
  }
}
