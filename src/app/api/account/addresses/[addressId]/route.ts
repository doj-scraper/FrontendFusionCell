import { getServerSession } from 'next-auth'

import { apiError, apiSuccess } from '@/lib/api'
import { authOptions } from '@/lib/auth'
import { deleteAddress, updateAddress } from '@/server/services/addresses/address.service'
import { addressUpdateSchema } from '@/server/validators/address.validator'

type Params = { params: Promise<{ addressId: string }> }

export async function PATCH(request: Request, { params }: Params) {
  const requestId = request.headers.get('x-request-id') ?? undefined
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return apiError('UNAUTHORIZED', 'Authentication required.', 401, undefined, requestId)
  }

  const { addressId } = await params
  const body = await request.json().catch(() => null)
  const parsed = addressUpdateSchema.safeParse(body)

  if (!parsed.success) {
    return apiError('INVALID_ADDRESS_PAYLOAD', 'Invalid address update payload.', 400, parsed.error.flatten(), requestId)
  }

  try {
    const address = await updateAddress(session.user.id, addressId, parsed.data)
    return apiSuccess(address, 200, requestId)
  } catch (error) {
    if (error instanceof Error && error.message === 'ADDRESS_NOT_FOUND') {
      return apiError('ADDRESS_NOT_FOUND', 'Address not found.', 404, undefined, requestId)
    }

    return apiError('ADDRESS_UPDATE_FAILED', 'Unable to update address.', 500, undefined, requestId)
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const requestId = request.headers.get('x-request-id') ?? undefined
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return apiError('UNAUTHORIZED', 'Authentication required.', 401, undefined, requestId)
  }

  const { addressId } = await params

  try {
    await deleteAddress(session.user.id, addressId)
    return apiSuccess({ deleted: true }, 200, requestId)
  } catch (error) {
    if (error instanceof Error && error.message === 'ADDRESS_NOT_FOUND') {
      return apiError('ADDRESS_NOT_FOUND', 'Address not found.', 404, undefined, requestId)
    }

    return apiError('ADDRESS_DELETE_FAILED', 'Unable to delete address.', 500, undefined, requestId)
  }
}
