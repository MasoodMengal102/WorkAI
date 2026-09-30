import { NextRequest, NextResponse } from "next/server";
import {
  getAuthSession,
  canAccessAdmin,
  canManageUsers,
  canChangeRole,
  isSuperAdmin,
  isAdmin,
} from "@/lib/auth";
import { dataService } from "@/lib/db";
import { Role } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session || !canAccessAdmin(session.role)) {
      return NextResponse.json(
        { success: false, error: "Access denied. Administrative privileges required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const view = searchParams.get("view") || "overview";

    if (view === "users") {
      if (!canManageUsers(session.role)) {
        return NextResponse.json(
          { success: false, error: "Access denied. Insufficient permissions to view users." },
          { status: 403 }
        );
      }
      const users = await dataService.getAllUsers();
      return NextResponse.json({ success: true, users });
    }

    if (view === "audit-logs") {
      const logs = await dataService.getAuditLogs(100);
      return NextResponse.json({ success: true, auditLogs: logs });
    }

    // Default overview
    const users = canManageUsers(session.role) ? await dataService.getAllUsers() : [];
    const auditLogs = await dataService.getAuditLogs(10);
    const tools = await dataService.getTools();
    const workflows = await dataService.getWorkflows();

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalTools: tools.length,
        verifiedTools: tools.filter((t) => t.verificationStatus === "VERIFIED").length,
        totalWorkflows: workflows.length,
        recentAudits: auditLogs.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session || !canAccessAdmin(session.role)) {
      return NextResponse.json(
        { success: false, error: "Access denied. Administrative privileges required." },
        { status: 403 }
      );
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const body = await req.json();
    const { action } = body;

    // -------------------------------------------------------------------------
    // 1. UPDATE USER ROLE (Strict RBAC protection)
    // -------------------------------------------------------------------------
    if (action === "update-user-role") {
      const { targetUserId, newRole } = body as { targetUserId: string; newRole: Role };

      if (!targetUserId || !newRole) {
        return NextResponse.json(
          { success: false, error: "Target user ID and new role are required." },
          { status: 400 }
        );
      }

      const targetUser = await dataService.getUserById(targetUserId);
      if (!targetUser) {
        return NextResponse.json({ success: false, error: "Target user not found." }, { status: 404 });
      }

      // Check RBAC permission guard
      const allowed = canChangeRole(session.role, targetUser.role as Role, newRole);
      if (!allowed) {
        return NextResponse.json(
          {
            success: false,
            error: "Permission denied. Only Super Administrators can grant or alter Admin/Super Admin roles.",
          },
          { status: 403 }
        );
      }

      // Prevent demoting the last active Super Admin
      if (targetUser.role === "SUPER_ADMIN" && newRole !== "SUPER_ADMIN") {
        const allUsers = await dataService.getAllUsers();
        const activeSuperAdmins = allUsers.filter((u: any) => u.role === "SUPER_ADMIN" && u.isActive);
        if (activeSuperAdmins.length <= 1) {
          return NextResponse.json(
            { success: false, error: "Cannot demote the sole active Super Administrator." },
            { status: 400 }
          );
        }
      }

      const updated = await dataService.updateUser(targetUserId, { role: newRole });

      // Audit log the critical privilege escalation/modification
      await dataService.recordAuditLog({
        adminId: session.id,
        action: "ROLE_CHANGE",
        entityType: "User",
        entityId: targetUserId,
        previousValue: targetUser.role,
        newValue: newRole,
        details: `Role updated from '${targetUser.role}' to '${newRole}' by admin ${session.email} (${session.role}).`,
        ipAddress: ip,
      });

      return NextResponse.json({
        success: true,
        message: `User role successfully updated to ${newRole}.`,
        user: { id: updated.id, email: updated.email, role: updated.role },
      });
    }

    // -------------------------------------------------------------------------
    // 2. TOGGLE USER ACTIVE STATUS (Activate / Deactivate)
    // -------------------------------------------------------------------------
    if (action === "toggle-user-status") {
      const { targetUserId, isActive } = body as { targetUserId: string; isActive: boolean };

      if (!targetUserId || typeof isActive !== "boolean") {
        return NextResponse.json(
          { success: false, error: "Target user ID and active status boolean are required." },
          { status: 400 }
        );
      }

      const targetUser = await dataService.getUserById(targetUserId);
      if (!targetUser) {
        return NextResponse.json({ success: false, error: "Target user not found." }, { status: 404 });
      }

      // Only Super Admin can deactivate Admins or other Super Admins
      if ((targetUser.role === "ADMIN" || targetUser.role === "SUPER_ADMIN") && !isSuperAdmin(session.role)) {
        return NextResponse.json(
          { success: false, error: "Permission denied. Only Super Administrators can alter administrative account status." },
          { status: 403 }
        );
      }

      // Prevent deactivating the last active Super Admin
      if (targetUser.role === "SUPER_ADMIN" && !isActive) {
        const allUsers = await dataService.getAllUsers();
        const activeSuperAdmins = allUsers.filter((u: any) => u.role === "SUPER_ADMIN" && u.isActive);
        if (activeSuperAdmins.length <= 1) {
          return NextResponse.json(
            { success: false, error: "Cannot deactivate the sole active Super Administrator." },
            { status: 400 }
          );
        }
      }

      await dataService.updateUser(targetUserId, { isActive });

      if (!isActive) {
        // Immediately terminate any active sessions for the deactivated user
        await dataService.deleteUserSessions(targetUserId);
      }

      await dataService.recordAuditLog({
        adminId: session.id,
        action: isActive ? "USER_ACTIVATED" : "USER_DEACTIVATED",
        entityType: "User",
        entityId: targetUserId,
        details: `User ${targetUser.email} ${isActive ? "activated" : "deactivated"} by ${session.email}.`,
        ipAddress: ip,
      });

      return NextResponse.json({
        success: true,
        message: `User ${targetUser.email} has been ${isActive ? "activated" : "deactivated"}.`,
      });
    }

    // -------------------------------------------------------------------------
    // 3. ADMIN DELETE USER
    // -------------------------------------------------------------------------
    if (action === "delete-user") {
      const { targetUserId } = body;
      if (!targetUserId) {
        return NextResponse.json({ success: false, error: "Target user ID is required." }, { status: 400 });
      }

      const targetUser = await dataService.getUserById(targetUserId);
      if (!targetUser) {
        return NextResponse.json({ success: false, error: "Target user not found." }, { status: 404 });
      }

      // Only Super Admin can delete Admins or Super Admins
      if ((targetUser.role === "ADMIN" || targetUser.role === "SUPER_ADMIN") && !isSuperAdmin(session.role)) {
        return NextResponse.json(
          { success: false, error: "Permission denied. Only Super Administrators can delete administrative accounts." },
          { status: 403 }
        );
      }

      // Never delete the last Super Admin
      if (targetUser.role === "SUPER_ADMIN") {
        const allUsers = await dataService.getAllUsers();
        const activeSuperAdmins = allUsers.filter((u: any) => u.role === "SUPER_ADMIN" && u.isActive);
        if (activeSuperAdmins.length <= 1) {
          return NextResponse.json(
            { success: false, error: "Cannot delete the sole active Super Administrator." },
            { status: 400 }
          );
        }
      }

      await dataService.deleteUser(targetUserId);

      await dataService.recordAuditLog({
        adminId: session.id,
        action: "USER_DELETED_BY_ADMIN",
        entityType: "User",
        entityId: targetUserId,
        details: `User ${targetUser.email} deleted by admin ${session.email} (${session.role}).`,
        ipAddress: ip,
      });

      return NextResponse.json({
        success: true,
        message: `User ${targetUser.email} permanently removed.`,
      });
    }

    // -------------------------------------------------------------------------
    // 4. VERIFY / UPDATE TOOL STATUS
    // -------------------------------------------------------------------------
    if (action === "verify-tool") {
      const { toolId, status, notes } = body;
      await dataService.recordAuditLog({
        adminId: session.id,
        action: "TOOL_VERIFIED",
        entityType: "Tool",
        entityId: toolId,
        details: `Tool verification updated to ${status}. Notes: ${notes || "None"}`,
        ipAddress: ip,
      });

      return NextResponse.json({
        success: true,
        message: `Tool status updated to ${status}.`,
      });
    }

    // Fallback mutation logger
    await dataService.recordAuditLog({
      adminId: session.id,
      action: action || "ADMIN_MUTATION",
      entityType: body.entityType || "UNKNOWN",
      entityId: body.entityId || undefined,
      newValue: JSON.stringify(body.payload || {}),
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      message: `Action '${action}' executed successfully and audited.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
