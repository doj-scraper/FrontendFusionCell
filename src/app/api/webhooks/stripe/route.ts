import type Stripe from 'stripe'

import { apiError, apiSuccess } from '@/lib/api'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'
import { monitoring } from '@/lib/monitoring'
import { stripe } from '@/lib/stripe'
import { finalizeOrderFromStripeEvent } from '@/server/services/orders/order-finalization.service'

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return apiError('MISSING_STRIPE_SIGNATURE', 'Missing Stripe signature header.', 400)
    }

    const body = await request.text()

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
      monitoring.recordWebhookFailed()
      logger.warn('Stripe signature verification failed', { error })
      return apiError('INVALID_STRIPE_SIGNATURE', 'Unable to verify Stripe signature.', 400, {
        cause: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    const eventType = event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.payment_failed' ? event.type : 'other'
    monitoring.recordWebhookReceived(eventType)

    const result = await finalizeOrderFromStripeEvent(event)

    logger.info('Stripe webhook processed', { context: { eventId: event.id, eventType: event.type, orderId: result.orderId, alreadyProcessed: result.alreadyProcessed } })

    return apiSuccess({ received: true, ...result }, 200)
  } catch (error) {
    monitoring.recordWebhookFailed()
    logger.error('Stripe webhook processing failed', { error })
    return apiError('STRIPE_WEBHOOK_FAILED', 'Webhook processing failed.', 500, {
      cause: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
