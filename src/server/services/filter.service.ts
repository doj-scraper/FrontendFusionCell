import { prisma } from "@/lib/db";

export class FilterService {
  static async getFilterOptions() {
    const [brands, categories, qualities] = await Promise.all([
      prisma.brand.findMany({ where: { isActive: true }, select: { id: true, name: true, slug: true }, orderBy: { sortOrder: "asc" } }),
      prisma.partCategory.findMany({ where: { isActive: true }, select: { id: true, name: true, slug: true }, orderBy: { sortOrder: "asc" } }),
      prisma.part.findMany({ select: { quality: true }, distinct: ["quality"] }),
    ]);

    return {
      brands,
      categories,
      qualities: qualities.map(q => q.quality),
      priceRanges: [
        { label: "Under $10", min: 0, max: 10 },
        { label: "$10 - $50", min: 10, max: 50 },
        { label: "$50 - $100", min: 50, max: 100 },
        { label: "$100+", min: 100, max: 10000 },
      ],
      stockStatus: [
        { label: "In Stock", value: "in_stock" },
        { label: "All", value: "all" },
      ]
    };
  }
}
