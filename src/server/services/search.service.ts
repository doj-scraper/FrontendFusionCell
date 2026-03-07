import { prisma } from "@/lib/db";
import { QualityGrade } from "@prisma/client";

export interface SearchParams {
  query: string;
  type?: "all" | "parts" | "devices" | "brands";
  limit?: number;
  offset?: number;
}

export class SearchService {
  static async search({ query, type = "all", limit = 20, offset = 0 }: SearchParams) {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 2) {
      return { parts: [], devices: [], brands: [] };
    }

    const results: any = {
      parts: [],
      devices: [],
      brands: [],
    };

    if (type === "all" || type === "parts") {
      results.parts = await prisma.part.findMany({
        where: {
          OR: [
            { sku: { contains: normalizedQuery, mode: "insensitive" } },
            { name: { contains: normalizedQuery, mode: "insensitive" } },
            { description: { contains: normalizedQuery, mode: "insensitive" } },
          ],
          isActive: true,
        },
        include: {
          device: {
            include: {
              brand: true,
            },
          },
          category: true,
        },
        take: limit,
        skip: offset,
        orderBy: [
          { isFeatured: "desc" },
          { name: "asc" },
        ],
      });
    }

    if (type === "all" || type === "devices") {
      results.devices = await prisma.device.findMany({
        where: {
          OR: [
            { name: { contains: normalizedQuery, mode: "insensitive" } },
            { modelNumber: { contains: normalizedQuery, mode: "insensitive" } },
          ],
          isActive: true,
        },
        include: {
          brand: true,
          _count: {
            select: { parts: true },
          },
        },
        take: limit,
        skip: offset,
      });
    }

    if (type === "all" || type === "brands") {
      results.brands = await prisma.brand.findMany({
        where: {
          name: { contains: normalizedQuery, mode: "insensitive" },
          isActive: true,
        },
        include: {
          _count: {
            select: { devices: true },
          },
        },
        take: limit,
        skip: offset,
      });
    }

    return results;
  }
}
