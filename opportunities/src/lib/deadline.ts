export type DeadlineState = "urgent" | "soon" | "open" | "closed" | "rolling";

export interface DeadlineBadge {
  state: DeadlineState;
  label: string;
}

const MONTHS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SET", "OCT", "NOV", "DIC"];
const ROLLING_HINTS = ["rolling", "abiert", "sin deadline"];
const URGENT_DAYS = 7;
const SOON_DAYS = 30;

/** Whole calendar days from `today` to an ISO `YYYY-MM-DD` date (negative if past), or null if malformed. */
export function daysUntil(isoDate: string, today: Date = new Date()): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return null;
  const target = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((target - start) / 86_400_000);
}

const MONTHS_LONG = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre",
];

/** "2026-09-29" → "29 de setiembre de 2026"; non-ISO input is returned as is. */
export function formatLongDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  return `${Number(match[3])} de ${MONTHS_LONG[Number(match[2]) - 1]} de ${match[1]}`;
}

function shortDate(isoDate: string): string {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]}`;
}

export function getDeadlineBadge(
  deadline: string,
  deadlineDisplay: string | undefined,
  today: Date = new Date(),
): DeadlineBadge {
  const display = (deadlineDisplay ?? "").toLowerCase();
  if (ROLLING_HINTS.some((hint) => display.includes(hint))) {
    return { state: "rolling", label: "ABIERTA TODO EL AÑO" };
  }

  const days = daysUntil(deadline, today);
  if (days === null) return { state: "open", label: deadline.toUpperCase() };
  if (days < 0) return { state: "closed", label: `CERRÓ ${shortDate(deadline)}` };
  if (days === 0) return { state: "urgent", label: "CIERRA HOY" };
  if (days === 1) return { state: "urgent", label: "CIERRA MAÑANA" };
  if (days <= URGENT_DAYS) return { state: "urgent", label: `CIERRA EN ${days} DÍAS` };
  if (days <= SOON_DAYS) return { state: "soon", label: `CIERRA ${shortDate(deadline)}` };
  return { state: "open", label: `CIERRA ${shortDate(deadline)}` };
}
