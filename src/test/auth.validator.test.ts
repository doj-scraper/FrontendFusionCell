import { describe, expect, it } from 'vitest'

import { registerSchema } from '@/server/validators/auth.validator'

describe('register schema', () => {
  it('normalizes email case/whitespace', () => {
    const parsed = registerSchema.parse({
      email: 'USER@EXAMPLE.COM',
      password: 'supersecure123',
      confirmPassword: 'supersecure123',
    })

    expect(parsed.email).toBe('user@example.com')
  })

  it('fails when passwords do not match', () => {
    const parsed = registerSchema.safeParse({
      email: 'user@example.com',
      password: 'supersecure123',
      confirmPassword: 'mismatch',
    })

    expect(parsed.success).toBe(false)
  })
})
