import { ShieldCheck } from 'lucide-react'

import { CheckoutForm } from '@/components/checkout/checkout-form'

export default function CheckoutPage() {
  return (
    <main className="container px-4 py-10 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Secure wholesale checkout with saved addresses, server-validated totals, and Stripe payment intents.</p>
        </div>

        <CheckoutForm />

        <div className="flex items-center gap-3 rounded-lg border border-yellow-900/30 bg-muted p-4">
          <ShieldCheck className="h-6 w-6 text-violet-700" />
          <p className="text-sm text-muted-foreground">Orders are finalized only after Stripe webhook confirmation, with idempotent event processing and monitoring counters.</p>
        </div>
      </div>
    </main>
  )
}
