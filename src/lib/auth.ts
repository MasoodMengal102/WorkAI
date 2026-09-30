import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { UserSession, Role } from "@/types";

const AUTH_COOKIE_NAME = "workai_auth_token";
const AUTH_SECRET = process.env.AUTH_SECRET || "fallback-dev-secret-minimum-32-characters-required";

export interface TokenPayload {
  userId: string;
  email: string;
  name?: string;
  role: Role;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, AUTH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getAuthSession(): Promise<UserSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  return {
    id: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  };
}

export function hasAdminRole(role?: Role): boolean {
  if (!role) return false;
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function hasEditorRole(role?: Role): boolean {
  if (!role) return false;
  return role === "ADMIN" || role === "SUPER_ADMIN" || role === "EDITOR";
}
