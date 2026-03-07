import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = params;

    const device = await db.device.findFirst({
      where: {
        slug,
        isActive: true,
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
        parts: {
          where: {
            isActive: true,
          },
          orderBy: [
            { isFeatured: 'desc' },
            { name: 'asc' },
          ],
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                icon: true,
              },
            },
            inventory: {
              select: {
                quantity: true,
                reserved: true,
                location: true,
              },
            },
          },
        },
      },
    });

    if (!device) {
      return NextResponse.json(
        {
          success: false,
          error: 'Device not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: device.id,
        name: device.name,
        slug: device.slug,
        modelNumber: device.modelNumber,
        image: device.image,
        releaseYear: device.releaseYear,
        description: device.description,
        brand: device.brand,
        parts: device.parts.map((part) => ({
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
      },
    });
  } catch (error) {
    console.error('Error fetching device:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch device',
      },
      { status: 500 }
    );
  }
}
