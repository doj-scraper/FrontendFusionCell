import { getServerSession } from 'next-auth'

import { apiError, apiSuccess } from '@/lib/api'
import { authOptions } from '@/lib/auth'
import {
  getActiveCart,
  guestCartCookieConfig,
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

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const requestId = request.headers.get('x-request-id') ?? undefined

    const cookieHeader = request.headers.get('cookie')
    const rawGuestCookie = cookieHeader
      ?.split(';')
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith(`${guestCartCookieConfig.name}=`))
      ?.split('=')[1]

    const guestCartId = parseGuestCartCookie(rawGuestCookie)

    const result = await getActiveCart({
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
    return apiError('CART_FETCH_FAILED', 'Failed to load cart.', 500, {
      cause: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
