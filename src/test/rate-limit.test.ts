import { describe, expect, it } from 'vitest'

import { getClientIdentifier, rateLimit } from '@/lib/rate-limit'

describe('rate-limit utility', () => {
  it('extracts the first forwarded ip as client identifier', () => {
    const client = getClientIdentifier(
      new Headers({ 'x-forwarded-for': '203.0.113.10, 198.51.100.1' }),
    )

    expect(client).toBe('203.0.113.10')
  })

  it('rejects requests once a bucket threshold is exceeded', () => {
    const key = `test-${Date.now()}`

    expect(rateLimit(key, 2, 10_000)).toBe(true)
    expect(rateLimit(key, 2, 10_000)).toBe(true)
    expect(rateLimit(key, 2, 10_000)).toBe(false)
  })
})
