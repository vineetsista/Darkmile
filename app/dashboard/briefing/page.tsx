"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, Share2, Zap, AlertCircle, FileText, Building2, Users, TrendingUp } from "lucide-react";
import { MOCK_TRANSACTIONS, MOCK_PERMITS, MOCK_ENTITY_FILINGS, MOCK_OPPORTUNITIES, MOCK_PROPERTIES, MOCK_BRIEFING_SUMMARY } from "@/lib/mock-data";
import { formatCurrency, formatDate, formatRelativeDate, getPropertyTypeBadgeClass } from "@/lib/utils";

function ScoreGauge({ score, size = 64 }: { score: number; size?: number }) {
  const r = size * 0.38;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 85 ? "var(--emerald)" : score >= 70 ? "var(--amber)" : "var(--cyan)";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="3" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
      <text x={cx} y={cy} textAnchor="middle" dy="0.35em" fontSize={size * 0.22} fontWeight="700" fill={color} fontFamily="JetBrains Mono, monospace">{score}</text>
    </svg>
  );
}

function SectionHeader({ icon, label, count, color }: { icon: React.ReactNode; label: string; count: number; color: string }) {
  return (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2"><span style={{ color }}>{icon}</span><span className="font-bold text-sm uppercase tracking-wider" style={{ color }}>{label}</span></div>
      <span className="number-display text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>{count} new</span>
    </div>
  );
}

export default function BriefingPage() {
  const [view, setView] = useState<"digest" | "detail">("digest");
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card p-6" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.04))" }}>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
          <div>
            <div className="badge badge-emerald mb-3">DELIVERED 7:00 AM ET</div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>Daily Intelligence Briefing</h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{today} · Franklin County, OH · Industrial + Office + Retail</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="btn-ghost" style={{ padding: "8px 14px", fontSize: "13px" }}><Share2 size={14} />Share</button>
            <button className="btn-ghost" style={{ padding: "8px 14px", fontSize: "13px" }}><Download size={14} />PDF</button>
          </div>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: "rgba(255,255,255,0.04)" }}>
          {(["digest", "detail"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: view === v ? "var(--elevated)" : "transparent", color: view === v ? "var(--text-primary)" : "var(--text-tertiary)", border: view === v ? "1px solid var(--border-bright)" : "1px solid transparent" }}>
              {v === "digest" ? "Digest View" : "Detailed View"}
            </button>
          ))}
        </div>
      </div>

      {/* Executive Summary */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} style={{ color: "var(--violet)" }} />
          <span className="font-bold text-xs uppercase tracking-widest" style={{ color: "var(--violet)" }}>Executive Summary</span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{MOCK_BRIEFING_SUMMARY}</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            { value: "$248.7M", label: "Total Volume", color: "var(--violet)" },
            { value: "10", label: "Transactions", color: "var(--cyan)" },
            { value: "8", label: "Opportunity Alerts", color: "var(--amber)" },
          ].map(({ value, label, color }) => (
            <div key={label} className="p-3 rounded-xl text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="number-display font-bold text-xl" style={{ color }}>{value}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Opportunity Alerts */}
      <div className="glass-card overflow-hidden">
        <div className="px-6"><SectionHeader icon={<AlertCircle size={15} />} label="Opportunity Alerts" count={MOCK_OPPORTUNITIES.length} color="var(--amber)" /></div>
        <div className="p-6 space-y-4">
          {MOCK_OPPORTUNITIES.slice(0, 3).map((opp) => {
            const prop = MOCK_PROPERTIES.find((p) => p.id === opp.propertyId);
            return (
              <div key={opp.id} className="opportunity-card p-5">
                <div className="flex items-start gap-4">
                  <ScoreGauge score={opp.score} size={60} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{prop?.address}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`badge ${getPropertyTypeBadgeClass(prop?.propertyType || "")}`}>{prop?.propertyType}</span>
                      <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{prop?.squareFeet?.toLocaleString()} SF · {prop?.city}</span>
                    </div>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>{view === "digest" ? opp.narrative.slice(0, 180) + "..." : opp.narrative}</p>
                    {view === "detail" && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {(opp.factors as { label: string; weight: number; description: string }[]).map((f) => (
                          <div key={f.label} className="p-2 rounded-lg" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.12)" }}>
                            <div className="flex items-center justify-between mb-0.5"><span className="text-xs font-semibold" style={{ color: "var(--amber)" }}>{f.label}</span><span className="number-display text-xs font-bold" style={{ color: "var(--amber)" }}>+{f.weight}</span></div>
                            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{f.description}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-xs"><span style={{ color: "var(--text-tertiary)" }}>Est. value: </span><span className="number-display font-bold" style={{ color: "var(--amber)" }}>{opp.estimatedValue ? formatCurrency(opp.estimatedValue, true) : "—"}</span></div>
                      <div className="flex items-center gap-2">
                        <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: "12px" }}>Watch</button>
                        <button className="btn-primary" style={{ padding: "6px 12px", fontSize: "12px" }}>Outreach Draft</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deed Transfers */}
      <div className="glass-card overflow-hidden">
        <div className="px-6"><SectionHeader icon={<ArrowRight size={15} />} label="Deed Transfers" count={MOCK_TRANSACTIONS.length} color="var(--violet)" /></div>
        <div className="overflow-x-auto">
          <table className="dm-table">
            <thead><tr><th>Property</th><th>Buyer</th><th>Seller</th><th>Price</th><th>$/SF</th><th>Date</th></tr></thead>
            <tbody>
              {MOCK_TRANSACTIONS.map((txn) => {
                const prop = MOCK_PROPERTIES.find((p) => p.id === txn.propertyId);
                return (
                  <tr key={txn.id}>
                    <td><div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{prop?.address}</div><div className="text-xs" style={{ color: "var(--text-muted)" }}>{prop?.city} · <span className={`badge ${getPropertyTypeBadgeClass(prop?.propertyType || "")}`} style={{ fontSize: "9px" }}>{prop?.propertyType}</span></div></td>
                    <td><div className="text-xs truncate max-w-[140px]">{txn.buyer}</div></td>
                    <td><div className="text-xs truncate max-w-[140px]">{txn.seller}</div></td>
                    <td><div className="number-display text-xs font-bold" style={{ color: "var(--violet)" }}>{txn.price ? formatCurrency(txn.price, true) : "—"}</div></td>
                    <td><div className="number-display text-xs">{txn.pricePerSF ? `$${txn.pricePerSF.toFixed(0)}` : "—"}</div></td>
                    <td><div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{formatRelativeDate(txn.recordedDate)}</div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {view === "detail" && (
          <div className="p-6 space-y-4">
            {MOCK_TRANSACTIONS.slice(0, 3).map((txn) => (
              <div key={txn.id} className="p-4 rounded-xl" style={{ background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.1)" }}>
                <div className="flex items-center gap-2 mb-2"><Zap size={12} style={{ color: "var(--violet)" }} /><span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--violet)" }}>AI Insight</span></div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{txn.aiInsight}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Building Permits */}
      <div className="glass-card overflow-hidden">
        <div className="px-6"><SectionHeader icon={<FileText size={15} />} label="Building Permits" count={MOCK_PERMITS.length} color="var(--cyan)" /></div>
        <div className="p-6 space-y-3">
          {MOCK_PERMITS.map((permit) => {
            const prop = MOCK_PROPERTIES.find((p) => p.id === permit.propertyId);
            return (
              <div key={permit.id} className="p-4 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div><div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{prop?.address}</div><div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{permit.applicant}</div></div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`badge ${permit.permitType === "new_construction" ? "badge-emerald" : permit.permitType === "demolition" ? "badge-rose" : "badge-cyan"}`}>{permit.permitType.replace("_", " ")}</span>
                    <span className="number-display text-xs font-bold" style={{ color: "var(--cyan)" }}>{permit.estimatedValue ? formatCurrency(permit.estimatedValue, true) : "—"}</span>
                  </div>
                </div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{permit.description}</p>
                {view === "detail" && permit.aiInsight && (
                  <div className="mt-3 p-3 rounded-lg" style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.1)" }}>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}><strong style={{ color: "var(--cyan)" }}>AI: </strong>{permit.aiInsight}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Entity Filings */}
      <div className="glass-card overflow-hidden">
        <div className="px-6"><SectionHeader icon={<Users size={15} />} label="Entity Filings" count={MOCK_ENTITY_FILINGS.length} color="var(--emerald)" /></div>
        <div className="p-6 space-y-3">
          {MOCK_ENTITY_FILINGS.map((ef) => (
            <div key={ef.id} className="p-4 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div><div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{ef.entityName}</div><div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{ef.principalAddress} · {ef.state}</div></div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`badge ${ef.filingType === "formation" ? "badge-emerald" : ef.filingType === "dissolution" ? "badge-rose" : "badge-cyan"}`}>{ef.filingType}</span>
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{formatRelativeDate(ef.filingDate)}</span>
                </div>
              </div>
              {view === "detail" && ef.aiInsight && (
                <div className="mt-3 p-3 rounded-lg" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)" }}>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}><strong style={{ color: "var(--emerald)" }}>AI: </strong>{ef.aiInsight}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
