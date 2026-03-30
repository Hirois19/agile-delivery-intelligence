import { NextRequest, NextResponse } from "next/server";
import { getStats, getGeoStats } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get("password");
  const expected = process.env.ANALYTICS_PASSWORD;

  if (!expected || password !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const days = parseInt(req.nextUrl.searchParams.get("days") || "30", 10);
  const clampedDays = Math.min(days, 90);

  const [stats, geo] = await Promise.all([
    getStats(clampedDays),
    getGeoStats(clampedDays),
  ]);

  return NextResponse.json({ stats, geo });
}
