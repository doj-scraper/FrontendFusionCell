import 'server-only'

import Stripe from 'stripe'

import { env } from '@/lib/env'

const globalForStripe = globalThis as unknown as {
  stripe: Stripe | undefined
}

const createStripeClient = () =>
  new Stripe(env.STRIPE_SECRET_KEY, {
    appInfo: {
      name: 'FrontendFusionCell',
    },
    typescript: true,
  })

export const stripe = globalForStripe.stripe ?? createStripeClient()

if (env.NODE_ENV !== 'production') {
  globalForStripe.stripe = stripe
}
