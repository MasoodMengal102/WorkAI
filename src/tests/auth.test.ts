import { describe, it, expect, beforeEach } from "vitest";
import {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
  validateEmail,
  generateSecureToken,
  signToken,
  verifyToken,
  isSuperAdmin,
  isAdmin,
  isEditor,
  isReviewer,
  canAccessAdmin,
  canManageUsers,
  canChangeRole,
} from "@/lib/auth";
import { dataService } from "@/lib/db";

describe("Authentication & RBAC Security Suite", () => {
  describe("Password Complexity & Validation", () => {
    it("should enforce minimum 8 characters", () => {
      const result = validatePasswordStrength("Short1!");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("8 characters");
    });

    it("should enforce at least one uppercase letter", () => {
      const result = validatePasswordStrength("lowercase123!");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("uppercase");
    });

    it("should enforce at least one lowercase letter", () => {
      const result = validatePasswordStrength("UPPERCASE123!");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("lowercase");
    });

    it("should enforce at least one number or special symbol", () => {
      const result = validatePasswordStrength("NoNumbersOrSpecialChars");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("number or special character");
    });

    it("should accept valid, strong passwords", () => {
      expect(validatePasswordStrength("WorkAI#2026Secure").valid).toBe(true);
      expect(validatePasswordStrength("P@ssw0rdValid!").valid).toBe(true);
    });
  });

  describe("Email Validation", () => {
    it("should validate correctly formatted emails", () => {
      expect(validateEmail("user@example.com")).toBe(true);
      expect(validateEmail("admin.staff+tag@workai.internal")).toBe(true);
    });

    it("should reject invalid email strings", () => {
      expect(validateEmail("plainstring")).toBe(false);
      expect(validateEmail("missing@domain")).toBe(false);
      expect(validateEmail("@nodomain.com")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });
  });

  describe("Cryptographic Password Hashing & Verification", () => {
    it("should securely hash passwords and verify matching credentials", async () => {
      const rawPassword = "SuperSecurePassword123!#";
      const hashed = await hashPassword(rawPassword);

      expect(hashed).not.toBe(rawPassword);
      expect(hashed.length).toBeGreaterThan(20);

      const isMatch = await verifyPassword(rawPassword, hashed);
      expect(isMatch).toBe(true);

      const isWrongMatch = await verifyPassword("WrongPassword123!", hashed);
      expect(isWrongMatch).toBe(false);
    });
  });

  describe("Cryptographic Token Generation & JWT Sessions", () => {
    it("should generate cryptographically secure random tokens", () => {
      const token1 = generateSecureToken(32);
      const token2 = generateSecureToken(32);

      expect(token1).toHaveLength(64); // 32 bytes in hex = 64 characters
      expect(token2).toHaveLength(64);
      expect(token1).not.toBe(token2);
    });

    it("should sign and verify valid JWT session tokens with roles", () => {
      const payload = {
        userId: "user-12345",
        email: "staff@workai.org",
        name: "Staff Engineer",
        role: "ADMIN" as const,
        emailVerified: true,
        isActive: true,
      };

      const token = signToken(payload);
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);

      const decoded = verifyToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(payload.userId);
      expect(decoded?.email).toBe(payload.email);
      expect(decoded?.role).toBe("ADMIN");
      expect(decoded?.emailVerified).toBe(true);
    });

    it("should return null for tampered JWT tokens", () => {
      const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature";
      expect(verifyToken(invalidToken)).toBeNull();
    });
  });

  describe("Role-Based Access Control (RBAC) Logic & Guards", () => {
    it("should evaluate role hierarchy correctly", () => {
      expect(isSuperAdmin("SUPER_ADMIN")).toBe(true);
      expect(isSuperAdmin("ADMIN")).toBe(false);

      expect(isAdmin("SUPER_ADMIN")).toBe(true);
      expect(isAdmin("ADMIN")).toBe(true);
      expect(isAdmin("EDITOR")).toBe(false);
      expect(isAdmin("USER")).toBe(false);

      expect(isEditor("SUPER_ADMIN")).toBe(true);
      expect(isEditor("ADMIN")).toBe(true);
      expect(isEditor("EDITOR")).toBe(true);
      expect(isEditor("REVIEWER")).toBe(false);
      expect(isEditor("USER")).toBe(false);

      expect(isReviewer("REVIEWER")).toBe(true);
      expect(isReviewer("USER")).toBe(false);

      expect(canAccessAdmin("SUPER_ADMIN")).toBe(true);
      expect(canAccessAdmin("ADMIN")).toBe(true);
      expect(canAccessAdmin("EDITOR")).toBe(true);
      expect(canAccessAdmin("REVIEWER")).toBe(true);
      expect(canAccessAdmin("USER")).toBe(false);
      expect(canAccessAdmin(undefined)).toBe(false);
    });

    it("should enforce strict role assignment guards (canChangeRole)", () => {
      // Super Admin can assign or alter any role
      expect(canChangeRole("SUPER_ADMIN", "USER", "ADMIN")).toBe(true);
      expect(canChangeRole("SUPER_ADMIN", "ADMIN", "SUPER_ADMIN")).toBe(true);
      expect(canChangeRole("SUPER_ADMIN", "ADMIN", "USER")).toBe(true);

      // Normal Admin CANNOT create or promote to Super Admin
      expect(canChangeRole("ADMIN", "USER", "SUPER_ADMIN")).toBe(false);
      expect(canChangeRole("ADMIN", "ADMIN", "SUPER_ADMIN")).toBe(false);

      // Normal Admin CANNOT create or promote another user to ADMIN
      expect(canChangeRole("ADMIN", "USER", "ADMIN")).toBe(false);

      // Normal Admin CANNOT modify or demote a Super Admin
      expect(canChangeRole("ADMIN", "SUPER_ADMIN", "USER")).toBe(false);
      expect(canChangeRole("ADMIN", "SUPER_ADMIN", "ADMIN")).toBe(false);

      // Normal Admin CAN manage standard roles (User, Reviewer, Editor)
      expect(canChangeRole("ADMIN", "USER", "REVIEWER")).toBe(true);
      expect(canChangeRole("ADMIN", "REVIEWER", "EDITOR")).toBe(true);
      expect(canChangeRole("ADMIN", "EDITOR", "USER")).toBe(true);

      // Standard Users CANNOT change any roles
      expect(canChangeRole("USER", "USER", "EDITOR")).toBe(false);
    });
  });

  describe("User Lifecycle & Token Workflows in dataService", () => {
    const testEmail = `test-user-${Date.now()}@example.com`;
    let createdUserId: string;
    let initialVerifToken: string;

    it("should create a new user with unverified email and secure verification token", async () => {
      const passwordHash = await hashPassword("ValidPass123!");
      initialVerifToken = generateSecureToken(32);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const user = await dataService.createUser({
        email: testEmail,
        passwordHash,
        name: "Test User",
        role: "USER",
        emailVerified: false,
        verificationToken: initialVerifToken,
        verificationExpiresAt: expiresAt,
      });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(testEmail);
      expect(user.emailVerified).toBe(false);
      expect(user.verificationToken).toBe(initialVerifToken);
      createdUserId = user.id;
    });

    it("should verify email using single-use verification token and invalidate it", async () => {
      // First verification attempt succeeds
      const verifyRes = await dataService.verifyUserEmail(initialVerifToken);
      expect(verifyRes.success).toBe(true);

      const updatedUser = await dataService.getUserById(createdUserId);
      expect(updatedUser?.emailVerified).toBe(true);
      expect(updatedUser?.verificationToken).toBeNull();

      // Second attempt with the SAME token must fail (single-use!)
      const secondAttempt = await dataService.verifyUserEmail(initialVerifToken);
      expect(secondAttempt.success).toBe(false);
      expect(secondAttempt.error).toContain("Invalid or already used");
    });

    it("should handle single-use password reset tokens with automatic invalidation", async () => {
      const resetToken = generateSecureToken(32);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await dataService.setPasswordResetToken(testEmail, resetToken, expiresAt);

      // Verify user has the token
      const userBefore = await dataService.getUserByEmail(testEmail);
      expect(userBefore?.passwordResetToken).toBe(resetToken);

      // Reset password with token
      const newHash = await hashPassword("BrandNewPass456#");
      const resetResult = await dataService.resetPassword(resetToken, newHash);
      expect(resetResult.success).toBe(true);

      // Verify user's token is cleared and new password works
      const userAfter = await dataService.getUserByEmail(testEmail);
      expect(userAfter?.passwordResetToken).toBeNull();
      const passMatch = await verifyPassword("BrandNewPass456#", userAfter!.passwordHash);
      expect(passMatch).toBe(true);

      // Second reset attempt with the same token must fail (single-use!)
      const replayAttempt = await dataService.resetPassword(resetToken, newHash);
      expect(replayAttempt.success).toBe(false);
    });

    it("should permanently purge user and associated data upon deletion", async () => {
      // Add a favorite for this user
      await dataService.toggleFavorite(createdUserId, "tool-chatgpt");
      const favsBefore = await dataService.getUserFavorites(createdUserId);
      expect(favsBefore.length).toBeGreaterThanOrEqual(1);

      // Delete the user
      await dataService.deleteUser(createdUserId);

      // User must no longer exist
      const userDeleted = await dataService.getUserById(createdUserId);
      expect(userDeleted).toBeNull();

      // Associated favorites must be purged
      const favsAfter = await dataService.getUserFavorites(createdUserId);
      expect(favsAfter).toHaveLength(0);
    });
  });

  describe("Audit Trail Recording", () => {
    it("should record and retrieve immutable audit logs", async () => {
      await dataService.recordAuditLog({
        action: "TEST_SECURITY_EVENT",
        entityType: "System",
        details: "Automated test audit event verification",
      });

      const logs = await dataService.getAuditLogs(10);
      expect(logs.length).toBeGreaterThan(0);
      const testLog = logs.find((l: any) => l.action === "TEST_SECURITY_EVENT");
      expect(testLog).toBeDefined();
      expect(testLog?.details).toContain("Automated test");
    });
  });
});
