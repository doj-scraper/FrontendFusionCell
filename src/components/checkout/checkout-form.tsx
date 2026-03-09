'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ArrowLeft, CheckCircle2, Lock, PlusCircle } from 'lucide-react'
import Link from 'next/link'

import { CheckoutPaymentElement } from '@/components/checkout/payment-element'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

type CartSummary = {
  id: string
  currency: string
  subtotal: number
  itemCount: number
}

type Address = {
  id: string
  label: string | null
  fullName: string
  line1: string
  line2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  phone: string | null
  isDefault: boolean
}

type CheckoutIntentResponse = {
  clientSecret: string
  orderNumber: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  currency: string
}

type NewAddressInput = {
  label: string
  fullName: string
  line1: string
  line2: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

const defaultAddressInput: NewAddressInput = {
  label: 'Warehouse',
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'US',
  phone: '',
  isDefault: false,
}

function AddressCard({
  address,
  selected,
  onSelect,
}: {
  address: Address
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border p-3 text-left transition ${
        selected
          ? 'border-violet-500 bg-violet-50/70'
          : 'border-yellow-900/20 bg-white hover:border-violet-400'
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="font-medium">{address.label ?? 'Saved address'}</p>
        {address.isDefault ? (
          <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-900">Default</span>
        ) : null}
      </div>
      <p className="text-sm">{address.fullName}</p>
      <p className="text-xs text-muted-foreground">
        {address.line1}
        {address.line2 ? `, ${address.line2}` : ''}
      </p>
      <p className="text-xs text-muted-foreground">
        {address.city}, {address.state} {address.postalCode}, {address.country}
      </p>
    </button>
  )
}

function CheckoutInner({
  cart,
  clientSecret,
  orderNumber,
  total,
  currency,
}: {
  cart: CartSummary
  clientSecret: string
  orderNumber: string
  total: number
  currency: string
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      }),
    [currency],
  )

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsSubmitting(true)

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/account/orders`,
      },
    })

    if (result.error) {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card className="border-yellow-900/30">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckoutPaymentElement />
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-4 border-yellow-900/30">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Cart items</span>
              <span>{cart.itemCount}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Order ref</span>
              <span>{orderNumber}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatter.format(total)}</span>
            </div>
            <Button
              className="w-full bg-violet-700 text-white hover:bg-violet-800"
              disabled={isSubmitting || !stripe || !elements}
            >
              <Lock className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Processing...' : 'Pay now'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}

export function CheckoutForm() {
  const [cart, setCart] = useState<CartSummary | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<string>('')
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<string>('')
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true)
  const [email, setEmail] = useState('')
  const [newAddress, setNewAddress] = useState<NewAddressInput>(defaultAddressInput)
  const [intent, setIntent] = useState<CheckoutIntentResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingIntent, setIsCreatingIntent] = useState(false)
  const [isSavingAddress, setIsSavingAddress] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [cartResponse, addressResponse] = await Promise.all([
        fetch('/api/cart'),
        fetch('/api/account/addresses'),
      ])

      const cartPayload = (await cartResponse.json()) as {
        success: boolean
        data: CartSummary
      }
      const addressPayload = (await addressResponse.json()) as {
        success: boolean
        data: Address[]
        error?: { code?: string }
      }

      if (cartPayload.success) {
        setCart(cartPayload.data)
      }

      if (addressPayload.success) {
        setAddresses(addressPayload.data)
        const defaultAddress = addressPayload.data.find((item) => item.isDefault) ?? addressPayload.data[0]
        if (defaultAddress) {
          setSelectedShippingAddressId(defaultAddress.id)
          setSelectedBillingAddressId(defaultAddress.id)
        }
      } else if (addressPayload.error?.code !== 'UNAUTHORIZED') {
        setError('Unable to load your saved addresses right now.')
      }
    } catch {
      setError('Unable to load checkout details. Please refresh and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadData()
    }, 0)

    return () => clearTimeout(timeout)
  }, [])

  const createIntent = async () => {
    if (!cart?.id || !email || !selectedShippingAddressId) {
      setError('Please choose shipping address and provide billing email.')
      return
    }

    setIsCreatingIntent(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId: cart.id,
          email,
          shippingAddressId: selectedShippingAddressId,
          billingAddressId: useShippingAsBilling
            ? selectedShippingAddressId
            : selectedBillingAddressId,
        }),
      })

      const payload = (await response.json()) as {
        success: boolean
        data: CheckoutIntentResponse
        error?: { message?: string }
      }

      if (!payload.success) {
        setError(payload.error?.message ?? 'Unable to initialize payment intent.')
        return
      }

      setIntent(payload.data)
    } catch {
      setError('Unable to initialize payment intent.')
    } finally {
      setIsCreatingIntent(false)
    }
  }

  const createAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSavingAddress(true)
    setError(null)

    try {
      const response = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress),
      })

      const payload = (await response.json()) as {
        success: boolean
        data: Address
        error?: { message?: string }
      }

      if (!payload.success) {
        setError(payload.error?.message ?? 'Unable to save address.')
        return
      }

      setAddresses((previous) => [payload.data, ...previous])
      setSelectedShippingAddressId(payload.data.id)
      setSelectedBillingAddressId(payload.data.id)
      setNewAddress(defaultAddressInput)
    } catch {
      setError('Unable to save address.')
    } finally {
      setIsSavingAddress(false)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Preparing secure checkout...</p>
  }

  if (!cart || cart.itemCount === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="mb-4 text-sm text-muted-foreground">Your cart is empty. Add inventory before checkout.</p>
          <Link href="/cart">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Cart
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-yellow-900/30">
        <CardHeader>
          <CardTitle>Shipping & Billing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="billing-email">Billing Email</Label>
            <Input
              id="billing-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="buyer@repairshop.com"
            />
          </div>

          {addresses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-sm font-medium">Shipping address</p>
                {addresses.map((address) => (
                  <AddressCard
                    key={`shipping-${address.id}`}
                    address={address}
                    selected={selectedShippingAddressId === address.id}
                    onSelect={() => setSelectedShippingAddressId(address.id)}
                  />
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Billing address</p>
                  <button
                    type="button"
                    onClick={() => setUseShippingAsBilling((value) => !value)}
                    className="text-xs text-violet-700 hover:text-violet-800"
                  >
                    {useShippingAsBilling ? 'Using shipping address' : 'Select separately'}
                  </button>
                </div>
                {addresses.map((address) => (
                  <AddressCard
                    key={`billing-${address.id}`}
                    address={address}
                    selected={
                      useShippingAsBilling
                        ? selectedShippingAddressId === address.id
                        : selectedBillingAddressId === address.id
                    }
                    onSelect={() => setSelectedBillingAddressId(address.id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-900">
              No saved addresses found. Add one below to proceed.
            </p>
          )}

          <form onSubmit={createAddress} className="space-y-3 rounded-lg border border-dashed border-yellow-900/30 p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <PlusCircle className="h-4 w-4 text-violet-700" />
              Add new address
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                placeholder="Label"
                value={newAddress.label}
                onChange={(event) => setNewAddress((value) => ({ ...value, label: event.target.value }))}
              />
              <Input
                placeholder="Full name"
                value={newAddress.fullName}
                onChange={(event) => setNewAddress((value) => ({ ...value, fullName: event.target.value }))}
                required
              />
              <Input
                placeholder="Line 1"
                value={newAddress.line1}
                onChange={(event) => setNewAddress((value) => ({ ...value, line1: event.target.value }))}
                required
              />
              <Input
                placeholder="Line 2"
                value={newAddress.line2}
                onChange={(event) => setNewAddress((value) => ({ ...value, line2: event.target.value }))}
              />
              <Input
                placeholder="City"
                value={newAddress.city}
                onChange={(event) => setNewAddress((value) => ({ ...value, city: event.target.value }))}
                required
              />
              <Input
                placeholder="State"
                value={newAddress.state}
                onChange={(event) => setNewAddress((value) => ({ ...value, state: event.target.value }))}
                required
              />
              <Input
                placeholder="Postal code"
                value={newAddress.postalCode}
                onChange={(event) => setNewAddress((value) => ({ ...value, postalCode: event.target.value }))}
                required
              />
              <Input
                placeholder="Country code (US)"
                value={newAddress.country}
                onChange={(event) => setNewAddress((value) => ({ ...value, country: event.target.value.toUpperCase() }))}
                required
              />
            </div>
            <Button type="submit" variant="outline" disabled={isSavingAddress}>
              {isSavingAddress ? 'Saving...' : 'Save address'}
            </Button>
          </form>

          <Button
            type="button"
            onClick={createIntent}
            className="bg-violet-700 text-white hover:bg-violet-800"
            disabled={isCreatingIntent || !selectedShippingAddressId || !email}
          >
            {isCreatingIntent ? 'Initializing payment...' : 'Continue to secure payment'}
          </Button>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          {intent ? (
            <p className="flex items-center gap-2 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Payment intent ready. Complete payment below.
            </p>
          ) : null}
        </CardContent>
      </Card>

      {intent ? (
        <Elements stripe={stripePromise} options={{ clientSecret: intent.clientSecret }}>
          <CheckoutInner
            cart={cart}
            clientSecret={intent.clientSecret}
            orderNumber={intent.orderNumber}
            total={intent.total}
            currency={intent.currency}
          />
        </Elements>
      ) : null}
    </div>
  )
}
