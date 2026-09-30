import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  hasAdminRole,
  hasEditorRole,
} from "@/lib/auth";

describe("Authentication & Security Module", () => {
  it("should securely hash passwords and verify matching passwords", async () => {
    const rawPassword = "SuperSecurePassword123!#";
    const hashed = await hashPassword(rawPassword);

    expect(hashed).not.toBe(rawPassword);
    expect(hashed.length).toBeGreaterThan(20);

    const isMatch = await verifyPassword(rawPassword, hashed);
    expect(isMatch).toBe(true);

    const isWrongMatch = await verifyPassword("WrongPassword123!", hashed);
    expect(isWrongMatch).toBe(false);
  });

  it("should sign and verify valid JWT session tokens", () => {
    const payload = {
      userId: "user-12345",
      email: "engineer@workai.internal",
      name: "Engineering Lead",
      role: "ADMIN" as const,
    };

    const token = signToken(payload);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);

    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.email).toBe(payload.email);
    expect(decoded?.role).toBe("ADMIN");
  });

  it("should return null for malformed or tampered tokens", () => {
    const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature";
    const result = verifyToken(invalidToken);
    expect(result).toBeNull();
  });

  it("should correctly evaluate role-based access control (RBAC)", () => {
    expect(hasAdminRole("SUPER_ADMIN")).toBe(true);
    expect(hasAdminRole("ADMIN")).toBe(true);
    expect(hasAdminRole("EDITOR")).toBe(false);
    expect(hasAdminRole("USER")).toBe(false);
    expect(hasAdminRole(undefined)).toBe(false);

    expect(hasEditorRole("SUPER_ADMIN")).toBe(true);
    expect(hasEditorRole("ADMIN")).toBe(true);
    expect(hasEditorRole("EDITOR")).toBe(true);
    expect(hasEditorRole("USER")).toBe(false);
  });
});
