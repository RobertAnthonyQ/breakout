import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stateless admin session: the cookie holds an HMAC derived from ADMIN_PASSWORD, never the
 * password itself. Rotating the password invalidates every open session.
 */
export const ADMIN_COOKIE = "bo_admin_session";
export const ADMIN_SESSION_SECONDS = 8 * 60 * 60;

export function getAdminPassword(): string | null {
  return process.env.ADMIN_PASSWORD?.trim() || null;
}

export function sessionToken(password: string): string {
  return createHmac("sha256", password).update("breakout-opportunities-admin-session").digest("hex");
}

// Hash both sides first so the comparison is constant-time regardless of input length
function constantTimeEqual(a: string, b: string): boolean {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}

export function isValidPassword(input: string, expected: string | null): boolean {
  if (!expected || !input) return false;
  return constantTimeEqual(input, expected);
}

export function isValidSession(cookieValue: string | undefined, password: string | null): boolean {
  if (!password || !cookieValue) return false;
  return constantTimeEqual(cookieValue, sessionToken(password));
}
