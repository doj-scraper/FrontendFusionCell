import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const categories = await db.partCategory.findMany({
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
            parts: {
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
      data: categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        partCount: category._count.parts,
      })),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}
