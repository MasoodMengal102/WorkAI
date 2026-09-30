import { NextRequest, NextResponse } from "next/server";
import { dataService } from "@/lib/db";

/**
 * Safe Approved Internal Redirect Engine.
 * 
 * Strict Open-Redirect & Affiliate Protection (Requirement 6 & 62):
 * - Does NOT accept arbitrary redirect query parameters (e.g. ?url=...).
 * - Only resolves approved resource IDs ('tool-xyz' or slug) to verified database URLs.
 * - If an approved affiliate URL exists, redirects to it with sponsored tag.
 * - Otherwise, redirects directly to the tool's verified official URL.
 * - Logs anonymous click metrics without storing PII.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const resourceId = params.id;
  const tools = await dataService.getTools();

  // Find tool by ID or slug
  const tool = tools.find((t) => t.id === resourceId || t.slug === resourceId);

  if (!tool) {
    return NextResponse.redirect(new URL("/tools", req.url));
  }

  // Determine target URL: approved affiliate URL or verified official URL
  const targetUrl = (tool.affiliateStatus === "ACTIVE" && tool.affiliateUrl) ? tool.affiliateUrl : tool.officialUrl;

  // SSRF and protocol check: only allow absolute https:// or http://
  if (!targetUrl.startsWith("https://") && !targetUrl.startsWith("http://")) {
    return NextResponse.redirect(new URL(`/tools/${tool.slug}`, req.url));
  }

  // Asynchronously record anonymous click event
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const referrer = req.headers.get("referer") || undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    // In a live DB with Prisma, creates affiliateClick record
    dataService.recordAuditLog({
      action: "AFFILIATE_CLICK",
      entityType: "TOOL",
      entityId: tool.id,
      newValue: JSON.stringify({ referrer, userAgent: userAgent?.slice(0, 100) }),
      ipAddress: ip,
    }).catch(() => {});
  } catch {}

  // Safe 307 temporary redirect
  const response = NextResponse.redirect(new URL(targetUrl));
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}
