import { NextRequest, NextResponse } from "next/server";
import { trackEvent, type TrackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TrackEvent;

    if (!body.event || !body.module) {
      return NextResponse.json({ error: "Missing event or module" }, { status: 400 });
    }

    // Inject geo from Vercel headers (server-side only, not spoofable by client)
    const country = req.headers.get("x-vercel-ip-country") || undefined;
    const city = req.headers.get("x-vercel-ip-city") || undefined;
    if (country) {
      body.geo = { country, city: city ? decodeURIComponent(city) : undefined };
    }

    const ok = await trackEvent(body);

    if (!ok) {
      // Redis not configured - silently succeed (don't break UX)
      return NextResponse.json({ tracked: false });
    }

    return NextResponse.json({ tracked: true });
  } catch {
    // Never let tracking errors affect user experience
    return NextResponse.json({ tracked: false });
  }
}
