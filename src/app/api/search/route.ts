import { NextRequest, NextResponse } from "next/server";
import { SearchService } from "@/server/services/search.service";
import { z } from "zod";

const searchParamsSchema = z.object({
  q: z.string().min(2),
  type: z.enum(["all", "parts", "devices", "brands"]).optional().default("all"),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  offset: z.coerce.number().min(0).optional().default(0),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "all";
    const limit = searchParams.get("limit") || "20";
    const offset = searchParams.get("offset") || "0";

    const validatedParams = searchParamsSchema.safeParse({
      q: query,
      type,
      limit,
      offset,
    });

    if (!validatedParams.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid search parameters", 
          details: validatedParams.error.format() 
        },
        { status: 400 }
      );
    }

    const results = await SearchService.search({
      query: validatedParams.data.q,
      type: validatedParams.data.type as any,
      limit: validatedParams.data.limit,
      offset: validatedParams.data.offset,
    });

    return NextResponse.json({
      success: true,
      data: results,
      query: validatedParams.data.q,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
