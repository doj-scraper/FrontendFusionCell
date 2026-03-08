import { getServerSession } from 'next-auth'

import { apiError, apiSuccess } from '@/lib/api'
import { authOptions } from '@/lib/auth'
import { cartItemActionInputSchema } from '@/lib/validations/cart'
import {
  guestCartCookieConfig,
  mutateCartItem,
  parseGuestCartCookie,
  serializeGuestCartCookie,
} from '@/server/services/cart/cart.service'

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: guestCartCookieConfig.maxAge,
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const requestId = request.headers.get('x-request-id') ?? undefined

    const payload = await request.json()
    const parsedPayload = cartItemActionInputSchema.safeParse(payload)

    if (!parsedPayload.success) {
      return apiError('INVALID_CART_ACTION', 'Invalid cart action payload.', 400, parsedPayload.error.flatten(), requestId)
    }

    const cookieHeader = request.headers.get('cookie')
    const rawGuestCookie = cookieHeader
      ?.split(';')
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith(`${guestCartCookieConfig.name}=`))
      ?.split('=')[1]

    const guestCartId = parseGuestCartCookie(rawGuestCookie)

    const result = await mutateCartItem({
      ...parsedPayload.data,
      userId: session?.user?.id,
      guestCartId,
    })

    const response = apiSuccess(result.cart, 200, requestId)

    if (result.clearGuestCookie) {
      response.cookies.set(guestCartCookieConfig.name, '', {
        ...COOKIE_OPTIONS,
        maxAge: 0,
      })
    } else if (!session?.user?.id && result.guestCartId) {
      response.cookies.set(
        guestCartCookieConfig.name,
        serializeGuestCartCookie(result.guestCartId),
        COOKIE_OPTIONS,
      )
    }

    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    if (message === 'PART_NOT_FOUND') {
      return apiError('PART_NOT_FOUND', 'The requested part is not available.', 404)
    }

    if (message === 'PART_UNAVAILABLE') {
      return apiError('PART_UNAVAILABLE', 'The requested part is currently unavailable.', 409)
    }

    if (message === 'ITEM_NOT_FOUND') {
      return apiError('ITEM_NOT_FOUND', 'The cart item does not exist.', 404)
    }

    return apiError('CART_MUTATION_FAILED', 'Failed to update cart.', 500, { cause: message })
  }
}
