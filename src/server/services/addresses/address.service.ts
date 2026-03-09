import 'server-only'

import { prisma } from '@/lib/prisma'
import type {
  AddressCreateInput,
  AddressUpdateInput,
} from '@/server/validators/address.validator'

const addressSelect = {
  id: true,
  label: true,
  fullName: true,
  company: true,
  line1: true,
  line2: true,
  city: true,
  state: true,
  postalCode: true,
  country: true,
  phone: true,
  isDefault: true,
  createdAt: true,
  updatedAt: true,
} as const

const toAddressResponse = (address: {
  id: string
  label: string | null
  fullName: string
  company: string | null
  line1: string
  line2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  phone: string | null
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}) => ({
  ...address,
  createdAt: address.createdAt.toISOString(),
  updatedAt: address.updatedAt.toISOString(),
})

export const listAddresses = async (userId: string) => {
  const addresses = await prisma.address.findMany({
    where: { userId },
    select: addressSelect,
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  })

  return addresses.map(toAddressResponse)
}

export const createAddress = async (userId: string, input: AddressCreateInput) => {
  return prisma.$transaction(async (tx) => {
    if (input.isDefault) {
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      })
    }

    const existingCount = await tx.address.count({ where: { userId } })

    const address = await tx.address.create({
      data: {
        userId,
        label: input.label,
        fullName: input.fullName,
        company: input.company,
        line1: input.line1,
        line2: input.line2,
        city: input.city,
        state: input.state,
        postalCode: input.postalCode,
        country: input.country,
        phone: input.phone,
        isDefault: input.isDefault ?? existingCount === 0,
      },
      select: addressSelect,
    })

    return toAddressResponse(address)
  })
}

export const updateAddress = async (
  userId: string,
  addressId: string,
  input: AddressUpdateInput,
) => {
  return prisma.$transaction(async (tx) => {
    const existingAddress = await tx.address.findFirst({
      where: { id: addressId, userId },
      select: { id: true },
    })

    if (!existingAddress) {
      throw new Error('ADDRESS_NOT_FOUND')
    }

    if (input.isDefault) {
      await tx.address.updateMany({
        where: {
          userId,
          isDefault: true,
          id: { not: addressId },
        },
        data: { isDefault: false },
      })
    }

    const updated = await tx.address.update({
      where: { id: addressId },
      data: input,
      select: addressSelect,
    })

    return toAddressResponse(updated)
  })
}

export const deleteAddress = async (userId: string, addressId: string) => {
  return prisma.$transaction(async (tx) => {
    const existingAddress = await tx.address.findFirst({
      where: { id: addressId, userId },
      select: { id: true, isDefault: true },
    })

    if (!existingAddress) {
      throw new Error('ADDRESS_NOT_FOUND')
    }

    await tx.address.delete({ where: { id: addressId } })

    if (existingAddress.isDefault) {
      const fallback = await tx.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        select: { id: true },
      })

      if (fallback) {
        await tx.address.update({
          where: { id: fallback.id },
          data: { isDefault: true },
        })
      }
    }
  })
}

export const setDefaultAddress = async (userId: string, addressId: string) => {
  return prisma.$transaction(async (tx) => {
    const existingAddress = await tx.address.findFirst({
      where: { id: addressId, userId },
      select: { id: true },
    })

    if (!existingAddress) {
      throw new Error('ADDRESS_NOT_FOUND')
    }

    await tx.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    })

    const updated = await tx.address.update({
      where: { id: addressId },
      data: { isDefault: true },
      select: addressSelect,
    })

    return toAddressResponse(updated)
  })
}
