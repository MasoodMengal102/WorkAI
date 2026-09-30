import { NextRequest, NextResponse } from "next/server";
import { executeService } from "@/ai/services/runner";
import { checkRateLimit } from "@/lib/rate-limit";
import { dataService } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { service: string } }
) {
  try {
    const serviceSlug = params.service;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    // 1. Verify service exists in database
    const serviceDef = await dataService.getAiServiceBySlug(serviceSlug);
    if (!serviceDef) {
      return NextResponse.json(
        { success: false, error: `Service '${serviceSlug}' not found.` },
        { status: 404 }
      );
    }

    // 2. Enforce IP Rate Limiting (Infrastructure protection)
    const rateCheck = checkRateLimit(`service:${serviceSlug}:${ip}`, 20, 86400);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: rateCheck.message },
        { status: 429 }
      );
    }

    // 3. Parse and validate body
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request payload." },
        { status: 400 }
      );
    }

    const inputs = body.inputs;
    if (!inputs || typeof inputs !== "object") {
      return NextResponse.json(
        { success: false, error: "Missing required inputs object." },
        { status: 400 }
      );
    }

    // Verify required fields
    for (const field of serviceDef.inputFields) {
      if (field.required && (!inputs[field.name] || !String(inputs[field.name]).trim())) {
        return NextResponse.json(
          { success: false, error: `Field '${field.label}' is required.` },
          { status: 400 }
        );
      }
    }

    // 4. Execute Service
    const execution = await executeService({
      serviceSlug,
      inputs,
      ipHash: ip,
    });

    if (!execution.success) {
      return NextResponse.json(
        {
          success: false,
          error: execution.error || "AI generation is temporarily unavailable. Please verify provider configuration.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      result: execution.result,
      provider: execution.provider,
      model: execution.model,
      tokensUsed: execution.tokensUsed,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
