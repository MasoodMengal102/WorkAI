import { NextRequest, NextResponse } from "next/server";
import { getAuthSession, hasAdminRole, hasEditorRole } from "@/lib/auth";
import { dataService } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session || !hasEditorRole(session.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const { action, entityType, entityId, payload } = body;

    // Record audit log for every mutation
    await dataService.recordAuditLog({
      adminId: session.id,
      action: action || "ADMIN_MUTATION",
      entityType: entityType || "UNKNOWN",
      entityId: entityId || undefined,
      newValue: JSON.stringify(payload || {}),
    });

    return NextResponse.json({
      success: true,
      message: `Action '${action}' executed successfully and audited.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
