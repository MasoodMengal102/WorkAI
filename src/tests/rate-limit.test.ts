import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("Infrastructure Protection Rate Limiter", () => {
  it("should allow requests under the configured threshold", () => {
    const id = "ip-test-allow-" + Date.now();
    const result1 = checkRateLimit(id, 5, 60);

    expect(result1.allowed).toBe(true);
    expect(result1.limit).toBe(5);
    expect(result1.remaining).toBe(4);

    const result2 = checkRateLimit(id, 5, 60);
    expect(result2.allowed).toBe(true);
    expect(result2.remaining).toBe(3);
  });

  it("should block requests when rate limit is exceeded and provide transparent message", () => {
    const id = "ip-test-block-" + Date.now();
    // Exceed limit of 3
    checkRateLimit(id, 3, 60);
    checkRateLimit(id, 3, 60);
    checkRateLimit(id, 3, 60);

    const blocked = checkRateLimit(id, 3, 60);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetSeconds).toBeGreaterThan(0);
    expect(blocked.message).toBeDefined();

    // Verify it NEVER asks users to upgrade or pay (Requirement 5 & 102)
    expect(blocked.message).not.toMatch(/\bpro\b/i);
    expect(blocked.message?.toLowerCase()).not.toContain("credit");
    expect(blocked.message?.toLowerCase()).not.toContain("upgrade");
    expect(blocked.message?.toLowerCase()).toContain("infrastructure protection");
  });

  it("should isolate limits across different identifiers", () => {
    const idA = "ip-client-a-" + Date.now();
    const idB = "ip-client-b-" + Date.now();

    checkRateLimit(idA, 2, 60);
    checkRateLimit(idA, 2, 60);
    const blockedA = checkRateLimit(idA, 2, 60);
    expect(blockedA.allowed).toBe(false);

    // Client B must still be permitted
    const allowedB = checkRateLimit(idB, 2, 60);
    expect(allowedB.allowed).toBe(true);
    expect(allowedB.remaining).toBe(1);
  });
});
