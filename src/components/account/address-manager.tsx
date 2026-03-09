'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Star, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

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

const initialForm = {
  label: '',
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

export function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)

  const loadAddresses = async () => {
    setIsLoading(true)
    const response = await fetch('/api/account/addresses')
    const payload = (await response.json()) as { success: boolean; data: Address[] }
    if (payload.success) {
      setAddresses(payload.data)
      setError(null)
    } else {
      setError('Unable to load addresses.')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadAddresses()
    }, 0)

    return () => clearTimeout(timeout)
  }, [])

  const onCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const response = await fetch('/api/account/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const payload = (await response.json()) as { success: boolean; data: Address }

    if (payload.success) {
      setForm(initialForm)
      await loadAddresses()
      return
    }

    setError('Unable to create address.')
  }

  const onDelete = async (addressId: string) => {
    const response = await fetch(`/api/account/addresses/${addressId}`, { method: 'DELETE' })

    const payload = (await response.json()) as { success: boolean }

    if (payload.success) {
      await loadAddresses()
      return
    }

    setError('Unable to delete address.')
  }

  const onSetDefault = async (addressId: string) => {
    const response = await fetch(`/api/account/addresses/${addressId}/default`, { method: 'POST' })

    const payload = (await response.json()) as { success: boolean }

    if (payload.success) {
      await loadAddresses()
      return
    }

    setError('Unable to set default address.')
  }

  return (
    <div className="space-y-6">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Card className="border-yellow-900/30">
        <CardHeader>
          <CardTitle>Add Address</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreate} className="grid gap-3 md:grid-cols-2">
            <Input placeholder="Label" value={form.label} onChange={(event) => setForm((state) => ({ ...state, label: event.target.value }))} />
            <Input placeholder="Full name" value={form.fullName} onChange={(event) => setForm((state) => ({ ...state, fullName: event.target.value }))} required />
            <Input placeholder="Line 1" value={form.line1} onChange={(event) => setForm((state) => ({ ...state, line1: event.target.value }))} required />
            <Input placeholder="Line 2" value={form.line2} onChange={(event) => setForm((state) => ({ ...state, line2: event.target.value }))} />
            <Input placeholder="City" value={form.city} onChange={(event) => setForm((state) => ({ ...state, city: event.target.value }))} required />
            <Input placeholder="State" value={form.state} onChange={(event) => setForm((state) => ({ ...state, state: event.target.value }))} required />
            <Input placeholder="Postal code" value={form.postalCode} onChange={(event) => setForm((state) => ({ ...state, postalCode: event.target.value }))} required />
            <Input placeholder="Country code" value={form.country} onChange={(event) => setForm((state) => ({ ...state, country: event.target.value.toUpperCase() }))} required />
            <div className="md:col-span-2">
              <Button type="submit" className="bg-violet-700 text-white hover:bg-violet-800">
                Save Address
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading addresses...</p>
        ) : (
          addresses.map((address) => (
            <Card key={address.id} className="border-yellow-900/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{address.label ?? 'Saved address'}</span>
                  {address.isDefault ? (
                    <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-900">Default</span>
                  ) : null}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="font-medium">{address.fullName}</p>
                <p>{address.line1}</p>
                {address.line2 ? <p>{address.line2}</p> : null}
                <p>
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p>{address.country}</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onSetDefault(address.id)}>
                    <Star className="mr-1 h-3 w-3" />
                    Default
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(address.id)}>
                    <Trash2 className="mr-1 h-3 w-3" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
