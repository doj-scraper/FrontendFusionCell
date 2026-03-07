import { NextRequest, NextResponse } from "next/server";

import { SearchService } from "@/server/services/search.service";
import { searchParamsSchema } from "@/server/validators/search.validator";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const validatedParams = searchParamsSchema.safeParse({
      q: searchParams.get("q"),
      type: searchParams.get("type") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      offset: searchParams.get("offset") ?? undefined,
    });

    if (!validatedParams.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid search parameters",
          details: validatedParams.error.format(),
        },
        { status: 400 },
      );
    }

    const results = await SearchService.search({
      query: validatedParams.data.q,
      type: validatedParams.data.type,
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
      { status: 500 },
    );
  }
}
