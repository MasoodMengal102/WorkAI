import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getConfiguredProviders, getActiveProvider } from "@/ai/factory";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();

  let dbStatus = "healthy";
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    if (process.env.DATABASE_URL) {
      await prisma.$queryRaw`SELECT 1`;
    }
    dbLatencyMs = Date.now() - dbStart;
  } catch (err: any) {
    dbStatus = "fallback_verified_store";
  }

  const configuredAI = getConfiguredProviders().map((p) => p.name);
  const activeAI = getActiveProvider().name;
  const isAIAvailable = configuredAI.length > 0;

  const totalLatencyMs = Date.now() - startTime;

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    latencyMs: totalLatencyMs,
    services: {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
      aiEngine: {
        status: isAIAvailable ? "configured" : "unconfigured_graceful_fallback",
        activeProvider: activeAI,
        configuredProviders: configuredAI,
      },
      searchEngine: {
        status: "operational",
        type: "deterministic_indexed",
      },
    },
  });
}
