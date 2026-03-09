import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { AddressManager } from '@/components/account/address-manager'
import { authOptions } from '@/lib/auth'

export default async function AccountAddressesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/account/addresses')
  }

  return (
    <main className="container px-4 py-10 md:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-3xl font-bold">Saved Addresses</h1>
        <AddressManager />
      </div>
    </main>
  )
}
