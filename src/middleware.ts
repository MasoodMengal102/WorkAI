import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "workai_auth_token";
const AUTH_SECRET = process.env.AUTH_SECRET || "workai-production-auth-secret-key-32-chars-minimum";

/**
 * Validates JWT token using standard Web Crypto API compatible with Next.js Edge Runtime.
 */
async function verifyEdgeToken(token: string): Promise<any | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;

    const base64UrlToBytes = (base64Url: string): Uint8Array => {
      let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) base64 += "=";
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    };

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(AUTH_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const signature = base64UrlToBytes(sigB64);

    const valid = await crypto.subtle.verify("HMAC", key, signature as any, data as any);
    if (!valid) return null;

    let jsonPayload = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    while (jsonPayload.length % 4) jsonPayload += "=";
    const payload = JSON.parse(atob(jsonPayload));

    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Dedicated Admin Routes Protection
  if (pathname.startsWith("/admin")) {
    // Allow public access to the dedicated admin login page
    if (pathname === "/admin/login") {
      const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
      if (token) {
        const payload = await verifyEdgeToken(token);
        const adminRoles = ["REVIEWER", "EDITOR", "ADMIN", "SUPER_ADMIN"];
        if (payload && adminRoles.includes(payload.role)) {
          return NextResponse.redirect(new URL("/admin", req.url));
        }
      }
      return NextResponse.next();
    }

    // Protect all other /admin/* routes
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyEdgeToken(token);
    const adminRoles = ["REVIEWER", "EDITOR", "ADMIN", "SUPER_ADMIN"];

    if (!payload || !adminRoles.includes(payload.role)) {
      // Normal users or expired tokens are rejected from admin portal
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 2. Dashboard Protection
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyEdgeToken(token);
    if (!payload || !payload.userId) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
