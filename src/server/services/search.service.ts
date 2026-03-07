import { prisma } from "@/lib/db";

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

    const results = {
      parts: [],
      devices: [],
      brands: [],
    };

    // SEARCH PARTS WITH WEIGHTED MATCHING
    if (type === "all" || type === "parts") {
      // 1. EXACT SKU MATCH (HIGHEST WEIGHT)
      const exactSku = await prisma.part.findMany({
        where: { sku: { equals: normalizedQuery, mode: "insensitive" }, isActive: true },
        include: { device: { include: { brand: true } }, category: true, inventory: true },
      });

      // 2. NAME PREFIX MATCH
      const namePrefix = await prisma.part.findMany({
        where: { 
          name: { startsWith: normalizedQuery, mode: "insensitive" }, 
          sku: { not: normalizedQuery },
          isActive: true 
        },
        include: { device: { include: { brand: true } }, category: true, inventory: true },
        take: limit,
      });

      // 3. CONTAINS MATCH (NAME, SKU, DESCRIPTION)
      const containsMatch = await prisma.part.findMany({
        where: {
          OR: [
            { name: { contains: normalizedQuery, mode: "insensitive" } },
            { sku: { contains: normalizedQuery, mode: "insensitive" } },
            { description: { contains: normalizedQuery, mode: "insensitive" } },
          ],
          isActive: true,
          AND: [
            { sku: { not: normalizedQuery } },
            { name: { not: { startsWith: normalizedQuery, mode: "insensitive" } } }
          ]
        },
        include: { device: { include: { brand: true } }, category: true, inventory: true },
        take: limit,
      });

      // Combine and deduplicate
      results.parts = [...exactSku, ...namePrefix, ...containsMatch].slice(0, limit);
    }

    // SEARCH DEVICES
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
          _count: { select: { parts: true } },
        },
        take: limit,
      });
    }

    // SEARCH BRANDS
    if (type === "all" || type === "brands") {
      results.brands = await prisma.brand.findMany({
        where: {
          name: { contains: normalizedQuery, mode: "insensitive" },
          isActive: true,
        },
        include: {
          _count: { select: { devices: true } },
        },
        take: limit,
      });
    }

    return results;
  }
}
