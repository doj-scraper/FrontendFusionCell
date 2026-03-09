import 'server-only'

import { Prisma } from '@prisma/client'
import type Stripe from 'stripe'

import { logger } from '@/lib/logger'
import { monitoring } from '@/lib/monitoring'
import { prisma } from '@/lib/prisma'

type FinalizeResult = {
  alreadyProcessed: boolean
  orderId?: string
}

const isUniqueEventViolation = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'

export const finalizeOrderFromStripeEvent = async (
  event: Stripe.Event,
): Promise<FinalizeResult> => {
  if (event.type !== 'payment_intent.succeeded' && event.type !== 'payment_intent.payment_failed') {
    return { alreadyProcessed: false }
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent

  return prisma.$transaction(async (tx) => {
    try {
      await tx.processedStripeEvent.create({
        data: {
          eventId: event.id,
          eventType: event.type,
          stripeCreatedAt: new Date(event.created * 1000),
          paymentIntentId: paymentIntent.id,
        },
      })
    } catch (error) {
      if (isUniqueEventViolation(error)) {
        return { alreadyProcessed: true }
      }

      throw error
    }

    const order = await tx.order.findFirst({
      where: {
        stripePaymentIntentId: paymentIntent.id,
      },
      select: {
        id: true,
      },
    })

    if (!order) {
      monitoring.recordOrderPaymentDivergence()
      logger.warn('Payment intent webhook had no matching order', {
        context: { paymentIntentId: paymentIntent.id, eventType: event.type },
      })
      return { alreadyProcessed: false }
    }

    if (event.type === 'payment_intent.succeeded') {
      await tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          paymentStatus: 'SUCCEEDED',
          status: 'PAID',
        },
      })

      return { alreadyProcessed: false, orderId: order.id }
    }

    await tx.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentStatus: 'FAILED',
        status: 'PAYMENT_FAILED',
      },
    })

    return { alreadyProcessed: false, orderId: order.id }
  })
}
