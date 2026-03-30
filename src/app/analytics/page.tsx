"use client";

import { useState, useCallback } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { DailyStats, GeoCount } from "@/lib/analytics";
import { AnalyticsTracker } from "@/components/ui/AnalyticsTracker";

const MODULE_COLORS: Record<string, string> = {
  home: "#6366f1",
  "team-health": "#10b981",
  "tech-debt": "#f59e0b",
  "estimation-bias": "#ef4444",
  "m-and-a": "#8b5cf6",
};

const MODULE_LABELS: Record<string, string> = {
  home: "Home",
  "team-health": "Team Health",
  "tech-debt": "Tech Debt",
  "estimation-bias": "Estimation Bias",
  "m-and-a": "M&A",
};

export default function AnalyticsPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<DailyStats[]>([]);
  const [geo, setGeo] = useState<GeoCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);

  const fetchStats = useCallback(
    async (pw: string, d: number) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/analytics?password=${encodeURIComponent(pw)}&days=${d}`);
        if (!res.ok) {
          if (res.status === 401) {
            setError("Invalid password");
            setAuthenticated(false);
          } else {
            setError("Failed to load analytics");
          }
          return;
        }
        const data = await res.json();
        setStats(data.stats || []);
        setGeo(data.geo || []);
        setAuthenticated(true);
      } catch {
        setError("Connection error");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStats(password, days);
  };

  const handleDaysChange = (d: number) => {
    setDays(d);
    if (authenticated) fetchStats(password, d);
  };

  // --- Derived data ---
  const dailyPageViews = stats
    .map((s) => ({
      date: s.date.slice(5), // "03-30"
      total: Object.values(s.pageViews).reduce((a, b) => a + b, 0),
      ...Object.fromEntries(
        Object.entries(s.pageViews).map(([k, v]) => [`pv_${k}`, v])
      ),
    }))
    .reverse();

  const moduleBreakdown = Object.keys(MODULE_LABELS)
    .filter((m) => m !== "home")
    .map((mod) => ({
      name: MODULE_LABELS[mod],
      pageViews: stats.reduce((sum, s) => sum + (s.pageViews[mod] || 0), 0),
      analyzes: stats.reduce((sum, s) => sum + (s.analyzes[mod] || 0), 0),
      sampleLoads: stats.reduce((sum, s) => sum + (s.sampleLoads[mod] || 0), 0),
    }));

  const totalPageViews = stats.reduce(
    (sum, s) => sum + Object.values(s.pageViews).reduce((a, b) => a + b, 0),
    0
  );
  const totalAnalyzes = stats.reduce(
    (sum, s) => sum + Object.values(s.analyzes).reduce((a, b) => a + b, 0),
    0
  );
  const totalSampleLoads = stats.reduce(
    (sum, s) => sum + Object.values(s.sampleLoads).reduce((a, b) => a + b, 0),
    0
  );
  const totalVisitors = stats.reduce((sum, s) => sum + s.uniqueVisitors, 0);

  const conversionRate =
    totalPageViews > 0 ? ((totalAnalyzes / totalPageViews) * 100).toFixed(1) : "0.0";

  // Aggregate geo by country
  const geoByCountry = Object.entries(
    geo.reduce<Record<string, number>>((acc, g) => {
      const country = g.location.split("/")[0];
      acc[country] = (acc[country] || 0) + g.count;
      return acc;
    }, {})
  )
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);

  const pieData = Object.keys(MODULE_LABELS)
    .map((mod) => ({
      name: MODULE_LABELS[mod],
      value: stats.reduce((sum, s) => sum + (s.pageViews[mod] || 0), 0),
      color: MODULE_COLORS[mod],
    }))
    .filter((d) => d.value > 0);

  // --- Login screen ---
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <AnalyticsTracker module="analytics" />
        <form
          onSubmit={handleLogin}
          className="bg-gray-900 border border-gray-800 rounded-lg p-8 w-full max-w-sm"
        >
          <h1 className="text-xl font-bold text-white mb-6">Analytics</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 mb-4 focus:outline-none focus:border-indigo-500"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium disabled:opacity-50"
          >
            {loading ? "Loading..." : "View Analytics"}
          </button>
        </form>
      </div>
    );
  }

  // --- Dashboard ---
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 max-w-7xl mx-auto">
      <AnalyticsTracker module="analytics" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => handleDaysChange(d)}
              className={`px-3 py-1 rounded text-sm ${
                days === d
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <KPICard label="Page Views" value={totalPageViews} />
        <KPICard label="Unique Visitors" value={totalVisitors} />
        <KPICard label="Analyses Run" value={totalAnalyzes} />
        <KPICard label="Sample Loads" value={totalSampleLoads} />
        <KPICard label="Conversion" value={`${conversionRate}%`} sub="view to analyze" />
      </div>

      {loading && (
        <div className="text-center text-gray-400 py-8">Loading...</div>
      )}

      {!loading && stats.length === 0 && (
        <div className="text-center text-gray-500 py-16">
          <p className="text-lg mb-2">No data yet</p>
          <p className="text-sm">Analytics will appear once visitors start using the tool.</p>
        </div>
      )}

      {!loading && stats.length > 0 && (
        <>
          {/* Daily Page Views */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Daily Page Views</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyPageViews}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Module Breakdown */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Module Usage</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={moduleBreakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#9ca3af"
                    fontSize={12}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="pageViews" name="Views" fill="#6366f1" />
                  <Bar dataKey="analyzes" name="Analyzes" fill="#10b981" />
                  <Bar dataKey="sampleLoads" name="Samples" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Traffic Distribution */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Traffic Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Unique Visitors */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Daily Unique Visitors</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={stats
                  .map((s) => ({
                    date: s.date.slice(5),
                    visitors: s.uniqueVisitors,
                  }))
                  .reverse()}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="visitors" name="Visitors" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Geo Distribution */}
          {geo.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Top Countries</h2>
                <ResponsiveContainer width="100%" height={Math.max(200, geoByCountry.length * 36)}>
                  <BarChart data={geoByCountry.slice(0, 10)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                    <YAxis
                      dataKey="country"
                      type="category"
                      stroke="#9ca3af"
                      fontSize={12}
                      width={50}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" name="Visits" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Top Cities</h2>
                <div className="overflow-y-auto max-h-80">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-800">
                        <th className="text-left py-2 pr-4">Location</th>
                        <th className="text-right py-2">Visits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {geo.slice(0, 20).map((g) => {
                        const [country, city] = g.location.split("/");
                        return (
                          <tr key={g.location} className="border-b border-gray-800/50">
                            <td className="py-2 pr-4 text-gray-300">
                              <span className="mr-2">{countryFlag(country)}</span>
                              {city === "unknown" ? country : `${city}, ${country}`}
                            </td>
                            <td className="py-2 text-right">{g.count}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Raw Data Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Daily Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800">
                    <th className="text-left py-2 pr-4">Date</th>
                    <th className="text-right py-2 px-2">Views</th>
                    <th className="text-right py-2 px-2">Visitors</th>
                    <th className="text-right py-2 px-2">Analyzes</th>
                    <th className="text-right py-2 px-2">Samples</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((s) => (
                    <tr key={s.date} className="border-b border-gray-800/50">
                      <td className="py-2 pr-4 text-gray-300">{s.date}</td>
                      <td className="py-2 px-2 text-right">
                        {Object.values(s.pageViews).reduce((a, b) => a + b, 0)}
                      </td>
                      <td className="py-2 px-2 text-right">{s.uniqueVisitors}</td>
                      <td className="py-2 px-2 text-right">
                        {Object.values(s.analyzes).reduce((a, b) => a + b, 0)}
                      </td>
                      <td className="py-2 px-2 text-right">
                        {Object.values(s.sampleLoads).reduce((a, b) => a + b, 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function KPICard({
  label,
  value,
  sub,
}: {
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

function countryFlag(code: string): string {
  if (!code || code.length !== 2) return "";
  const offset = 0x1f1e6;
  const a = code.toUpperCase().charCodeAt(0) - 65 + offset;
  const b = code.toUpperCase().charCodeAt(1) - 65 + offset;
  return String.fromCodePoint(a, b);
}
