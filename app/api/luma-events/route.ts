import { NextResponse } from "next/server";

// Breakout's calendar on Luma (https://luma.com/breakoutlatam). This is the stable internal
// id behind that slug — only changes if the calendar itself is deleted and recreated.
const LUMA_CALENDAR_API_ID = "cal-n4AEZpEy6H4E8xV";
const LUMA_ITEMS_ENDPOINT = "https://api.lu.ma/calendar/get-items";

export interface LumaEvent {
  id: string;
  name: string;
  url: string;
  coverUrl: string | null;
  startAt: string;
  endAt: string | null;
  hosts: string[];
}

interface LumaCalendarEntry {
  event: {
    api_id: string;
    name: string;
    url: string;
    cover_url: string | null;
    start_at: string;
    end_at: string | null;
  };
  hosts?: Array<{ name: string }>;
}

function toLumaEvent(entry: LumaCalendarEntry): LumaEvent {
  const event = entry.event;
  return {
    id: event.api_id,
    name: event.name,
    url: `https://luma.com/${event.url}`,
    coverUrl: event.cover_url,
    startAt: event.start_at,
    endAt: event.end_at,
    hosts: (entry.hosts ?? []).map((h) => h.name),
  };
}

// This is Luma's own public calendar-items API — the same one the calendar page's
// "Past events" tab calls — not an authenticated/private endpoint. It returns events
// Breakout co-hosts on another org's calendar too, which Luma's <iframe> embed widget
// does not (that widget only shows events natively owned by this calendar).
async function fetchLumaPeriod(period: "future" | "past"): Promise<LumaEvent[]> {
  const url = `${LUMA_ITEMS_ENDPOINT}?calendar_api_id=${LUMA_CALENDAR_API_ID}&period=${period}&pagination_limit=50`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; breakout.lat)" },
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    console.error(`[luma-events][GET] Luma ${period} fetch failed`, res.status);
    return [];
  }
  const data: { entries?: LumaCalendarEntry[] } = await res.json();
  return (data.entries ?? []).map(toLumaEvent);
}

export async function GET() {
  try {
    const [upcoming, past] = await Promise.all([
      fetchLumaPeriod("future"),
      fetchLumaPeriod("past"),
    ]);

    upcoming.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
    past.sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());

    return NextResponse.json({ upcoming, past });
  } catch (err) {
    console.error("[luma-events][GET] Unexpected error", err);
    return NextResponse.json({ upcoming: [], past: [] }, { status: 200 });
  }
}
