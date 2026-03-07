import { NextResponse } from "next/server";

import { PartsService } from "@/server/services/parts.service";
import { partsQuerySchema } from "@/server/validators/parts.validator";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paramsObject = Object.fromEntries(searchParams.entries());

    const validatedParams = partsQuerySchema.safeParse(paramsObject);
    if (!validatedParams.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid parts query parameters",
          details: validatedParams.error.format(),
        },
        { status: 400 },
      );
    }

    const result = await PartsService.getParts(validatedParams.data);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error fetching parts:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch parts",
      },
      { status: 500 },
    );
  }
}
