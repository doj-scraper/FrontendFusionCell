import { NextResponse } from "next/server";
import { FilterService } from "@/server/services/filter.service";

export async function GET() {
  try {
    const filters = await FilterService.getFilterOptions();
    return NextResponse.json({
      success: true,
      data: filters,
    });
  } catch (error) {
    console.error("Filters API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
