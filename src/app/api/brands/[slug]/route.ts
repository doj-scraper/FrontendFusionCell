import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const brand = await db.brand.findFirst({
      where: {
        slug,
        isActive: true,
      },
      include: {
        devices: {
          where: {
            isActive: true,
          },
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
          include: {
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
        },
      },
    });

    if (!brand) {
      return NextResponse.json(
        {
          success: false,
          error: 'Brand not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        description: brand.description,
        devices: brand.devices.map((device) => ({
          id: device.id,
          name: device.name,
          slug: device.slug,
          modelNumber: device.modelNumber,
          image: device.image,
          releaseYear: device.releaseYear,
          description: device.description,
          partCount: device._count.parts,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching brand:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch brand',
      },
      { status: 500 }
    );
  }
}
