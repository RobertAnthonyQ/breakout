import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  getOpportunities,
  getOpportunityStats,
  submitSuggestion,
  SuggestionRejectedError,
  SuggestionsUnavailableError,
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

/** "Sugerir oportunidad": stores a draft for admin review; nothing is published from here. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot: the form has a hidden "website" field people never fill; bots do. Pretend success.
    if (typeof body?.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ success: true, message: "Sugerencia recibida" }, { status: 201 });
    }

    await submitSuggestion(body);
    return NextResponse.json(
      { success: true, message: "Sugerencia recibida. Un administrador la revisará antes de publicarla." },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof SuggestionsUnavailableError) {
      return NextResponse.json(
        { success: false, error: "Las sugerencias no están disponibles en este momento." },
        { status: 503 }
      );
    }
    if (error instanceof ZodError || error instanceof SuggestionRejectedError || error instanceof SyntaxError) {
      const message = error instanceof SuggestionRejectedError ? error.message : "Revisa los campos del formulario.";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
    console.error("[opportunities] suggestion insert failed:", error);
    return NextResponse.json(
      { success: false, error: "No pudimos guardar tu sugerencia. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
