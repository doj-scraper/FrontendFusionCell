import { z } from 'zod'

// Inline address schema for guest checkout
export const inlineAddressSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  line1: z.string().trim().min(1, 'Address is required'),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1, 'City is required'),
  state: z.string().trim().min(1, 'State is required'),
  postalCode: z.string().trim().min(1, 'Postal code is required'),
  country: z.string().trim().min(2, 'Country code is required'),
  phone: z.string().trim().optional(),
})

export type InlineAddress = z.infer<typeof inlineAddressSchema>

// Base schema for checkout input
export const checkoutIntentInputSchema = z
  .object({
    cartId: z.string().trim().min(1).optional(),
    guestCartId: z.string().trim().min(1).optional(),
    email: z.string().trim().email(),
    // For authenticated users - use saved address IDs
    shippingAddressId: z.string().trim().min(1).optional(),
    billingAddressId: z.string().trim().min(1).optional(),
    // For guest users - inline address data
    shippingAddress: inlineAddressSchema.optional(),
    billingAddress: inlineAddressSchema.optional(),
    // For guest users - use shipping as billing
    useShippingAsBilling: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // Must have either cartId (authenticated) or guestCartId (guest)
      const hasAuth = data.cartId && data.shippingAddressId
      const hasGuest = data.guestCartId && data.shippingAddress
      return hasAuth || hasGuest
    },
    {
      message: 'Either cartId with shippingAddressId, or guestCartId with shippingAddress is required',
      path: ['cartId'],
    },
  )

export type CheckoutIntentInput = z.infer<typeof checkoutIntentInputSchema>
