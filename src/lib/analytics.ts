import { Redis } from "@upstash/redis";

// --- Types ---

export type EventType = "page_view" | "analyze" | "sample_load";
export type ModuleName =
  | "home"
  | "team-health"
  | "tech-debt"
  | "estimation-bias"
  | "m-and-a"
  | "analytics";

export interface GeoInfo {
  country?: string;
  city?: string;
}

export interface TrackEvent {
  event: EventType;
  module: ModuleName;
  meta?: Record<string, string>;
  fingerprint?: string;
  geo?: GeoInfo;
}

export interface GeoCount {
  location: string; // "DE/Berlin", "JP/Tokyo", "US/unknown"
  count: number;
}

export interface DailyStats {
  date: string;
  pageViews: Record<string, number>;
  analyzes: Record<string, number>;
  sampleLoads: Record<string, number>;
  uniqueVisitors: number;
}

export interface AnalyticsData {
  stats: DailyStats[];
  geo: GeoCount[];
}

// --- Redis Client ---

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

// --- Key Helpers ---

function dateKey(d?: Date): string {
  const date = d || new Date();
  return date.toISOString().slice(0, 10); // "2026-03-30"
}

function eventKey(event: EventType, module: string, date: string): string {
  return `evt:${date}:${event}:${module}`;
}

function visitorKey(date: string): string {
  return `uv:${date}`;
}

function geoKey(date: string): string {
  return `geo:${date}`;
}

// --- Track ---

export async function trackEvent(ev: TrackEvent): Promise<boolean> {
  const r = getRedis();
  if (!r) return false;

  const date = dateKey();
  const key = eventKey(ev.event, ev.module, date);

  const pipeline = r.pipeline();
  pipeline.incr(key);

  // Track scenario ID if sample_load
  if (ev.event === "sample_load" && ev.meta?.scenarioId) {
    pipeline.incr(eventKey("sample_load", `${ev.module}:${ev.meta.scenarioId}`, date));
  }

  // Unique visitor tracking
  if (ev.fingerprint) {
    pipeline.sadd(visitorKey(date), ev.fingerprint);
  }

  // Geo tracking (country/city from Vercel headers)
  if (ev.geo?.country) {
    const loc = ev.geo.city
      ? `${ev.geo.country}/${ev.geo.city}`
      : `${ev.geo.country}/unknown`;
    pipeline.hincrby(geoKey(date), loc, 1);
  }

  // Keep a set of all active dates for enumeration
  pipeline.sadd("dates", date);

  await pipeline.exec();
  return true;
}

// --- Retrieve ---

export async function getStats(days: number = 30): Promise<DailyStats[]> {
  const r = getRedis();
  if (!r) return [];

  const modules: ModuleName[] = [
    "home",
    "team-health",
    "tech-debt",
    "estimation-bias",
    "m-and-a",
  ];
  const events: EventType[] = ["page_view", "analyze", "sample_load"];

  const dates: string[] = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(dateKey(d));
  }

  const results: DailyStats[] = [];

  for (const date of dates) {
    const pipeline = r.pipeline();

    // Fetch all event counts for this date
    for (const event of events) {
      for (const mod of modules) {
        pipeline.get(eventKey(event, mod, date));
      }
    }
    // Unique visitors
    pipeline.scard(visitorKey(date));

    const raw = await pipeline.exec();

    const pageViews: Record<string, number> = {};
    const analyzes: Record<string, number> = {};
    const sampleLoads: Record<string, number> = {};
    let idx = 0;

    for (const event of events) {
      for (const mod of modules) {
        const val = (raw[idx] as number) || 0;
        if (event === "page_view") pageViews[mod] = val;
        else if (event === "analyze") analyzes[mod] = val;
        else if (event === "sample_load") sampleLoads[mod] = val;
        idx++;
      }
    }

    const uniqueVisitors = (raw[idx] as number) || 0;

    // Only include dates that have any data
    const total =
      Object.values(pageViews).reduce((a, b) => a + b, 0) +
      Object.values(analyzes).reduce((a, b) => a + b, 0) +
      Object.values(sampleLoads).reduce((a, b) => a + b, 0) +
      uniqueVisitors;

    if (total > 0) {
      results.push({ date, pageViews, analyzes, sampleLoads, uniqueVisitors });
    }
  }

  return results;
}

export async function getGeoStats(days: number = 30): Promise<GeoCount[]> {
  const r = getRedis();
  if (!r) return [];

  const dates: string[] = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(dateKey(d));
  }

  const aggregated: Record<string, number> = {};

  for (const date of dates) {
    const data = await r.hgetall<Record<string, number>>(geoKey(date));
    if (data) {
      for (const [loc, count] of Object.entries(data)) {
        aggregated[loc] = (aggregated[loc] || 0) + (count || 0);
      }
    }
  }

  return Object.entries(aggregated)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count);
}
