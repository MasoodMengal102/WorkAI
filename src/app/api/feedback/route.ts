import { NextRequest, NextResponse } from "next/server";
import { dataService } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const rateCheck = checkRateLimit(`feedback:${ip}`, 30, 86400);

    if (!rateCheck.allowed) {
      return NextResponse.json({ success: false, error: rateCheck.message }, { status: 429 });
    }

    const body = await req.json();
    const { pagePath, entityType, entityId, isHelpful, message } = body;

    if (!pagePath || typeof isHelpful !== "boolean") {
      return NextResponse.json({ success: false, error: "Invalid feedback payload." }, { status: 400 });
    }

    const feedback = await dataService.recordFeedback({
      pagePath: String(pagePath).slice(0, 255),
      entityType: entityType ? String(entityType).slice(0, 50) : undefined,
      entityId: entityId ? String(entityId).slice(0, 100) : undefined,
      isHelpful,
      message: message ? String(message).slice(0, 1000) : undefined,
      ipHash: ip,
    });

    return NextResponse.json({ success: true, id: feedback.id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
