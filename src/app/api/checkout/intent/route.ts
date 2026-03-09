import { getServerSession } from 'next-auth'

import { apiError, apiSuccess } from '@/lib/api'
import { authOptions } from '@/lib/auth'
import { checkoutIntentInputSchema } from '@/lib/validations/checkout'
import { createCheckoutIntent } from '@/server/services/checkout/checkout.service'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const requestId = request.headers.get('x-request-id') ?? undefined

    if (!session?.user?.id) {
      return apiError('UNAUTHORIZED', 'Authentication required.', 401, undefined, requestId)
    }

    const payload = await request.json()
    const parsedPayload = checkoutIntentInputSchema.safeParse(payload)

    if (!parsedPayload.success) {
      return apiError(
        'INVALID_CHECKOUT_PAYLOAD',
        'Checkout payload failed validation.',
        400,
        parsedPayload.error.flatten(),
        requestId,
      )
    }

    const result = await createCheckoutIntent(session.user.id, parsedPayload.data)

    return apiSuccess(result, 201, requestId)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    if (message === 'CART_EMPTY') {
      return apiError('CART_EMPTY', 'Your cart is empty.', 409)
    }

    if (message === 'ITEM_UNAVAILABLE') {
      return apiError('ITEM_UNAVAILABLE', 'One or more items are unavailable.', 409)
    }

    if (message === 'SHIPPING_ADDRESS_NOT_FOUND') {
      return apiError('SHIPPING_ADDRESS_NOT_FOUND', 'Shipping address not found.', 404)
    }

    if (message === 'BILLING_ADDRESS_NOT_FOUND') {
      return apiError('BILLING_ADDRESS_NOT_FOUND', 'Billing address not found.', 404)
    }

    return apiError('CHECKOUT_INTENT_FAILED', 'Unable to initialize checkout.', 500, {
      cause: message,
    })
  }
}
