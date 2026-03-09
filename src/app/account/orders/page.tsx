import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AccountOrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/account/orders')
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: 25,
  })

  return (
    <main className="container px-4 py-10 md:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-3xl font-bold">Order History</h1>
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">No orders yet. Complete checkout to see finalized orders here.</CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="border-yellow-900/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{order.orderNumber}</span>
                  <span className="text-sm text-muted-foreground">{order.status} · {order.paymentStatus}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>Total: ${Number(order.total).toFixed(2)}</p>
                <p>Items: {order.items.length}</p>
                <p className="text-muted-foreground">Created: {order.createdAt.toLocaleString()}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}
