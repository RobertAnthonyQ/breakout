import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, getAdminPassword, isValidSession } from "../../../../src/lib/admin-session";
import { listSuggestions, reviewSuggestion, SuggestionsUnavailableError } from "../../../../src/lib/opportunities";

export const dynamic = "force-dynamic";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidSession(cookieStore.get(ADMIN_COOKIE)?.value, getAdminPassword());
}

function unavailable() {
  return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json(await listSuggestions());
  } catch (error) {
    if (error instanceof SuggestionsUnavailableError) return unavailable();
    console.error("[admin] list failed:", error);
    return NextResponse.json({ error: "No se pudo cargar la lista" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, action } = await request.json();
    if (typeof id !== "string" || (action !== "approve" && action !== "reject")) {
      return NextResponse.json({ error: "Missing id or invalid action" }, { status: 400 });
    }
    const updated = await reviewSuggestion(id, action);
    return updated
      ? NextResponse.json({ success: true })
      : NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
  } catch (error) {
    if (error instanceof SuggestionsUnavailableError) return unavailable();
    console.error("[admin] review failed:", error);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
