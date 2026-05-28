"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, TrendingUp, TrendingDown, AlertCircle, FileText, Building2 } from "lucide-react";
import { ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";
import { MOCK_TRANSACTIONS, MOCK_OPPORTUNITIES, MOCK_ENTITY_FILINGS, MOCK_MARKET_STATS, MOCK_USER, MOCK_PROPERTIES } from "@/lib/mock-data";
import { formatCurrency, formatRelativeDate, getPropertyTypeBadgeClass } from "@/lib/utils";
import { LiveSignalRail } from "@/components/LiveSignals";

function AnimatedCounter({ to, prefix = "", suffix = "", duration = 1500 }: { to: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let start = 0;
    const step = to / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); } else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [to, duration]);
  return <div ref={ref} className="number-display">{prefix}{count.toLocaleString()}{suffix}</div>;
}

function ScoreGaugeSmall({ score }: { score: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 85 ? "var(--emerald)" : score >= 70 ? "var(--amber)" : "var(--cyan)";
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r={r} fill="none" stroke="var(--border)" strokeWidth="3" />
      <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 24 24)" style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
      <text x="24" y="24" textAnchor="middle" dy="0.35em" fontSize="11" fontWeight="700" fill={color} fontFamily="JetBrains Mono, monospace">{score}</text>
    </svg>
  );
}

function MetricCard({ label, value, change, changeLabel, color, icon }: { label: string; value: React.ReactNode; change?: number; changeLabel?: string; color: string; icon: React.ReactNode }) {
  const positive = (change ?? 0) >= 0;
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: positive ? "var(--emerald)" : "var(--rose)" }}>
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="number-display font-bold text-2xl mb-1" style={{ color: "var(--text-primary)" }}>{value}</div>
      <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{label}</div>
      {changeLabel && <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{changeLabel}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: "var(--elevated)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 12px", fontSize: "12px" }}>
        <p style={{ color: "var(--text-tertiary)", marginBottom: 4 }}>{label}</p>
        <p className="number-display font-bold" style={{ color: "var(--violet)" }}>{payload[0]?.value}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardHome() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const volumeData = MOCK_MARKET_STATS.weeklyTrend.map((d) => ({ name: d.week, volume: d.volume }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>
            {greeting}, {MOCK_USER.name.split(" ")[0]}.
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} · Franklin County, OH · 47 new signals today
          </p>
        </div>
        <Link href="/dashboard/briefing" className="btn-primary" style={{ padding: "10px 20px", fontSize: "13px" }}>
          View Today&apos;s Briefing <ArrowRight size={14} />
        </Link>
      </div>

      {/* Live ticker — pulls from useLiveSignals hook (new signal every 8–14s) */}
      <div className="rounded-2xl overflow-hidden no-print" style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.06), rgba(6,182,212,0.03))", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <span className="status-live">LIVE</span>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Streaming from county recorder, permit & SoS systems</span>
          </div>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>new signals every few seconds</span>
        </div>
        <LiveSignalRail />
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="New Transactions (7d)" value={<AnimatedCounter to={47} />} change={12} changeLabel="vs last week" color="var(--violet)" icon={<ArrowUpRight size={16} />} />
        <MetricCard label="Active Permits" value={<AnimatedCounter to={7} />} change={-8} changeLabel="vs last week" color="var(--cyan)" icon={<FileText size={16} />} />
        <MetricCard label="Opportunity Alerts" value={<AnimatedCounter to={8} />} change={33} changeLabel="new high scores" color="var(--amber)" icon={<AlertCircle size={16} />} />
        <MetricCard label="Watchlist Updates" value={<AnimatedCounter to={3} />} changeLabel="activity detected" color="var(--emerald)" icon={<Building2 size={16} />} />
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's highlights */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Today&apos;s Highlights</h2>
            <Link href="/dashboard/briefing" className="text-xs font-semibold" style={{ color: "var(--violet)", textDecoration: "none" }}>View full briefing →</Link>
          </div>

          {/* Top opportunity */}
          <div className="opportunity-card p-5">
            <div className="flex items-start gap-4">
              <ScoreGaugeSmall score={94} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge badge-amber">TOP OPPORTUNITY</span>
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>3200 Morse Rd · Former Kroger Distribution Center</h3>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                  Estate disposition pattern — trust entity with 2 named trustees. Adjacent parcel sold 90 days ago at 47% premium. Asset dark since 2023, 37% below replacement cost.
                </p>
                <Link href="/dashboard/opportunities" className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--amber)", textDecoration: "none" }}>
                  View Full Analysis <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Recent transactions */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Recent Transactions</h3>
              <Link href="/dashboard/deals" className="text-xs" style={{ color: "var(--violet)", textDecoration: "none" }}>All deals →</Link>
            </div>
            <div className="space-y-3">
              {MOCK_TRANSACTIONS.slice(0, 5).map((txn) => {
                const prop = MOCK_PROPERTIES.find((p) => p.id === txn.propertyId);
                return (
                  <div key={txn.id} className="flex items-center gap-3 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{prop?.address || txn.propertyId}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{txn.buyer} · {formatRelativeDate(txn.recordedDate)}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="number-display text-sm font-bold" style={{ color: "var(--violet)" }}>{txn.price ? formatCurrency(txn.price, true) : "—"}</div>
                      <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{prop?.propertyType}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Market pulse */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text-primary)" }}>Market Pulse — 5 Week</h3>
            <div className="mb-2">
              <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Transaction Volume ($M)</div>
              <div className="number-display font-bold text-xl" style={{ color: "var(--violet)" }}>$248.7M</div>
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={volumeData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="volume" stroke="var(--violet)" fill="url(#volumeGrad)" strokeWidth={2} dot={false} />
                <Tooltip content={<CustomTooltip />} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top opportunities list */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Top Opportunities</h3>
              <Link href="/dashboard/opportunities" className="text-xs" style={{ color: "var(--amber)", textDecoration: "none" }}>View all →</Link>
            </div>
            <div className="space-y-3">
              {MOCK_OPPORTUNITIES.slice(0, 5).map((opp) => {
                const prop = MOCK_PROPERTIES.find((p) => p.id === opp.propertyId);
                const color = opp.score >= 85 ? "var(--emerald)" : opp.score >= 70 ? "var(--amber)" : "var(--cyan)";
                return (
                  <Link key={opp.id} href="/dashboard/opportunities" style={{ textDecoration: "none" }}>
                    <div className="flex items-center gap-3 py-2 hover:bg-white/5 rounded-lg px-2 -mx-2 transition-colors" style={{ borderBottom: "1px solid var(--border)" }}>
                      <div className="number-display font-bold text-lg flex-shrink-0 w-8 text-center" style={{ color }}>{opp.score}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{prop?.address}</div>
                        <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{prop?.propertyType}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent entity filings */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Entity Filings</h3>
              <span className="badge badge-violet">{MOCK_ENTITY_FILINGS.length} new</span>
            </div>
            <div className="space-y-3">
              {MOCK_ENTITY_FILINGS.slice(0, 3).map((ef) => (
                <div key={ef.id} className="py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div className="text-xs font-medium mb-0.5" style={{ color: "var(--text-primary)" }}>{ef.entityName}</div>
                  <div className="flex items-center gap-2">
                    <span className={`badge text-2xs ${ef.filingType === "formation" ? "badge-emerald" : ef.filingType === "dissolution" ? "badge-rose" : "badge-cyan"}`} style={{ fontSize: "9px" }}>
                      {ef.filingType}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{formatRelativeDate(ef.filingDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Recent Territory Activity</h3>
          <Link href="/dashboard/deals" className="text-xs" style={{ color: "var(--violet)", textDecoration: "none" }}>View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="dm-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Type</th>
                <th>Details</th>
                <th>Value</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TRANSACTIONS.slice(0, 8).map((txn) => {
                const prop = MOCK_PROPERTIES.find((p) => p.id === txn.propertyId);
                return (
                  <tr key={txn.id}>
                    <td>
                      <div className="font-medium text-xs" style={{ color: "var(--text-primary)" }}>{prop?.address}</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{prop?.city}, {prop?.state}</div>
                    </td>
                    <td><span className={`badge ${getPropertyTypeBadgeClass(prop?.propertyType || "")}`}>{prop?.propertyType}</span></td>
                    <td><div className="text-xs truncate max-w-xs" style={{ color: "var(--text-tertiary)" }}>{txn.buyer}</div></td>
                    <td><div className="number-display text-xs font-bold" style={{ color: "var(--violet)" }}>{txn.price ? formatCurrency(txn.price, true) : "—"}</div></td>
                    <td><div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{formatRelativeDate(txn.recordedDate)}</div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
