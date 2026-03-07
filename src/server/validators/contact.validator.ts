import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().trim().optional(),
  company: z.string().trim().optional(),
  message: z.string().trim().min(1, "Message is required"),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
