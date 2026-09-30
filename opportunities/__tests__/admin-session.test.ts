import { describe, expect, test } from "bun:test";
import { isValidPassword, isValidSession, sessionToken } from "../src/lib/admin-session";

const PASSWORD = "a-long-admin-password-for-tests";

describe("admin session", () => {
  test("accepts only the exact configured password", () => {
    expect(isValidPassword(PASSWORD, PASSWORD)).toBe(true);
    expect(isValidPassword(`${PASSWORD} `, PASSWORD)).toBe(false);
    expect(isValidPassword("", PASSWORD)).toBe(false);
  });

  test("an unset or blank password locks the admin instead of opening it", () => {
    expect(isValidPassword("", null)).toBe(false);
    expect(isValidPassword("anything", "")).toBe(false);
    expect(isValidSession(sessionToken("x"), null)).toBe(false);
  });

  test("the session cookie never contains the password itself", () => {
    const token = sessionToken(PASSWORD);
    expect(token).not.toContain(PASSWORD);
    expect(token).toMatch(/^[0-9a-f]{64}$/);
  });

  test("a session is valid only for the current password", () => {
    const token = sessionToken(PASSWORD);
    expect(isValidSession(token, PASSWORD)).toBe(true);
    expect(isValidSession(token, "rotated-password-invalidates-sessions")).toBe(false);
    expect(isValidSession(undefined, PASSWORD)).toBe(false);
    expect(isValidSession("forged", PASSWORD)).toBe(false);
  });
});
