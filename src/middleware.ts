import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { apiError } from '@/lib/api'

const REQUEST_ID_HEADER = 'x-request-id'
const PROTECTED_PAGE_PATHS = ['/account', '/checkout']
const PROTECTED_API_PREFIXES = ['/api/cart', '/api/checkout', '/api/account', '/api/ops']
const AUTH_COOKIE_NAMES = ['next-auth.session-token', '__Secure-next-auth.session-token']

const isProtectedPagePath = (pathname: string) =>
  PROTECTED_PAGE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )

const isProtectedApiPath = (pathname: string) =>
  PROTECTED_API_PREFIXES.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )

const hasSessionCookie = (request: NextRequest) =>
  AUTH_COOKIE_NAMES.some((cookieName) => Boolean(request.cookies.get(cookieName)?.value))

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const requestHeaders = new Headers(request.headers)
  const requestId = requestHeaders.get(REQUEST_ID_HEADER) ?? crypto.randomUUID()

  requestHeaders.set(REQUEST_ID_HEADER, requestId)

  if (!hasSessionCookie(request)) {
    if (isProtectedApiPath(pathname)) {
      const response = apiError(
        'UNAUTHORIZED',
        'Authentication required',
        401,
        undefined,
        requestId,
      )
      response.headers.set(REQUEST_ID_HEADER, requestId)
      return response
    }

    if (isProtectedPagePath(pathname)) {
      const loginUrl = new URL('/', request.url)
      loginUrl.searchParams.set('next', pathname)

      const response = NextResponse.redirect(loginUrl)
      response.headers.set(REQUEST_ID_HEADER, requestId)
      return response
    }
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.headers.set(REQUEST_ID_HEADER, requestId)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
