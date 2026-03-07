import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const brands = await db.brand.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
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

    return NextResponse.json({
      success: true,
      data: brands.map((brand) => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        description: brand.description,
        deviceCount: brand._count.devices,
      })),
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch brands',
      },
      { status: 500 }
    );
  }
}
