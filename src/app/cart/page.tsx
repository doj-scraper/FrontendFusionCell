'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Minus, Package, Plus, ShoppingCart, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type CartItem = {
  id: string
  sku: string
  name: string
  slug: string
  image: string | null
  quantity: number
  unitPrice: number
  lineTotal: number
  availableInventory: number
}

type CartResponse = {
  id: string
  currency: string
  subtotal: number
  itemCount: number
  items: CartItem[]
}

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)

  const loadCart = useCallback(async () => {
    setIsLoading(true)

    const response = await fetch('/api/cart', { method: 'GET' })
    const payload = (await response.json()) as { success: boolean; data: CartResponse }

    if (payload.success) {
      setCart(payload.data)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadCart()
    }, 0)

    return () => clearTimeout(timeout)
  }, [loadCart])

  const formatCurrency = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: cart?.currency ?? 'USD',
      }),
    [cart?.currency],
  )

  const updateItem = async (action: 'set' | 'remove', itemId: string, quantity?: number) => {
    setIsMutating(true)

    const response = await fetch('/api/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        action === 'set' ? { action, itemId, quantity } : { action, itemId },
      ),
    })

    const payload = (await response.json()) as { success: boolean; data: CartResponse }

    if (payload.success) {
      setCart(payload.data)
    }

    setIsMutating(false)
  }

  if (isLoading || !cart) {
    return (
      <main className="container px-4 py-10 md:px-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="py-16 text-center text-sm text-muted-foreground">
              Loading your cart...
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="container px-4 py-10 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <ShoppingCart className="h-8 w-8 text-violet-700" />
          Shopping Cart
        </h1>

        {cart.items.length === 0 ? (
          <Card className="border-yellow-900/30">
            <CardContent className="py-16 text-center">
              <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-2xl font-semibold">Your cart is empty</h2>
              <p className="mb-6 text-muted-foreground">Add parts to begin checkout.</p>
              <Link href="/">
                <Button className="bg-violet-700 text-white hover:bg-violet-800">
                  Browse Catalog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {cart.items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                        <Package className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <div className="min-w-52 flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={item.quantity <= 1 || isMutating}
                          onClick={() => updateItem('set', item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={isMutating || item.quantity >= item.availableInventory}
                          onClick={() => updateItem('set', item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency.format(item.lineTotal)}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          disabled={isMutating}
                          onClick={() => updateItem('remove', item.id)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="sticky top-4 border-yellow-900/30">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({cart.itemCount} items)</span>
                    <span>{formatCurrency.format(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency.format(cart.subtotal)}</span>
                  </div>
                  <Link href="/checkout" className="block">
                    <Button className="w-full bg-violet-700 text-white hover:bg-violet-800">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
