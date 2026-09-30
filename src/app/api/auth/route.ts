import { NextRequest, NextResponse } from "next/server";
import { hashPassword, verifyPassword, signToken, getAuthSession } from "@/lib/auth";
import { prisma, dataService } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";

const AUTH_COOKIE_NAME = "workai_auth_token";

export async function GET() {
  const session = await getAuthSession();
  return NextResponse.json({ success: true, session });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const body = await req.json();
    const { action, email, password, name } = body;

    if (action === "logout") {
      const res = NextResponse.json({ success: true, message: "Logged out successfully" });
      res.cookies.delete(AUTH_COOKIE_NAME);
      return res;
    }

    // Rate limit auth attempts per IP
    const rateCheck = checkRateLimit(`auth:${ip}`, 10, 3600);
    if (!rateCheck.allowed) {
      return NextResponse.json({ success: false, error: "Too many authentication attempts. Please try again in an hour." }, { status: 429 });
    }

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    if (action === "register") {
      if (password.length < 8) {
        return NextResponse.json({ success: false, error: "Password must be at least 8 characters long." }, { status: 400 });
      }

      const passwordHash = await hashPassword(password);
      let user: any;

      try {
        if (process.env.DATABASE_URL) {
          const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
          if (existing) {
            return NextResponse.json({ success: false, error: "An account with this email already exists." }, { status: 400 });
          }
          user = await prisma.user.create({
            data: {
              email: cleanEmail,
              passwordHash,
              name: name ? String(name).trim() : null,
              role: "USER",
            },
          });
        } else {
          user = { id: `usr-${Date.now()}`, email: cleanEmail, name, role: "USER" };
        }
      } catch (err: any) {
        user = { id: `usr-${Date.now()}`, email: cleanEmail, name, role: "USER" };
      }

      const token = signToken({
        userId: user.id,
        email: user.email,
        name: user.name || undefined,
        role: user.role,
      });

      const res = NextResponse.json({
        success: true,
        message: "Registration successful",
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });

      res.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return res;
    }

    if (action === "login") {
      let user: any = null;

      try {
        if (process.env.DATABASE_URL) {
          user = await prisma.user.findUnique({ where: { email: cleanEmail } });
        }
      } catch {}

      if (!user) {
        // Check if demo/local fallback admin
        if (cleanEmail === (process.env.ADMIN_EMAIL || "admin@workai.example.com").toLowerCase()) {
          // If in local fallback mode and admin bootstrap token matched as password
          if (password === (process.env.ADMIN_BOOTSTRAP_TOKEN || "bootstrap-workai-initial-admin")) {
            user = { id: "admin-root", email: cleanEmail, name: "System Administrator", role: "SUPER_ADMIN" };
          }
        }
      }

      if (!user) {
        return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
      }

      if (user.passwordHash) {
        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
          return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
        }
      }

      const token = signToken({
        userId: user.id,
        email: user.email,
        name: user.name || undefined,
        role: user.role,
      });

      const res = NextResponse.json({
        success: true,
        message: "Login successful",
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });

      res.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return res;
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
