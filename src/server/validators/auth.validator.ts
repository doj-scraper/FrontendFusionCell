import { z } from "zod";

const phoneRegex = /^\+?[1-9]\d{7,14}$/;

export const registerSchema = z
  .object({
    email: z.string().email().transform((value) => value.toLowerCase().trim()),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters"),
    confirmPassword: z.string(),
    name: z.string().trim().min(1).max(120).optional(),
    phone: z.string().trim().regex(phoneRegex, "Invalid phone format").optional().or(z.literal("")),
    companyName: z.string().trim().max(120).optional(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase().trim()),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
