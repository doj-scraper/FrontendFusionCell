import { z } from 'zod'

export const quantitySchema = z.coerce.number().int().min(1).max(999)

export const addCartItemInputSchema = z.object({
  action: z.literal('add'),
  sku: z.string().trim().min(1).max(120),
  quantity: quantitySchema,
})

export const setCartItemInputSchema = z.object({
  action: z.literal('set'),
  itemId: z.string().trim().min(1),
  quantity: quantitySchema,
})

export const removeCartItemInputSchema = z.object({
  action: z.literal('remove'),
  itemId: z.string().trim().min(1),
})

export const cartItemActionInputSchema = z.discriminatedUnion('action', [
  addCartItemInputSchema,
  setCartItemInputSchema,
  removeCartItemInputSchema,
])

export type AddCartItemInput = z.infer<typeof addCartItemInputSchema>
export type SetCartItemInput = z.infer<typeof setCartItemInputSchema>
export type RemoveCartItemInput = z.infer<typeof removeCartItemInputSchema>
export type CartItemActionInput = z.infer<typeof cartItemActionInputSchema>
