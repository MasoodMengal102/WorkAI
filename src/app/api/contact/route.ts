import { NextRequest, NextResponse } from "next/server";
import { dataService } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const rateCheck = checkRateLimit(`contact:${ip}`, 5, 86400);

    if (!rateCheck.allowed) {
      return NextResponse.json({ success: false, error: rateCheck.message }, { status: 429 });
    }

    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: "All contact fields are required." }, { status: 400 });
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    const saved = await dataService.recordContact({
      name: String(name).slice(0, 100),
      email: String(email).slice(0, 150),
      subject: String(subject).slice(0, 200),
      message: String(message).slice(0, 5000),
      ipHash: ip,
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been received securely. We will review it shortly.",
      id: saved.id,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
