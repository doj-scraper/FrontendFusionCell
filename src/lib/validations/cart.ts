import { z } from 'zod'

export const quantitySchema = z.coerce.number().int().min(1).max(999)

export const cartItemInputSchema = z.object({
  sku: z.string().trim().min(1).max(120),
  quantity: quantitySchema,
})

export const updateCartItemInputSchema = z.object({
  itemId: z.string().trim().min(1),
  quantity: quantitySchema,
})

export const removeCartItemInputSchema = z.object({
  itemId: z.string().trim().min(1),
})

export type CartItemInput = z.infer<typeof cartItemInputSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemInputSchema>
export type RemoveCartItemInput = z.infer<typeof removeCartItemInputSchema>
