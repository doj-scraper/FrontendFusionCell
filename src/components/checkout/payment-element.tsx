'use client'

import { PaymentElement } from '@stripe/react-stripe-js'

export function CheckoutPaymentElement() {
  return (
    <div className="rounded-lg border border-yellow-900/30 bg-white p-4">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />
    </div>
  )
}
