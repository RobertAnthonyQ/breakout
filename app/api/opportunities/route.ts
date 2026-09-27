import { NextRequest, NextResponse } from "next/server";
import {
  createOpportunity,
  getOpportunities,
  getOpportunityStats,
} from "../../../src/lib/opportunities";
import { OpportunityCategory, OpportunityModality } from "../../../types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") as OpportunityCategory | "all" | null;
    const modality = searchParams.get("modality") as OpportunityModality | "all" | null;
    const query = searchParams.get("query") || undefined;
    const sortBy = searchParams.get("sortBy") as "deadline_asc" | "deadline_desc" | "newest" | null;
    const statsOnly = searchParams.get("stats") === "true";

    if (statsOnly) {
      const stats = await getOpportunityStats();
      return NextResponse.json({ success: true, stats });
    }

    const list = await getOpportunities({
      category: category || "all",
      modality: modality || "all",
      query,
      sortBy: sortBy || "deadline_asc",
    });

    return NextResponse.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch opportunities",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await createOpportunity(body);

    return NextResponse.json(
      {
        success: true,
        message: "Convocatoria publicada exitosamente",
        data: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Invalid opportunity payload",
      },
      { status: 400 }
    );
  }
}
