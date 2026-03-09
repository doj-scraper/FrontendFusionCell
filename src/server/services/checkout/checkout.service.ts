import 'server-only'

import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import type { CheckoutIntentInput } from '@/lib/validations/checkout'

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

export const createCheckoutIntent = async (
  userId: string,
  input: CheckoutIntentInput,
): Promise<CheckoutIntentResult> => {
  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findFirst({
      where: {
        id: input.cartId,
        userId,
        status: 'ACTIVE',
      },
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

    if (!cart || cart.items.length === 0) {
      throw new Error('CART_EMPTY')
    }

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

    const order = await tx.order.create({
      data: {
        userId,
        orderNumber: generateOrderNumber(),
        status: 'PENDING',
        paymentStatus: 'PENDING',
        subtotal,
        shipping,
        tax,
        total,
        shippingName: shippingAddress.fullName,
        shippingCompany: shippingAddress.company,
        shippingAddr: shippingAddress.line1,
        shippingCity: shippingAddress.city,
        shippingState: shippingAddress.state,
        shippingZip: shippingAddress.postalCode,
        shippingCountry: shippingAddress.country,
        shippingPhone: shippingAddress.phone,
        billingName: billingAddress.fullName,
        billingCompany: billingAddress.company,
        billingAddr: billingAddress.line1,
        billingCity: billingAddress.city,
        billingState: billingAddress.state,
        billingZip: billingAddress.postalCode,
        billingCountry: billingAddress.country,
        shippingAddressId: shippingAddress.id,
        billingAddressId: billingAddress.id,
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
        userId,
      },
    })

    if (!paymentIntent.client_secret) {
      throw new Error('INTENT_SECRET_MISSING')
    }

    await tx.order.update({
      where: { id: order.id },
      data: { stripePaymentIntentId: paymentIntent.id },
    })

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
