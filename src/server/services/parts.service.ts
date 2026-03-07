import { Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import { type PartsQueryInput } from "@/server/validators/parts.validator";

export class PartsService {
  static async getParts(filters: PartsQueryInput) {
    const whereClause: Prisma.PartWhereInput = {
      isActive: true,
    };

    if (filters.device) {
      whereClause.device = { slug: filters.device, isActive: true };
    }

    if (filters.category) {
      whereClause.category = { slug: filters.category, isActive: true };
    }

    if (filters.brand) {
      whereClause.device = {
        ...(whereClause.device ?? {}),
        brand: {
          slug: filters.brand,
          isActive: true,
        },
      };
    }

    if (filters.quality) {
      whereClause.quality = filters.quality;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      whereClause.price = {};
      if (filters.minPrice !== undefined) {
        whereClause.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        whereClause.price.lte = filters.maxPrice;
      }
    }

    if (filters.featured === "true") {
      whereClause.isFeatured = true;
    }

    if (filters.inStock === "true") {
      whereClause.inventory = { quantity: { gt: 0 } };
    }

    const skip = (filters.page - 1) * filters.limit;

    const [totalCount, parts] = await Promise.all([
      db.part.count({ where: whereClause }),
      db.part.findMany({
        where: whereClause,
        skip,
        take: filters.limit,
        orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
        include: {
          device: {
            select: {
              id: true,
              name: true,
              slug: true,
              brand: { select: { id: true, name: true, slug: true } },
            },
          },
          category: { select: { id: true, name: true, slug: true, icon: true } },
          inventory: { select: { quantity: true, reserved: true, location: true } },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / filters.limit);

    return {
      data: parts.map((part) => ({
        id: part.id,
        sku: part.sku,
        name: part.name,
        slug: part.slug,
        description: part.description,
        price: part.price,
        comparePrice: part.comparePrice,
        image: part.image,
        quality: part.quality,
        color: part.color,
        isFeatured: part.isFeatured,
        minOrderQty: part.minOrderQty,
        device: part.device,
        category: part.category,
        inventory: part.inventory
          ? {
              quantity: part.inventory.quantity,
              reserved: part.inventory.reserved,
              available: part.inventory.quantity - part.inventory.reserved,
              location: part.inventory.location,
            }
          : null,
      })),
      pagination: {
        page: filters.page,
        limit: filters.limit,
        totalCount,
        totalPages,
        hasMore: filters.page < totalPages,
      },
    };
  }
}
