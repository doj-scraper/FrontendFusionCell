import { z } from 'zod'

export const addressInputSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  line1: z.string().trim().min(3).max(120),
  line2: z.string().trim().max(120).optional(),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().min(3).max(20),
  country: z.string().trim().length(2),
})

export const checkoutIntentInputSchema = z.object({
  cartId: z.string().trim().min(1),
  email: z.string().trim().email(),
  shippingAddress: addressInputSchema,
  billingAddress: addressInputSchema.optional(),
})

export type AddressInput = z.infer<typeof addressInputSchema>
export type CheckoutIntentInput = z.infer<typeof checkoutIntentInputSchema>
