export type RateLimitPolicy = {
  keyPrefix: 'public' | 'auth' | 'checkout' | 'webhook'
  limit: number
  windowMs: number
}

const policies: Record<string, RateLimitPolicy> = {
  '/api/auth/register': { keyPrefix: 'auth', limit: 5, windowMs: 60_000 },
  '/api/checkout/intent': { keyPrefix: 'checkout', limit: 20, windowMs: 60_000 },
  '/api/contact': { keyPrefix: 'public', limit: 20, windowMs: 60_000 },
  '/api/webhooks/stripe': { keyPrefix: 'webhook', limit: 120, windowMs: 60_000 },
}

export const getRateLimitPolicy = (pathname: string): RateLimitPolicy =>
  policies[pathname] ?? { keyPrefix: 'public', limit: 60, windowMs: 60_000 }
