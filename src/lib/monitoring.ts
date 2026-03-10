import 'server-only'

type WebhookEventType = 'payment_intent.succeeded' | 'payment_intent.payment_failed' | 'other'

type RouteStats = {
  requests: number
  totalMs: number
  p95Ms: number
  samples: number[]
}

const state = {
  webhookReceivedTotal: 0,
  webhookFailedTotal: 0,
  paymentIntentSucceededTotal: 0,
  paymentIntentFailedTotal: 0,
  orderPaymentDivergenceTotal: 0,
  rateLimitedTotal: 0,
  routeStats: new Map<string, RouteStats>(),
}

const updateLatency = (route: string, durationMs: number) => {
  const current =
    state.routeStats.get(route) ??
    ({ requests: 0, totalMs: 0, p95Ms: 0, samples: [] } satisfies RouteStats)

  current.requests += 1
  current.totalMs += durationMs
  current.samples.push(durationMs)
  if (current.samples.length > 200) {
    current.samples.shift()
  }

  const sorted = [...current.samples].sort((a, b) => a - b)
  const percentileIndex = Math.floor(sorted.length * 0.95)
  current.p95Ms = sorted[Math.min(percentileIndex, sorted.length - 1)] ?? durationMs

  state.routeStats.set(route, current)
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
  recordRateLimited: () => {
    state.rateLimitedTotal += 1
  },
  recordRouteLatency: (route: string, durationMs: number) => {
    updateLatency(route, durationMs)
  },
  snapshot: () => ({
    webhookReceivedTotal: state.webhookReceivedTotal,
    webhookFailedTotal: state.webhookFailedTotal,
    paymentIntentSucceededTotal: state.paymentIntentSucceededTotal,
    paymentIntentFailedTotal: state.paymentIntentFailedTotal,
    orderPaymentDivergenceTotal: state.orderPaymentDivergenceTotal,
    rateLimitedTotal: state.rateLimitedTotal,
    routeStats: Array.from(state.routeStats.entries()).map(([route, stats]) => ({
      route,
      requests: stats.requests,
      p95Ms: stats.p95Ms,
      avgMs: stats.requests > 0 ? Number((stats.totalMs / stats.requests).toFixed(2)) : 0,
    })),
  }),
}
