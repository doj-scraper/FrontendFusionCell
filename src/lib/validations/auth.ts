import { z } from 'zod'

export const emailSchema = z.string().trim().email().max(254)

export const passwordSchema = z.string().min(8).max(128)

export const registerInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: emailSchema,
  password: passwordSchema,
})

export const loginInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type RegisterInput = z.infer<typeof registerInputSchema>
export type LoginInput = z.infer<typeof loginInputSchema>
