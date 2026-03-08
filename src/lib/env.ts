import { z } from "zod";

const envSchema = z.object({
  AUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
});

const parsed = envSchema.safeParse({
  AUTH_SECRET: process.env.AUTH_SECRET,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
});

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

const authSecret = parsed.data.AUTH_SECRET ?? parsed.data.NEXTAUTH_SECRET;

if (!authSecret) {
  throw new Error("Missing auth secret. Set AUTH_SECRET (preferred) or NEXTAUTH_SECRET.");
}

export const env = {
  AUTH_SECRET: authSecret,
  NEXTAUTH_URL: parsed.data.NEXTAUTH_URL,
};
