"use client";

import { useState } from "react";
import { Download, TrendingUp } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  AreaChart, Area, CartesianGrid, PieChart, Pie, Cell, Legend
} from "recharts";
import { MOCK_MARKET_STATS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color?: string }>; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: "var(--elevated)", border: "1px solid var(--border)", borderRadius: "10px", padding: "10px 14px", fontSize: "12px" }}>
        <p style={{ color: "var(--text-tertiary)", marginBottom: 6 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="number-display font-bold" style={{ color: p.color || "var(--violet)" }}>{p.name}: {typeof p.value === "number" && p.value > 1000 ? formatCurrency(p.value * 1000000, true) : p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const PIE_COLORS = ["#8B5CF6", "#06B6D4", "#F59E0B", "#10B981", "#EC4899"];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("monthly");

  const data: Array<{ month?: string; week?: string; volume: number; transactions: number }> =
    timeframe === "monthly" ? MOCK_MARKET_STATS.monthlyTrend : MOCK_MARKET_STATS.weeklyTrend;

  const pricePerSFData = Object.entries(MOCK_MARKET_STATS.avgPricePerSF).map(([type, value]) => ({ name: type, value }));

  const permitData = [
    { name: "New Construction", value: MOCK_MARKET_STATS.permitActivity.newConstruction },
    { name: "Renovation", value: MOCK_MARKET_STATS.permitActivity.renovation },
    { name: "Demolition", value: MOCK_MARKET_STATS.permitActivity.demolition },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>Market Analytics</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Franklin County, OH · Data through May 14, 2025</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {(["weekly", "monthly"] as const).map((tf) => (
              <button key={tf} onClick={() => setTimeframe(tf)} className="px-4 py-2 text-xs font-semibold transition-colors capitalize"
                style={{ background: timeframe === tf ? "var(--elevated)" : "var(--surface)", color: timeframe === tf ? "var(--text-primary)" : "var(--text-tertiary)", cursor: "pointer", border: "none" }}>
                {tf}
              </button>
            ))}
          </div>
          <button className="btn-ghost" style={{ padding: "8px 14px", fontSize: "13px" }}><Download size={14} /> Export</button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Volume (YTD)", value: formatCurrency(MOCK_MARKET_STATS.totalTransactionVolume, true), color: "var(--violet)" },
          { label: "Total Transactions", value: MOCK_MARKET_STATS.totalTransactions, color: "var(--cyan)" },
          { label: "New Permits Filed", value: Object.values(MOCK_MARKET_STATS.permitActivity).reduce((a, b) => a + b, 0), color: "var(--amber)" },
          { label: "Entity Filings", value: Object.values(MOCK_MARKET_STATS.entityFilings).reduce((a, b) => a + b, 0), color: "var(--emerald)" },
        ].map(({ label, value, color }) => (
          <div key={label} className="metric-card">
            <div className="number-display font-bold text-2xl mb-1" style={{ color }}>{value}</div>
            <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Transaction volume chart */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>Transaction Volume</h2>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Total sale volume in $M</p>
          </div>
          <TrendingUp size={18} style={{ color: "var(--violet)" }} />
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
            <XAxis dataKey={timeframe === "monthly" ? "month" : "week"} tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="volume" name="Volume ($M)" stroke="var(--violet)" fill="url(#volGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "var(--violet)" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Price per SF by type */}
        <div className="glass-card p-6">
          <h2 className="font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>Avg Price/SF by Type</h2>
          <p className="text-xs mb-6" style={{ color: "var(--text-tertiary)" }}>Average sale price per square foot</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pricePerSFData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="$/SF" radius={[6, 6, 0, 0]}>
                {pricePerSFData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Permit activity */}
        <div className="glass-card p-6">
          <h2 className="font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>Permit Activity</h2>
          <p className="text-xs mb-6" style={{ color: "var(--text-tertiary)" }}>Breakdown by permit type</p>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={permitData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {permitData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {permitData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <div>
                    <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{d.name}</div>
                    <div className="number-display text-xs" style={{ color: "var(--text-tertiary)" }}>{d.value} permits</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top buyers/sellers */}
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { title: "Top Buyers", data: MOCK_MARKET_STATS.topBuyers, color: "var(--violet)" },
          { title: "Top Sellers", data: MOCK_MARKET_STATS.topSellers, color: "var(--cyan)" },
        ].map(({ title, data, color }) => (
          <div key={title} className="glass-card p-6">
            <h2 className="font-bold text-base mb-4" style={{ color: "var(--text-primary)" }}>{title}</h2>
            <div className="space-y-3">
              {data.map((item, i) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="number-display text-sm font-bold w-6 text-center" style={{ color: "var(--text-muted)" }}>#{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{item.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="h-1.5 rounded-full flex-1" style={{ background: "var(--elevated)" }}>
                        <div className="h-full rounded-full" style={{ width: `${(item.volume / data[0].volume) * 100}%`, background: color }} />
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="number-display text-xs font-bold" style={{ color }}>{formatCurrency(item.volume, true)}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{item.count} deal{item.count > 1 ? "s" : ""}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
