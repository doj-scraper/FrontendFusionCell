import 'server-only'

import { CartStatus, Prisma } from '@prisma/client'
import { createHmac, timingSafeEqual } from 'crypto'

import { env } from '@/lib/env'
import { prisma } from '@/lib/prisma'

const GUEST_CART_COOKIE_NAME = 'guestCartId'
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

const cartWithItemsSelect = {
  id: true,
  userId: true,
  status: true,
  currency: true,
  subtotal: true,
  itemCount: true,
  lastActivityAt: true,
  createdAt: true,
  updatedAt: true,
  items: {
    include: {
      part: {
        select: {
          id: true,
          sku: true,
          name: true,
          slug: true,
          image: true,
          isActive: true,
          inventory: {
            select: {
              quantity: true,
              reserved: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'asc' as const,
    },
  },
}

type CartWithItems = Prisma.CartGetPayload<{ select: typeof cartWithItemsSelect }>

const signCartId = (cartId: string) =>
  createHmac('sha256', env.NEXTAUTH_SECRET).update(cartId).digest('hex')

export const serializeGuestCartCookie = (cartId: string) => `${cartId}.${signCartId(cartId)}`

export const parseGuestCartCookie = (value?: string | null) => {
  if (!value) {
    return null
  }

  const [cartId, signature] = value.split('.')

  if (!cartId || !signature) {
    return null
  }

  const expectedSignature = signCartId(cartId)

  try {
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null
    }
  } catch {
    return null
  }

  return cartId
}

const computeLineTotal = (unitPrice: Prisma.Decimal, quantity: number) =>
  unitPrice.mul(new Prisma.Decimal(quantity))

const recomputeCartTotals = async (tx: Prisma.TransactionClient, cartId: string) => {
  const items = await tx.cartItem.findMany({
    where: { cartId },
    select: { quantity: true, lineTotal: true },
  })

  const subtotal = items.reduce(
    (sum, item) => sum.plus(item.lineTotal),
    new Prisma.Decimal(0),
  )
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  await tx.cart.update({
    where: { id: cartId },
    data: {
      subtotal,
      itemCount,
      lastActivityAt: new Date(),
    },
  })
}

const pruneInactiveCartItems = async (tx: Prisma.TransactionClient, cartId: string) => {
  const items = await tx.cartItem.findMany({
    where: { cartId },
    include: {
      part: {
        select: {
          isActive: true,
          inventory: { select: { quantity: true, reserved: true } },
        },
      },
    },
  })

  const itemIdsToRemove = items
    .filter((item) => {
      const inventory = item.part.inventory
      const availableInventory = inventory ? inventory.quantity - inventory.reserved : 0
      return !item.part.isActive || availableInventory <= 0
    })
    .map((item) => item.id)

  if (itemIdsToRemove.length > 0) {
    await tx.cartItem.deleteMany({ where: { id: { in: itemIdsToRemove } } })
  }
}

const getOrCreateGuestCart = async (tx: Prisma.TransactionClient, cartId?: string | null) => {
  if (cartId) {
    const existing = await tx.cart.findFirst({
      where: { id: cartId, userId: null, status: CartStatus.ACTIVE },
      select: { id: true },
    })

    if (existing) {
      return existing.id
    }
  }

  const created = await tx.cart.create({
    data: {
      status: CartStatus.ACTIVE,
    },
    select: { id: true },
  })

  return created.id
}

const getOrCreateUserCart = async (tx: Prisma.TransactionClient, userId: string) => {
  const existing = await tx.cart.findFirst({
    where: { userId, status: CartStatus.ACTIVE },
    select: { id: true },
  })

  if (existing) {
    return existing.id
  }

  const created = await tx.cart.create({
    data: {
      userId,
      status: CartStatus.ACTIVE,
    },
    select: { id: true },
  })

  return created.id
}

const mergeGuestCartIntoUserCart = async (
  tx: Prisma.TransactionClient,
  guestCartId: string,
  userCartId: string,
) => {
  const guestItems = await tx.cartItem.findMany({
    where: { cartId: guestCartId },
    select: { partId: true, quantity: true },
    orderBy: [{ partId: 'asc' }],
  })

  for (const item of guestItems) {
    const part = await tx.part.findFirst({
      where: { id: item.partId, isActive: true },
      select: { price: true },
    })

    if (!part) {
      continue
    }

    const existing = await tx.cartItem.findUnique({
      where: { cartId_partId: { cartId: userCartId, partId: item.partId } },
      select: { quantity: true },
    })

    const quantity = (existing?.quantity ?? 0) + item.quantity
    const unitPrice = part.price

    await tx.cartItem.upsert({
      where: { cartId_partId: { cartId: userCartId, partId: item.partId } },
      update: {
        quantity,
        unitPrice,
        lineTotal: computeLineTotal(unitPrice, quantity),
      },
      create: {
        cartId: userCartId,
        partId: item.partId,
        quantity,
        unitPrice,
        lineTotal: computeLineTotal(unitPrice, quantity),
      },
    })
  }

  await tx.cart.update({
    where: { id: guestCartId },
    data: {
      status: CartStatus.ABANDONED,
      mergedIntoId: userCartId,
      lastActivityAt: new Date(),
    },
  })

  await tx.cartItem.deleteMany({ where: { cartId: guestCartId } })
}

const fetchCart = async (tx: Prisma.TransactionClient, cartId: string) =>
  tx.cart.findUniqueOrThrow({ where: { id: cartId }, select: cartWithItemsSelect })

const toCartResponse = (cart: CartWithItems) => ({
  id: cart.id,
  status: cart.status,
  currency: cart.currency,
  subtotal: Number(cart.subtotal),
  itemCount: cart.itemCount,
  items: cart.items.map((item) => ({
    id: item.id,
    partId: item.partId,
    sku: item.part.sku,
    name: item.part.name,
    slug: item.part.slug,
    image: item.part.image,
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice),
    lineTotal: Number(item.lineTotal),
    availableInventory: item.part.inventory
      ? Math.max(item.part.inventory.quantity - item.part.inventory.reserved, 0)
      : 0,
  })),
  updatedAt: cart.updatedAt.toISOString(),
})

export type CartResponse = ReturnType<typeof toCartResponse>


const resolveCartId = async (
  tx: Prisma.TransactionClient,
  input: { userId?: string | null; guestCartId?: string | null },
) => {
  let cartId: string
  let clearGuestCookie = false

  if (input.userId) {
    cartId = await getOrCreateUserCart(tx, input.userId)

    if (input.guestCartId) {
      const guestCart = await tx.cart.findFirst({
        where: {
          id: input.guestCartId,
          userId: null,
          status: CartStatus.ACTIVE,
        },
        select: { id: true },
      })

      if (guestCart) {
        await mergeGuestCartIntoUserCart(tx, guestCart.id, cartId)
        clearGuestCookie = true
      }
    }
  } else {
    cartId = await getOrCreateGuestCart(tx, input.guestCartId)
  }

  return {
    cartId,
    clearGuestCookie,
    guestCartId: input.userId ? null : cartId,
  }
}

export async function getActiveCart(input: { userId?: string | null; guestCartId?: string | null }) {
  return prisma.$transaction(async (tx) => {
    const resolved = await resolveCartId(tx, input)

    await pruneInactiveCartItems(tx, resolved.cartId)
    await recomputeCartTotals(tx, resolved.cartId)

    const cart = await fetchCart(tx, resolved.cartId)

    return {
      cart: toCartResponse(cart),
      guestCartId: resolved.guestCartId,
      clearGuestCookie: resolved.clearGuestCookie,
    }
  })
}

export async function mutateCartItem(
  input:
    | { action: 'add'; userId?: string | null; guestCartId?: string | null; sku: string; quantity: number }
    | { action: 'set'; userId?: string | null; guestCartId?: string | null; itemId: string; quantity: number }
    | { action: 'remove'; userId?: string | null; guestCartId?: string | null; itemId: string },
) {
  return prisma.$transaction(async (tx) => {
    const resolved = await resolveCartId(tx, {
      userId: input.userId,
      guestCartId: input.guestCartId,
    })
    const cartId = resolved.cartId

    if (input.action === 'add') {
      const part = await tx.part.findFirst({
        where: { sku: input.sku, isActive: true },
        include: { inventory: true },
      })

      if (!part) {
        throw new Error('PART_NOT_FOUND')
      }

      const availableInventory = part.inventory
        ? part.inventory.quantity - part.inventory.reserved
        : 0

      if (availableInventory <= 0) {
        throw new Error('PART_UNAVAILABLE')
      }

      const existing = await tx.cartItem.findUnique({
        where: { cartId_partId: { cartId, partId: part.id } },
        select: { quantity: true },
      })

      const quantity = (existing?.quantity ?? 0) + input.quantity

      await tx.cartItem.upsert({
        where: { cartId_partId: { cartId, partId: part.id } },
        update: {
          quantity,
          unitPrice: part.price,
          lineTotal: computeLineTotal(part.price, quantity),
        },
        create: {
          cartId,
          partId: part.id,
          quantity,
          unitPrice: part.price,
          lineTotal: computeLineTotal(part.price, quantity),
        },
      })
    }

    if (input.action === 'set') {
      const existing = await tx.cartItem.findFirst({
        where: { id: input.itemId, cartId },
      })

      if (!existing) {
        throw new Error('ITEM_NOT_FOUND')
      }

      const unitPrice = existing.unitPrice

      await tx.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: input.quantity,
          lineTotal: computeLineTotal(unitPrice, input.quantity),
        },
      })
    }

    if (input.action === 'remove') {
      await tx.cartItem.deleteMany({
        where: {
          id: input.itemId,
          cartId,
        },
      })
    }

    await pruneInactiveCartItems(tx, cartId)
    await recomputeCartTotals(tx, cartId)

    const cart = await fetchCart(tx, cartId)

    return {
      cart: toCartResponse(cart),
      guestCartId: input.userId ? null : cart.id,
      clearGuestCookie: resolved.clearGuestCookie,
    }
  })
}

export const guestCartCookieConfig = {
  name: GUEST_CART_COOKIE_NAME,
  maxAge: COOKIE_MAX_AGE_SECONDS,
}
