import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all'; // all, parts, devices, brands
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query must be at least 2 characters',
        },
        { status: 400 }
      );
    }

    const searchTerm = query.trim().toLowerCase();
    const results = {
      parts: [] as unknown[],
      devices: [] as unknown[],
      brands: [] as unknown[],
    };

    // Search parts
    if (type === 'all' || type === 'parts') {
      const parts = await db.part.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: searchTerm } },
            { sku: { contains: searchTerm } },
            { description: { contains: searchTerm } },
            { slug: { contains: searchTerm } },
          ],
        },
        take: limit,
        orderBy: [
          { isFeatured: 'desc' },
          { name: 'asc' },
        ],
        include: {
          device: {
            select: {
              name: true,
              slug: true,
              brand: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          inventory: {
            select: {
              quantity: true,
              reserved: true,
            },
          },
        },
      });

      results.parts = parts.map((part) => ({
        id: part.id,
        sku: part.sku,
        name: part.name,
        slug: part.slug,
        price: part.price,
        comparePrice: part.comparePrice,
        image: part.image,
        quality: part.quality,
        device: part.device,
        category: part.category,
        available: part.inventory
          ? part.inventory.quantity - part.inventory.reserved
          : 0,
      }));
    }

    // Search devices
    if (type === 'all' || type === 'devices') {
      const devices = await db.device.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: searchTerm } },
            { modelNumber: { contains: searchTerm } },
            { slug: { contains: searchTerm } },
          ],
        },
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          brand: {
            select: {
              name: true,
              slug: true,
              logo: true,
            },
          },
          _count: {
            select: {
              parts: {
                where: {
                  isActive: true,
                },
              },
            },
          },
        },
      });

      results.devices = devices.map((device) => ({
        id: device.id,
        name: device.name,
        slug: device.slug,
        modelNumber: device.modelNumber,
        image: device.image,
        releaseYear: device.releaseYear,
        brand: device.brand,
        partCount: device._count.parts,
      }));
    }

    // Search brands
    if (type === 'all' || type === 'brands') {
      const brands = await db.brand.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: searchTerm } },
            { slug: { contains: searchTerm } },
          ],
        },
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              devices: {
                where: {
                  isActive: true,
                },
              },
            },
          },
        },
      });

      results.brands = brands.map((brand) => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        description: brand.description,
        deviceCount: brand._count.devices,
      }));
    }

    return NextResponse.json({
      success: true,
      data: results,
      query: searchTerm,
    });
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform search',
      },
      { status: 500 }
    );
  }
}
