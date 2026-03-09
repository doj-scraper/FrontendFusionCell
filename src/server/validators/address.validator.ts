import { z } from 'zod'

const phoneRegex = /^[\d+()\-\s]{7,20}$/

export const addressCreateSchema = z.object({
  label: z.string().trim().min(1).max(60).optional(),
  fullName: z.string().trim().min(2).max(120),
  company: z.string().trim().max(120).optional(),
  line1: z.string().trim().min(3).max(160),
  line2: z.string().trim().max(160).optional(),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().min(3).max(20),
  country: z.string().trim().length(2),
  phone: z.string().trim().regex(phoneRegex, 'Invalid phone number').optional(),
  isDefault: z.boolean().optional(),
})

export const addressUpdateSchema = addressCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field must be provided.',
)

export type AddressCreateInput = z.infer<typeof addressCreateSchema>
export type AddressUpdateInput = z.infer<typeof addressUpdateSchema>
