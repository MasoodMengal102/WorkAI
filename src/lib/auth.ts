import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { UserSession, Role } from "@/types";

export const AUTH_COOKIE_NAME = "workai_auth_token";
export const AUTH_SECRET = process.env.AUTH_SECRET || "workai-production-auth-secret-key-32-chars-minimum";

export interface TokenPayload {
  userId: string;
  email: string;
  name?: string;
  role: Role;
  emailVerified?: boolean;
  isActive?: boolean;
}

/**
 * Strong password validator:
 * Minimum 8 characters, at least 1 uppercase, at least 1 lowercase, and at least 1 number or special character.
 */
export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
  if (!password || typeof password !== "string") {
    return { valid: false, message: "Password is required." };
  }
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long." };
  }
  if (password.length > 128) {
    return { valid: false, message: "Password cannot exceed 128 characters." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter (A-Z)." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter (a-z)." };
  }
  if (!/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number or special character." };
  }
  return { valid: true };
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
}

/**
 * Hashes a plaintext password securely using bcrypt (10 rounds)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verifies a plaintext password against a stored bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}

/**
 * Generates cryptographically secure, random tokens for password reset and email verification
 */
export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * Signs a JWT session token
 */
export function signToken(payload: TokenPayload, expiresIn: string | number = "7d"): string {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: expiresIn as any });
}

/**
 * Verifies a JWT token signature and expiration
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, AUTH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Standard cookie configuration for session cookies
 */
export function getCookieOptions(rememberMe = true) {
  return {
    name: AUTH_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days vs 24 hours
  };
}

/**
 * Retrieves the currently authenticated user session from request cookies
 * Safe for use in Server Components and Route Handlers.
 */
export async function getAuthSession(req?: NextRequest): Promise<UserSession | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  } else {
    try {
      const cookieStore = cookies();
      token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    } catch {
      return null;
    }
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || !payload.userId) return null;

  return {
    id: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    emailVerified: payload.emailVerified ?? false,
    isActive: payload.isActive ?? true,
  };
}

// ==========================================
// ROLE-BASED ACCESS CONTROL (RBAC) LOGIC
// ==========================================

export const ROLE_HIERARCHY: Record<Role, number> = {
  USER: 1,
  REVIEWER: 2,
  EDITOR: 3,
  ADMIN: 4,
  SUPER_ADMIN: 5,
};

export function isSuperAdmin(role?: Role): boolean {
  return role === "SUPER_ADMIN";
}

export function isAdmin(role?: Role): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isEditor(role?: Role): boolean {
  return role === "EDITOR" || role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isReviewer(role?: Role): boolean {
  return role === "REVIEWER" || role === "ADMIN" || role === "SUPER_ADMIN";
}

export function canAccessAdmin(role?: Role): boolean {
  if (!role) return false;
  return role === "REVIEWER" || role === "EDITOR" || role === "ADMIN" || role === "SUPER_ADMIN";
}

export function canManageUsers(role?: Role): boolean {
  return isAdmin(role);
}

/**
 * Strict role assignment guard:
 * 1. Only SUPER_ADMIN can assign/remove ADMIN or SUPER_ADMIN roles.
 * 2. Normal ADMIN can only assign USER, REVIEWER, or EDITOR roles.
 * 3. Normal ADMIN cannot promote anyone to SUPER_ADMIN or modify a SUPER_ADMIN.
 * 4. Super Admin cannot be downgraded or deleted by anyone other than another Super Admin.
 */
export function canChangeRole(
  actorRole: Role,
  targetCurrentRole: Role,
  targetNewRole: Role
): boolean {
  // Only Super Admins can touch or create Admins / Super Admins
  if (targetCurrentRole === "SUPER_ADMIN" || targetNewRole === "SUPER_ADMIN") {
    return actorRole === "SUPER_ADMIN";
  }
  if (targetCurrentRole === "ADMIN" || targetNewRole === "ADMIN") {
    return actorRole === "SUPER_ADMIN";
  }

  // Admins can manage Reviewers, Editors, and Users
  if (actorRole === "ADMIN" || actorRole === "SUPER_ADMIN") {
    return true;
  }

  return false;
}

// Backwards-compatibility aliases
export const hasAdminRole = isAdmin;
export const hasEditorRole = isEditor;
