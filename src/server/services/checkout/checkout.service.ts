import 'server-only'

import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import type { CheckoutIntentInput, InlineAddress } from '@/lib/validations/checkout'

const FLAT_SHIPPING_USD = new Prisma.Decimal(15)
const ZERO_TAX_USD = new Prisma.Decimal(0)

const toMinorUnit = (amount: Prisma.Decimal) => Math.round(Number(amount) * 100)

const generateOrderNumber = () =>
  `FC-${Date.now()}-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')}`

export type CheckoutIntentResult = {
  orderId: string
  orderNumber: string
  paymentIntentId: string
  clientSecret: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  currency: string
}

// Helper to get cart by either userId or guestCartId
async function getCartForCheckout(
  tx: Prisma.TransactionClient,
  input: { userId?: string; guestCartId?: string; cartId?: string },
) {
  const { userId, guestCartId, cartId } = input

  // If userId is provided, use it; otherwise use guestCartId
  const whereClause = userId
    ? { id: cartId, userId, status: 'ACTIVE' as const }
    : { id: guestCartId, status: 'ACTIVE' as const, userId: null }

  return tx.cart.findFirst({
    where: whereClause,
    include: {
      items: {
        include: {
          part: {
            include: {
              inventory: {
                select: {
                  quantity: true,
                  reserved: true,
                },
              },
            },
          },
        },
      },
    },
  })
}

// Helper to get address data for order
export interface OrderAddressData {
  fullName: string
  line1: string
  line2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  phone: string | null
  company?: string | null
}

function addressToOrderData(address: InlineAddress): OrderAddressData {
  return {
    fullName: address.fullName,
    line1: address.line1,
    line2: address.line2 || null,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    phone: address.phone || null,
  }
}

export const createCheckoutIntent = async (
  userId: string | undefined,
  input: CheckoutIntentInput,
): Promise<CheckoutIntentResult> => {
  const isGuest = !userId
  
  return prisma.$transaction(async (tx) => {
    // Get cart - either by userId (authenticated) or guestCartId (guest)
    const cart = await getCartForCheckout(tx, {
      userId: userId,
      guestCartId: input.guestCartId,
      cartId: input.cartId,
    })

    if (!cart || cart.items.length === 0) {
      throw new Error('CART_EMPTY')
    }

    let shippingAddressData: OrderAddressData
    let billingAddressData: OrderAddressData

    if (isGuest) {
      // Guest checkout: use inline address data
      if (!input.shippingAddress) {
        throw new Error('SHIPPING_ADDRESS_REQUIRED')
      }

      shippingAddressData = addressToOrderData(input.shippingAddress)
      
      if (input.useShippingAsBilling || !input.billingAddress) {
        billingAddressData = shippingAddressData
      } else {
        billingAddressData = addressToOrderData(input.billingAddress)
      }
    } else {
      // Authenticated checkout: use saved addresses
      const shippingAddress = await tx.address.findFirst({
        where: { id: input.shippingAddressId, userId },
      })

      if (!shippingAddress) {
        throw new Error('SHIPPING_ADDRESS_NOT_FOUND')
      }

      const billingAddress = await tx.address.findFirst({
        where: { id: input.billingAddressId ?? input.shippingAddressId, userId },
      })

      if (!billingAddress) {
        throw new Error('BILLING_ADDRESS_NOT_FOUND')
      }

      shippingAddressData = {
        fullName: shippingAddress.fullName,
        line1: shippingAddress.line1,
        line2: shippingAddress.line2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
        company: shippingAddress.company,
      }

      billingAddressData = {
        fullName: billingAddress.fullName,
        line1: billingAddress.line1,
        line2: billingAddress.line2,
        city: billingAddress.city,
        state: billingAddress.state,
        postalCode: billingAddress.postalCode,
        country: billingAddress.country,
        phone: billingAddress.phone,
        company: billingAddress.company,
      }
    }

    const orderItems: Array<{
      partId: string
      sku: string
      name: string
      quality: string | null
      color: string | null
      price: Prisma.Decimal
      quantity: number
      total: Prisma.Decimal
    }> = []

    let subtotal = new Prisma.Decimal(0)

    for (const item of cart.items) {
      const inventory = item.part.inventory
      const availableInventory = inventory ? inventory.quantity - inventory.reserved : 0

      if (!item.part.isActive || availableInventory < item.quantity) {
        throw new Error('ITEM_UNAVAILABLE')
      }

      const unitPrice = item.part.price
      const lineTotal = unitPrice.mul(item.quantity)

      subtotal = subtotal.plus(lineTotal)

      orderItems.push({
        partId: item.partId,
        sku: item.part.sku,
        name: item.part.name,
        quality: item.part.quality,
        color: item.part.color,
        price: unitPrice,
        quantity: item.quantity,
        total: lineTotal,
      })
    }

    const shipping = FLAT_SHIPPING_USD
    const tax = ZERO_TAX_USD
    const total = subtotal.plus(shipping).plus(tax)

    // For guests, we don't associate the order with a userId
    // The order will be tracked by email and can be retrieved via orderNumber
    const order = await tx.order.create({
      data: {
        userId: userId ?? null, // Allow null for guest orders
        orderNumber: generateOrderNumber(),
        status: 'PENDING',
        paymentStatus: 'PENDING',
        subtotal,
        shipping,
        tax,
        total,
        shippingName: shippingAddressData.fullName,
        shippingCompany: shippingAddressData.company,
        shippingAddr: shippingAddressData.line1,
        shippingCity: shippingAddressData.city,
        shippingState: shippingAddressData.state,
        shippingZip: shippingAddressData.postalCode,
        shippingCountry: shippingAddressData.country,
        shippingPhone: shippingAddressData.phone,
        billingName: billingAddressData.fullName,
        billingCompany: billingAddressData.company,
        billingAddr: billingAddressData.line1,
        billingCity: billingAddressData.city,
        billingState: billingAddressData.state,
        billingZip: billingAddressData.postalCode,
        billingCountry: billingAddressData.country,
        // Store addresses inline for guest checkout
        shippingAddressId: isGuest ? null : input.shippingAddressId ?? null,
        billingAddressId: isGuest ? null : input.billingAddressId ?? null,
        items: { create: orderItems },
      },
    })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: toMinorUnit(total),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      receipt_email: input.email,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId: userId ?? 'guest',
        guestEmail: isGuest ? input.email : undefined,
      },
    })

    if (!paymentIntent.client_secret) {
      throw new Error('INTENT_SECRET_MISSING')
    }

    await tx.order.update({
      where: { id: order.id },
      data: { stripePaymentIntentId: paymentIntent.id },
    })

    // Clear the guest cart after successful checkout
    if (isGuest && input.guestCartId) {
      await tx.cart.update({
        where: { id: input.guestCartId },
        data: { status: 'COMPLETED' },
      })
    }

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      subtotal: Number(subtotal),
      shipping: Number(shipping),
      tax: Number(tax),
      total: Number(total),
      currency: 'USD',
    }
  })
}
