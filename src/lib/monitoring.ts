import 'server-only'

type WebhookEventType = 'payment_intent.succeeded' | 'payment_intent.payment_failed' | 'other'

const state = {
  webhookReceivedTotal: 0,
  webhookFailedTotal: 0,
  paymentIntentSucceededTotal: 0,
  paymentIntentFailedTotal: 0,
  orderPaymentDivergenceTotal: 0,
}

export const monitoring = {
  recordWebhookReceived: (eventType: WebhookEventType) => {
    state.webhookReceivedTotal += 1
    if (eventType === 'payment_intent.succeeded') {
      state.paymentIntentSucceededTotal += 1
    } else if (eventType === 'payment_intent.payment_failed') {
      state.paymentIntentFailedTotal += 1
    }
  },
  recordWebhookFailed: () => {
    state.webhookFailedTotal += 1
  },
  recordOrderPaymentDivergence: () => {
    state.orderPaymentDivergenceTotal += 1
  },
  snapshot: () => ({ ...state }),
}
