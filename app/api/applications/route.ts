import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_API_URL = "https://api.airtable.com/v0";

function getEnv() {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const apiKey = process.env.AIRTABLE_API_KEY;
  const tableName = process.env.AIRTABLE_CONTACTS_TABLE || "Contactos";
  if (!baseId || !apiKey) {
    return {
      ok: false as const,
      error: "Missing AIRTABLE_BASE_ID or AIRTABLE_API_KEY",
    };
  }
  return { ok: true as const, baseId, apiKey, tableName };
}

export async function POST(req: NextRequest) {
  const env = getEnv();
  if (!env.ok) {
    console.error("[applications][POST] Missing env:", env);
    return NextResponse.json({ error: env.error }, { status: 500 });
  }
  const { baseId, apiKey, tableName } = env;

  try {
    const body = await req.json();

    // Validar campos requeridos
    const nombre = body?.nombre?.toString().trim();
    const apellidos = body?.apellidos?.toString().trim();
    const cel = body?.cel?.toString().trim();
    const facultad = body?.facultad?.toString().trim();
    const semestre = body?.semestre?.toString().trim();
    const correoPUCP = body?.correoPUCP?.toString().trim();
    const linkedin = body?.linkedin?.toString().trim();
    const areaInteres = body?.areaInteres?.toString().trim();
    const porQue = body?.porQue?.toString().trim();

    if (
      !nombre ||
      !apellidos ||
      !cel ||
      !facultad ||
      !semestre ||
      !correoPUCP ||
      !areaInteres ||
      !porQue
    ) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos excepto LinkedIn" },
        { status: 400 }
      );
    }

    const url = `${AIRTABLE_API_URL}/${encodeURIComponent(
      baseId
    )}/${encodeURIComponent(tableName)}`;

    console.log("[applications][POST] Creating record", {
      baseIdMasked: `${baseId.slice(0, 3)}…${baseId.slice(-3)}`,
      tableName,
      nombre,
      apellidos,
      facultad,
      semestre,
      areaInteres,
    });

    const payload = {
      records: [
        {
          fields: {
            Nombre: nombre,
            Apellidos: apellidos,
            Cel: cel,
            Facultad: facultad,
            Semestre: semestre,
            "Correo PUCP": correoPUCP,
            ...(linkedin ? { LinkedIn: linkedin } : {}),
            "Área de interés": areaInteres,
            "¿Por qué quieres ser parte de Breakout?": porQue,
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
      console.error("[applications][POST] Airtable error", res.status, text);
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
    console.error("[applications][POST] Exception", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
