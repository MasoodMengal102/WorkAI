import { NextRequest, NextResponse } from "next/server";
import {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
  validateEmail,
  generateSecureToken,
  signToken,
  getAuthSession,
  getCookieOptions,
  canAccessAdmin,
  AUTH_COOKIE_NAME,
} from "@/lib/auth";
import { dataService } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ success: true, session: null });
    }

    // Refresh user state from database to ensure up-to-date role and status
    const dbUser = await dataService.getUserById(session.id);
    if (!dbUser || !dbUser.isActive) {
      const res = NextResponse.json({ success: true, session: null });
      res.cookies.delete(AUTH_COOKIE_NAME);
      return res;
    }

    const currentSession = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name || undefined,
      role: dbUser.role,
      emailVerified: dbUser.emailVerified ?? false,
      isActive: dbUser.isActive ?? true,
      createdAt: dbUser.createdAt,
    };

    return NextResponse.json({ success: true, session: currentSession });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const body = await req.json();
    const { action } = body;

    // -------------------------------------------------------------------------
    // 1. LOGOUT
    // -------------------------------------------------------------------------
    if (action === "logout") {
      const session = await getAuthSession(req);
      if (session) {
        await dataService.deleteUserSessions(session.id);
        await dataService.recordAuditLog({
          adminId: canAccessAdmin(session.role) ? session.id : undefined,
          action: "USER_LOGOUT",
          entityType: "User",
          entityId: session.id,
          details: `User ${session.email} logged out.`,
          ipAddress: ip,
        });
      }

      const res = NextResponse.json({ success: true, message: "Logged out successfully" });
      res.cookies.delete(AUTH_COOKIE_NAME);
      return res;
    }

    // -------------------------------------------------------------------------
    // 2. USER LOGIN
    // -------------------------------------------------------------------------
    if (action === "login") {
      const rate = checkRateLimit(`auth:login:${ip}`, 8, 900); // 8 attempts per 15 min
      if (!rate.allowed) {
        return NextResponse.json(
          { success: false, error: "Too many login attempts. Please wait 15 minutes before trying again." },
          { status: 429 }
        );
      }

      const { email, password, rememberMe } = body;
      if (!email || !password) {
        return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
      }

      const cleanEmail = String(email).toLowerCase().trim();
      const user = await dataService.getUserByEmail(cleanEmail);

      // Enumeration-safe: Generic error message on nonexistent email or bad password
      if (!user || !user.passwordHash) {
        return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
      }

      if (!user.isActive) {
        return NextResponse.json(
          { success: false, error: "This account has been deactivated. Please contact support." },
          { status: 403 }
        );
      }

      const isValidPassword = await verifyPassword(String(password), user.passwordHash);
      if (!isValidPassword) {
        return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
      }

      // Update last login timestamp
      await dataService.updateUser(user.id, { lastLoginAt: new Date() });

      // Audit log
      await dataService.recordAuditLog({
        adminId: canAccessAdmin(user.role) ? user.id : undefined,
        action: "USER_LOGIN",
        entityType: "User",
        entityId: user.id,
        details: `Successful login for ${user.email}`,
        ipAddress: ip,
      });

      const token = signToken(
        {
          userId: user.id,
          email: user.email,
          name: user.name || undefined,
          role: user.role,
          emailVerified: user.emailVerified,
          isActive: user.isActive,
        },
        rememberMe ? "30d" : "24h"
      );

      const res = NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      });

      res.cookies.set({
        ...getCookieOptions(!!rememberMe),
        value: token,
      });

      return res;
    }

    // -------------------------------------------------------------------------
    // 3. SEPARATE ADMIN LOGIN
    // -------------------------------------------------------------------------
    if (action === "admin-login") {
      const rate = checkRateLimit(`auth:admin-login:${ip}`, 5, 900); // 5 attempts per 15 min
      if (!rate.allowed) {
        return NextResponse.json(
          { success: false, error: "Too many admin login attempts. Please wait 15 minutes before trying again." },
          { status: 429 }
        );
      }

      const { email, password, rememberMe } = body;
      if (!email || !password) {
        return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
      }

      const cleanEmail = String(email).toLowerCase().trim();
      const user = await dataService.getUserByEmail(cleanEmail);

      if (!user || !user.passwordHash) {
        return NextResponse.json({ success: false, error: "Invalid administrative credentials." }, { status: 401 });
      }

      if (!user.isActive) {
        return NextResponse.json(
          { success: false, error: "This administrative account is inactive." },
          { status: 403 }
        );
      }

      const isValidPassword = await verifyPassword(String(password), user.passwordHash);
      if (!isValidPassword) {
        return NextResponse.json({ success: false, error: "Invalid administrative credentials." }, { status: 401 });
      }

      // CRITICAL AUTHORIZATION CHECK: Normal users cannot use admin login
      if (!canAccessAdmin(user.role)) {
        await dataService.recordAuditLog({
          action: "UNAUTHORIZED_ADMIN_LOGIN_ATTEMPT",
          entityType: "User",
          entityId: user.id,
          details: `User ${user.email} with role '${user.role}' attempted to log into the Admin Portal. Access denied.`,
          ipAddress: ip,
        });

        return NextResponse.json(
          {
            success: false,
            error: "Access denied. Your account does not have administrative privileges. Please use standard user sign in.",
          },
          { status: 403 }
        );
      }

      // Update last login
      await dataService.updateUser(user.id, { lastLoginAt: new Date() });

      await dataService.recordAuditLog({
        adminId: user.id,
        action: "ADMIN_LOGIN",
        entityType: "User",
        entityId: user.id,
        details: `Admin ${user.email} (${user.role}) authenticated successfully.`,
        ipAddress: ip,
      });

      const token = signToken(
        {
          userId: user.id,
          email: user.email,
          name: user.name || undefined,
          role: user.role,
          emailVerified: user.emailVerified,
          isActive: user.isActive,
        },
        rememberMe ? "30d" : "24h"
      );

      const res = NextResponse.json({
        success: true,
        message: "Admin login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      });

      res.cookies.set({
        ...getCookieOptions(!!rememberMe),
        value: token,
      });

      return res;
    }

    // -------------------------------------------------------------------------
    // 4. USER REGISTRATION
    // -------------------------------------------------------------------------
    if (action === "register") {
      const rate = checkRateLimit(`auth:register:${ip}`, 5, 3600); // 5 per hour
      if (!rate.allowed) {
        return NextResponse.json(
          { success: false, error: "Too many accounts registered from this IP. Please try again later." },
          { status: 429 }
        );
      }

      const { name, email, password, confirmPassword } = body;

      if (!email || !password) {
        return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
      }

      if (!validateEmail(email)) {
        return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
      }

      if (confirmPassword !== undefined && password !== confirmPassword) {
        return NextResponse.json({ success: false, error: "Passwords do not match." }, { status: 400 });
      }

      const strength = validatePasswordStrength(password);
      if (!strength.valid) {
        return NextResponse.json({ success: false, error: strength.message }, { status: 400 });
      }

      const cleanEmail = String(email).toLowerCase().trim();
      const existing = await dataService.getUserByEmail(cleanEmail);
      if (existing) {
        return NextResponse.json(
          { success: false, error: "An account with this email address already exists. Please log in instead." },
          { status: 400 }
        );
      }

      const passwordHash = await hashPassword(password);
      const verificationToken = generateSecureToken(32);
      const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      const user = await dataService.createUser({
        email: cleanEmail,
        passwordHash,
        name: name ? String(name).trim() : undefined,
        role: "USER",
        emailVerified: false,
        verificationToken,
        verificationExpiresAt,
      });

      await dataService.recordAuditLog({
        action: "USER_REGISTER",
        entityType: "User",
        entityId: user.id,
        details: `New user registration for ${user.email}`,
        ipAddress: ip,
      });

      const token = signToken(
        {
          userId: user.id,
          email: user.email,
          name: user.name || undefined,
          role: user.role,
          emailVerified: false,
          isActive: true,
        },
        "7d"
      );

      const res = NextResponse.json({
        success: true,
        message: "Registration successful. Please verify your email address.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: false,
        },
        // We provide the token in development so verification is seamlessly testable without SMTP server
        verificationToken: process.env.NODE_ENV !== "production" ? verificationToken : undefined,
      });

      res.cookies.set({
        ...getCookieOptions(true),
        value: token,
      });

      return res;
    }

    // -------------------------------------------------------------------------
    // 5. FORGOT PASSWORD (Safe against account enumeration)
    // -------------------------------------------------------------------------
    if (action === "forgot-password") {
      const rate = checkRateLimit(`auth:forgot:${ip}`, 5, 3600);
      if (!rate.allowed) {
        return NextResponse.json(
          { success: false, error: "Too many password reset requests. Please try again later." },
          { status: 429 }
        );
      }

      const { email } = body;
      if (!email || !validateEmail(email)) {
        return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
      }

      const cleanEmail = String(email).toLowerCase().trim();
      const user = await dataService.getUserByEmail(cleanEmail);

      let resetToken: string | undefined;

      if (user) {
        resetToken = generateSecureToken(32);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration
        await dataService.setPasswordResetToken(cleanEmail, resetToken, expiresAt);

        await dataService.recordAuditLog({
          action: "PASSWORD_RESET_REQUESTED",
          entityType: "User",
          entityId: user.id,
          details: `Password reset token generated for ${user.email}`,
          ipAddress: ip,
        });
      }

      // Security requirement: Never reveal whether the email exists
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, password reset instructions have been sent.",
        // Dev aid for testing password reset without SMTP
        resetToken: process.env.NODE_ENV !== "production" ? resetToken : undefined,
      });
    }

    // -------------------------------------------------------------------------
    // 6. RESET PASSWORD (Consumes single-use token)
    // -------------------------------------------------------------------------
    if (action === "reset-password") {
      const rate = checkRateLimit(`auth:reset:${ip}`, 5, 900);
      if (!rate.allowed) {
        return NextResponse.json(
          { success: false, error: "Too many password reset attempts. Please wait 15 minutes." },
          { status: 429 }
        );
      }

      const { token, password, confirmPassword } = body;
      if (!token) {
        return NextResponse.json({ success: false, error: "Password reset token is required." }, { status: 400 });
      }

      if (!password) {
        return NextResponse.json({ success: false, error: "New password is required." }, { status: 400 });
      }

      if (confirmPassword !== undefined && password !== confirmPassword) {
        return NextResponse.json({ success: false, error: "Passwords do not match." }, { status: 400 });
      }

      const strength = validatePasswordStrength(password);
      if (!strength.valid) {
        return NextResponse.json({ success: false, error: strength.message }, { status: 400 });
      }

      const newPasswordHash = await hashPassword(password);
      const result = await dataService.resetPassword(String(token), newPasswordHash);

      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error || "Password reset failed." }, { status: 400 });
      }

      await dataService.recordAuditLog({
        action: "PASSWORD_RESET_COMPLETED",
        entityType: "User",
        details: `Password reset successfully completed and token invalidated.`,
        ipAddress: ip,
      });

      return NextResponse.json({
        success: true,
        message: "Your password has been successfully updated. You may now log in with your new password.",
      });
    }

    // -------------------------------------------------------------------------
    // 7. VERIFY EMAIL (Consumes single-use token)
    // -------------------------------------------------------------------------
    if (action === "verify-email") {
      const rate = checkRateLimit(`auth:verify:${ip}`, 10, 900);
      if (!rate.allowed) {
        return NextResponse.json({ success: false, error: "Too many verification requests." }, { status: 429 });
      }

      const { token } = body;
      if (!token) {
        return NextResponse.json({ success: false, error: "Verification token is required." }, { status: 400 });
      }

      const result = await dataService.verifyUserEmail(String(token));
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error || "Email verification failed." }, { status: 400 });
      }

      await dataService.recordAuditLog({
        action: "EMAIL_VERIFICATION_SUCCESS",
        entityType: "User",
        details: `Email successfully verified with token.`,
        ipAddress: ip,
      });

      return NextResponse.json({
        success: true,
        message: "Your email address has been successfully verified! You now have full account privileges.",
      });
    }

    // -------------------------------------------------------------------------
    // 8. RESEND VERIFICATION EMAIL
    // -------------------------------------------------------------------------
    if (action === "resend-verification") {
      const { email } = body;
      if (!email || !validateEmail(email)) {
        return NextResponse.json({ success: false, error: "Valid email address is required." }, { status: 400 });
      }

      const cleanEmail = String(email).toLowerCase().trim();
      const user = await dataService.getUserByEmail(cleanEmail);

      let newVerifToken: string | undefined;

      if (user && !user.emailVerified) {
        newVerifToken = generateSecureToken(32);
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await dataService.updateUser(user.id, {
          verificationToken: newVerifToken,
          verificationExpiresAt: expiresAt,
        });

        await dataService.recordAuditLog({
          action: "RESEND_VERIFICATION_TOKEN",
          entityType: "User",
          entityId: user.id,
          details: `Resent verification token for ${user.email}`,
          ipAddress: ip,
        });
      }

      return NextResponse.json({
        success: true,
        message: "If an unverified account exists with that email, a new verification link has been sent.",
        verificationToken: process.env.NODE_ENV !== "production" ? newVerifToken : undefined,
      });
    }

    // -------------------------------------------------------------------------
    // 9. CHANGE PASSWORD (Authenticated)
    // -------------------------------------------------------------------------
    if (action === "change-password") {
      const session = await getAuthSession(req);
      if (!session) {
        return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
      }

      const { currentPassword, newPassword, confirmPassword } = body;
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { success: false, error: "Current password and new password are required." },
          { status: 400 }
        );
      }

      if (confirmPassword !== undefined && newPassword !== confirmPassword) {
        return NextResponse.json({ success: false, error: "New passwords do not match." }, { status: 400 });
      }

      const strength = validatePasswordStrength(newPassword);
      if (!strength.valid) {
        return NextResponse.json({ success: false, error: strength.message }, { status: 400 });
      }

      const user = await dataService.getUserById(session.id);
      if (!user || !user.passwordHash) {
        return NextResponse.json({ success: false, error: "User account not found." }, { status: 404 });
      }

      const isValidCurrent = await verifyPassword(currentPassword, user.passwordHash);
      if (!isValidCurrent) {
        return NextResponse.json({ success: false, error: "The current password you entered is incorrect." }, { status: 400 });
      }

      const newPasswordHash = await hashPassword(newPassword);
      await dataService.updateUser(user.id, { passwordHash: newPasswordHash });

      await dataService.recordAuditLog({
        adminId: canAccessAdmin(user.role) ? user.id : undefined,
        action: "PASSWORD_CHANGED",
        entityType: "User",
        entityId: user.id,
        details: `Password changed by user ${user.email}`,
        ipAddress: ip,
      });

      return NextResponse.json({ success: true, message: "Your password has been successfully updated." });
    }

    // -------------------------------------------------------------------------
    // 10. UPDATE PROFILE (Authenticated)
    // -------------------------------------------------------------------------
    if (action === "update-profile") {
      const session = await getAuthSession(req);
      if (!session) {
        return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
      }

      const { name } = body;
      const updatedUser = await dataService.updateUser(session.id, {
        name: name ? String(name).trim() : null,
      });

      if (!updatedUser) {
        return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
      }

      // Re-sign token with updated name
      const token = signToken({
        userId: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name || undefined,
        role: updatedUser.role,
        emailVerified: updatedUser.emailVerified,
        isActive: updatedUser.isActive,
      });

      const res = NextResponse.json({
        success: true,
        message: "Profile updated successfully.",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          emailVerified: updatedUser.emailVerified,
        },
      });

      res.cookies.set({
        ...getCookieOptions(true),
        value: token,
      });

      return res;
    }

    // -------------------------------------------------------------------------
    // 11. DELETE ACCOUNT (Requires password re-authentication)
    // -------------------------------------------------------------------------
    if (action === "delete-account") {
      const session = await getAuthSession(req);
      if (!session) {
        return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
      }

      const { password } = body;
      if (!password) {
        return NextResponse.json(
          { success: false, error: "Please confirm your password to delete your account." },
          { status: 400 }
        );
      }

      const user = await dataService.getUserById(session.id);
      if (!user || !user.passwordHash) {
        return NextResponse.json({ success: false, error: "User account not found." }, { status: 404 });
      }

      const isValidPassword = await verifyPassword(password, user.passwordHash);
      if (!isValidPassword) {
        return NextResponse.json({ success: false, error: "Incorrect password. Account deletion aborted." }, { status: 400 });
      }

      // Prevent accidental deletion of the last Super Admin
      if (user.role === "SUPER_ADMIN") {
        const allUsers = await dataService.getAllUsers();
        const superAdmins = allUsers.filter((u: any) => u.role === "SUPER_ADMIN" && u.isActive);
        if (superAdmins.length <= 1) {
          return NextResponse.json(
            { success: false, error: "Cannot delete the sole active Super Administrator account." },
            { status: 400 }
          );
        }
      }

      await dataService.recordAuditLog({
        action: "ACCOUNT_DELETED",
        entityType: "User",
        entityId: user.id,
        details: `User ${user.email} permanently deleted their account.`,
        ipAddress: ip,
      });

      await dataService.deleteUser(user.id);

      const res = NextResponse.json({
        success: true,
        message: "Your account and all associated personal data have been permanently deleted.",
      });

      res.cookies.delete(AUTH_COOKIE_NAME);
      return res;
    }

    return NextResponse.json({ success: false, error: `Unknown action: '${action}'` }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
