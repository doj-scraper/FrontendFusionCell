import { getServerSession } from 'next-auth'

import { apiError, apiSuccess } from '@/lib/api'
import { authOptions } from '@/lib/auth'
import { checkoutIntentInputSchema, inlineAddressSchema } from '@/lib/validations/checkout'
import {
  guestCartCookieConfig,
  parseGuestCartCookie,
} from '@/server/services/cart/cart.service'
import { createCheckoutIntent } from '@/server/services/checkout/checkout.service'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const requestId = request.headers.get('x-request-id') ?? undefined

    // Parse the guest cart cookie
    const cookieHeader = request.headers.get('cookie')
    const rawGuestCookie = cookieHeader
      ?.split(';')
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith(`${guestCartCookieConfig.name}=`))
      ?.split('=')[1]

    const guestCartId = parseGuestCartCookie(rawGuestCookie)

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

    const input = parsedPayload.data

    // For authenticated users, use session userId
    // For guests, pass undefined (service will use guestCartId)
    const userId = session?.user?.id

    const result = await createCheckoutIntent(userId, {
      ...input,
      // Ensure guestCartId is passed for guest checkout (convert null to undefined)
      guestCartId: input.guestCartId ?? guestCartId ?? undefined,
    })

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

    if (message === 'SHIPPING_ADDRESS_REQUIRED') {
      return apiError('SHIPPING_ADDRESS_REQUIRED', 'Shipping address is required for checkout.', 400)
    }

    if (message === 'BILLING_ADDRESS_NOT_FOUND') {
      return apiError('BILLING_ADDRESS_NOT_FOUND', 'Billing address not found.', 404)
    }

    return apiError('CHECKOUT_INTENT_FAILED', 'Unable to initialize checkout.', 500, {
      cause: message,
    })
  }
}
