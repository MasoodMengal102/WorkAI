import { NextRequest, NextResponse } from "next/server";
import { runAIFinder } from "@/ai/finder";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const rateCheck = checkRateLimit(`finder:${ip}`, 60, 86400);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: rateCheck.message },
        { status: 429 }
      );
    }

    const body = await req.json();
    const matches = await runAIFinder({
      query: body.query,
      category: body.category,
      pricingStatus: body.pricingStatus,
      platform: body.platform,
      commercialUseOnly: Boolean(body.commercialUseOnly),
      apiRequired: Boolean(body.apiRequired),
    });

    return NextResponse.json({ success: true, count: matches.length, matches });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to search tools." },
      { status: 500 }
    );
  }
}
