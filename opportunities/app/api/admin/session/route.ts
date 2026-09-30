import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_SECONDS,
  getAdminPassword,
  isValidPassword,
  sessionToken,
} from "../../../../src/lib/admin-session";
import { BASE_PATH } from "../../../../src/lib/base-path";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: BASE_PATH,
};

/** Log in: exchanges ADMIN_PASSWORD for an httpOnly session cookie. */
export async function POST(request: Request) {
  const expected = getAdminPassword();
  if (!expected) {
    return NextResponse.json({ error: "ADMIN_PASSWORD no está configurado" }, { status: 503 });
  }
  const { password } = await request.json().catch(() => ({ password: "" }));
  if (typeof password !== "string" || !isValidPassword(password, expected)) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, sessionToken(expected), { ...cookieOptions, maxAge: ADMIN_SESSION_SECONDS });
  return response;
}

/** Log out. */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return response;
}
