import { NextRequest, NextResponse } from "next/server";
import { getAirtableEnv, getAirtableUrl, maskBaseId } from "@/lib/airtable";

export async function POST(req: NextRequest) {
  const env = getAirtableEnv("AIRTABLE_CONTACTS_TABLE", "Contactos");
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
    const cvPortafolio = body?.cvPortafolio?.toString().trim();
    const proyectoIdea = body?.proyectoIdea?.toString().trim();

    if (
      !nombre ||
      !apellidos ||
      !cel ||
      !facultad ||
      !semestre ||
      !correoPUCP ||
      !cvPortafolio ||
      !proyectoIdea
    ) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos excepto LinkedIn" },
        { status: 400 }
      );
    }

    const url = getAirtableUrl(baseId, tableName);

    console.log("[applications][POST] Creating record", {
      baseIdMasked: maskBaseId(baseId),
      tableName,
      nombre,
      apellidos,
      facultad,
      semestre,
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
            "CV o Portafolio": cvPortafolio,
            "Proyecto o Idea": proyectoIdea,
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
      console.error("[applications][POST] Airtable error details:", {
        status: res.status,
        statusText: res.statusText,
        responseText: text,
        url: url,
      });
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
