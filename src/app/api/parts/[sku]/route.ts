import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

type RouteContext = {
  params: Promise<{
    sku: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { sku } = await context.params;

    const part = await db.part.findFirst({
      where: {
        sku,
        isActive: true,
      },
      include: {
        device: {
          select: {
            id: true,
            name: true,
            slug: true,
            modelNumber: true,
            image: true,
            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
              },
            },
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            icon: true,
          },
        },
        inventory: {
          select: {
            quantity: true,
            reserved: true,
            reorderPoint: true,
            location: true,
            lastRestock: true,
          },
        },
      },
    });

    if (!part) {
      return NextResponse.json(
        {
          success: false,
          error: 'Part not found',
        },
        { status: 404 }
      );
    }

    // Parse images JSON if it exists
    let images: string[] = [];
    if (part.images) {
      try {
        images = JSON.parse(part.images);
      } catch {
        images = [];
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: part.id,
        sku: part.sku,
        name: part.name,
        slug: part.slug,
        description: part.description,
        price: part.price,
        comparePrice: part.comparePrice,
        cost: part.cost,
        image: part.image,
        images,
        quality: part.quality,
        color: part.color,
        weight: part.weight,
        barcode: part.barcode,
        minOrderQty: part.minOrderQty,
        isFeatured: part.isFeatured,
        createdAt: part.createdAt,
        updatedAt: part.updatedAt,
        device: part.device,
        category: part.category,
        inventory: part.inventory
          ? {
              quantity: part.inventory.quantity,
              reserved: part.inventory.reserved,
              available: part.inventory.quantity - part.inventory.reserved,
              reorderPoint: part.inventory.reorderPoint,
              location: part.inventory.location,
              lastRestock: part.inventory.lastRestock,
              isLowStock: part.inventory.quantity <= part.inventory.reorderPoint,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Error fetching part:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch part',
      },
      { status: 500 }
    );
  }
}
