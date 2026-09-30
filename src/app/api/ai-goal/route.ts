import { NextRequest, NextResponse } from "next/server";
import { analyzeUserGoal } from "@/ai/goal-analyzer";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const rateCheck = checkRateLimit(`goal:${ip}`, 30, 86400);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: rateCheck.message },
        { status: 429 }
      );
    }

    const body = await req.json();
    const goal = body.goal;

    if (!goal || typeof goal !== "string" || goal.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Please provide a goal description." },
        { status: 400 }
      );
    }

    if (goal.length > 500) {
      return NextResponse.json(
        { success: false, error: "Goal prompt is too long. Please limit to 500 characters." },
        { status: 400 }
      );
    }

    const result = await analyzeUserGoal(goal, ip);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to analyze goal." },
      { status: 500 }
    );
  }
}
