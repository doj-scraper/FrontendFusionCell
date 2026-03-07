import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;
    
    // Filter parameters
    const deviceSlug = searchParams.get('device');
    const categorySlug = searchParams.get('category');
    const brandSlug = searchParams.get('brand');
    const quality = searchParams.get('quality');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const featured = searchParams.get('featured');

    // Build where clause
    const whereClause: Record<string, unknown> = {
      isActive: true,
    };

    if (deviceSlug) {
      whereClause.device = {
        slug: deviceSlug,
        isActive: true,
      };
    }

    if (categorySlug) {
      whereClause.category = {
        slug: categorySlug,
        isActive: true,
      };
    }

    if (brandSlug) {
      whereClause.device = {
        ...whereClause.device,
        brand: {
          slug: brandSlug,
          isActive: true,
        },
      };
    }

    if (quality) {
      whereClause.quality = quality;
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) {
        whereClause.price.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        whereClause.price.lte = parseFloat(maxPrice);
      }
    }

    if (featured === 'true') {
      whereClause.isFeatured = true;
    }

    if (inStock === 'true') {
      whereClause.inventory = {
        quantity: {
          gt: 0,
        },
      };
    }

    // Get total count for pagination
    const totalCount = await db.part.count({
      where: whereClause,
    });

    // Get parts with pagination
    const parts = await db.part.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: [
        { isFeatured: 'desc' },
        { name: 'asc' },
      ],
      include: {
        device: {
          select: {
            id: true,
            name: true,
            slug: true,
            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
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
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
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
        page,
        limit,
        totalCount,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching parts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch parts',
      },
      { status: 500 }
    );
  }
}
