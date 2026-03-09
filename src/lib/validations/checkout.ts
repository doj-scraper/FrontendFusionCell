import { z } from 'zod'

export const checkoutIntentInputSchema = z.object({
  cartId: z.string().trim().min(1),
  email: z.string().trim().email(),
  shippingAddressId: z.string().trim().min(1),
  billingAddressId: z.string().trim().min(1).optional(),
})

export type CheckoutIntentInput = z.infer<typeof checkoutIntentInputSchema>
