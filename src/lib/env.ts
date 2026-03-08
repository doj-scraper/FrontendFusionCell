import 'server-only'

import { z } from 'zod'

const nodeEnvSchema = z.enum(['development', 'test', 'production'])

const serverEnvSchema = z.object({
  NODE_ENV: nodeEnvSchema.default('development'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  DIRECT_URL: z.string().url('DIRECT_URL must be a valid URL').optional(),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NEXTAUTH_SECRET must be at least 32 characters long'),
  STRIPE_SECRET_KEY: z
    .string()
    .min(1, 'STRIPE_SECRET_KEY is required')
    .refine((value) => value.startsWith('sk_'), {
      message: 'STRIPE_SECRET_KEY must start with sk_',
    }),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .min(1, 'STRIPE_WEBHOOK_SECRET is required')
    .refine((value) => value.startsWith('whsec_'), {
      message: 'STRIPE_WEBHOOK_SECRET must start with whsec_',
    }),
})

const clientEnvSchema = z.object({
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required')
    .refine((value) => value.startsWith('pk_'), {
      message: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with pk_',
    }),
})

const parsedServerEnv = serverEnvSchema.safeParse(process.env)

if (!parsedServerEnv.success) {
  const details = parsedServerEnv.error.issues
    .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
    .join('; ')

  throw new Error(`Invalid server environment variables: ${details}`)
}

const parsedClientEnv = clientEnvSchema.safeParse(process.env)

if (!parsedClientEnv.success) {
  const details = parsedClientEnv.error.issues
    .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
    .join('; ')

  throw new Error(`Invalid client environment variables: ${details}`)
}

const serverEnv = parsedServerEnv.data

export const env = {
  ...serverEnv,
  ...parsedClientEnv.data,
  // Some providers only expose a single runtime connection string.
  DIRECT_URL: serverEnv.DIRECT_URL ?? serverEnv.DATABASE_URL,
} as const

export type ServerEnv = z.infer<typeof serverEnvSchema>
export type ClientEnv = z.infer<typeof clientEnvSchema>
