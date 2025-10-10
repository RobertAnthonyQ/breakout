import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_API_URL = "https://api.airtable.com/v0";

function getEnv() {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const apiKey = process.env.AIRTABLE_API_KEY;
  const tableName = process.env.AIRTABLE_CONTACTS_TABLE || "Contactos Básicos";
  if (!baseId || !apiKey) {
    return {
      ok: false as const,
      error: "Missing AIRTABLE_BASE_ID or AIRTABLE_API_KEY",
    };
  }
  return { ok: true as const, baseId, apiKey, tableName };
}

export async function GET(req: NextRequest) {
  const env = getEnv();
  if (!env.ok) {
    console.error("[contacts][GET] Missing env:", env);
    return NextResponse.json({ error: env.error }, { status: 500 });
  }
  const { baseId, apiKey, tableName } = env;
  const debug = req.nextUrl.searchParams.get("debug") === "1";
  try {
    const url = `${AIRTABLE_API_URL}/${encodeURIComponent(
      baseId
    )}/${encodeURIComponent(tableName)}?pageSize=100&fields%5B%5D=Nombre`;
    console.log("[contacts][GET] Fetching Airtable", {
      baseIdMasked: `${baseId.slice(0, 3)}…${baseId.slice(-3)}`,
      tableName,
      url,
    });
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      // Revalidate periodically to keep cache fresh but avoid rate limits
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("[contacts][GET] Airtable error", res.status, text);
      return NextResponse.json(
        {
          error: "Airtable request failed",
          upstreamStatus: res.status,
          details: debug ? text : undefined,
          hint: "Check AIRTABLE_API_KEY permissions, BASE ID, and table name (Contactos Básicos).",
        },
        { status: res.status }
      );
    }
    const data: { records?: Array<{ fields?: { [k: string]: unknown } }> } =
      await res.json();
    const names: string[] = (data.records || [])
      .map((r) => ((r.fields?.Nombre as string | undefined) || "").toString())
      .filter((n: string) => n);
    return NextResponse.json(
      debug
        ? {
            names,
            meta: {
              count: names.length,
              baseIdMasked: `${baseId.slice(0, 3)}…${baseId.slice(-3)}`,
              tableName,
            },
          }
        : { names }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[contacts][GET] Exception", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const env = getEnv();
  if (!env.ok) {
    console.error("[contacts][POST] Missing env:", env);
    return NextResponse.json({ error: env.error }, { status: 500 });
  }
  const { baseId, apiKey, tableName } = env;
  try {
    const body = await req.json();
    const name: string = (body?.name || "").toString().trim();
    const email: string | undefined = body?.email
      ? String(body.email)
      : undefined;
    const phone: string | undefined = body?.phone
      ? String(body.phone)
      : undefined;
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const url = `${AIRTABLE_API_URL}/${encodeURIComponent(
      baseId
    )}/${encodeURIComponent(tableName)}`;
    console.log("[contacts][POST] Creating record", {
      baseIdMasked: `${baseId.slice(0, 3)}…${baseId.slice(-3)}`,
      tableName,
      fields: {
        Nombre: name,
        emailProvided: Boolean(email),
        phoneProvided: Boolean(phone),
      },
    });
    const payload = {
      records: [
        {
          fields: {
            Nombre: name,
            ...(email ? { "Correo Electrónico": email } : {}),
            ...(phone ? { "Número de Teléfono": phone } : {}),
          },
        },
      ],
    };
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("[contacts][POST] Airtable error", res.status, text);
      return NextResponse.json(
        {
          error: "Airtable request failed",
          upstreamStatus: res.status,
          details: text,
        },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json({ ok: true, record: data.records?.[0] || null });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[contacts][POST] Exception", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
