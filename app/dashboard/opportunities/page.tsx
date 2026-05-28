"use client";

import { useState } from "react";
import { ArrowRight, X, Copy, Check, Zap } from "lucide-react";
import { MOCK_OPPORTUNITIES, MOCK_PROPERTIES } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

function ScoreGauge({ score, size = 80 }: { score: number; size?: number }) {
  const r = size * 0.38;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 85 ? "var(--emerald)" : score >= 70 ? "var(--amber)" : "var(--cyan)";
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="3" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
        <text x={cx} y={cy} textAnchor="middle" dy="0.35em" fontSize={size * 0.22} fontWeight="700" fill={color} fontFamily="JetBrains Mono, monospace">{score}</text>
      </svg>
      <div className="text-center">
        <div className="text-xs font-bold" style={{ color, letterSpacing: "0.05em" }}>
          {score >= 85 ? "EXCEPTIONAL" : score >= 70 ? "STRONG" : score >= 50 ? "MODERATE" : "LOW"}
        </div>
      </div>
    </div>
  );
}

function OutreachModal({ prop, opp, onClose }: { prop: typeof MOCK_PROPERTIES[0] | undefined; opp: typeof MOCK_OPPORTUNITIES[0]; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const draft = `Dear Property Owner,

My name is Marcus Webb, a commercial real estate broker with Webb Commercial Realty specializing in ${prop?.propertyType?.toLowerCase()} properties in the Columbus metro market.

I'm reaching out regarding your property at ${prop?.address}, ${prop?.city}, OH ${prop?.zip}.

I've been monitoring the ${prop?.propertyType?.toLowerCase()} market in ${prop?.city} closely, and I believe your property represents a compelling opportunity in the current market environment. Based on recent comparable transactions in the area, I have clients actively seeking ${prop?.propertyType?.toLowerCase()} assets in your submarket.

I'd welcome the opportunity to share my market analysis and discuss your plans for the property. This would be a completely confidential conversation — no obligation whatsoever.

Would you be available for a 15-minute call this week?

Best regards,
Marcus Webb
Webb Commercial Realty
(614) 555-0182
marcus@webbcommercial.com`;

  const copy = () => { navigator.clipboard.writeText(draft); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border-bright)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>AI-Generated Outreach Draft</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{prop?.address}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--elevated)", border: "1px solid var(--border)", cursor: "pointer", color: "var(--text-tertiary)" }}><X size={14} /></button>
        </div>
        <div className="p-6">
          <div className="mb-4 p-3 rounded-xl text-xs" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", color: "var(--violet-bright)" }}>
            <strong>Opportunity Score {opp.score}/100 · </strong>{opp.recommendedAction}
          </div>
          <textarea className="w-full text-xs leading-relaxed resize-none rounded-xl p-4" rows={16} value={draft} readOnly
            style={{ background: "var(--elevated)", border: "1px solid var(--border)", color: "var(--text-secondary)", fontFamily: "var(--font-sans)", outline: "none" }} />
        </div>
        <div className="flex items-center justify-between px-6 pb-5">
          <button onClick={onClose} className="btn-ghost" style={{ padding: "10px 20px", fontSize: "13px" }}>Cancel</button>
          <button onClick={copy} className={`btn-primary`} style={{ padding: "10px 20px", fontSize: "13px" }}>
            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Draft</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OpportunitiesPage() {
  const [sortBy, setSortBy] = useState<"score" | "value">("score");
  const [filterScore, setFilterScore] = useState(0);
  const [outreachModal, setOutreachModal] = useState<typeof MOCK_OPPORTUNITIES[0] | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [watchlisted, setWatchlisted] = useState<string[]>([]);

  const sorted = [...MOCK_OPPORTUNITIES]
    .filter((o) => o.score >= filterScore && !dismissed.includes(o.id))
    .sort((a, b) => sortBy === "score" ? b.score - a.score : (b.estimatedValue || 0) - (a.estimatedValue || 0));

  const outreachProp = outreachModal ? MOCK_PROPERTIES.find((p) => p.id === outreachModal.propertyId) : undefined;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {outreachModal && outreachProp && (
        <OutreachModal prop={outreachProp} opp={outreachModal} onClose={() => setOutreachModal(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>Opportunity Alerts</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>AI-scored deals ranked by signal strength. Updated daily at 7:00am.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="dm-input text-sm" style={{ width: "auto" }} value={filterScore} onChange={(e) => setFilterScore(Number(e.target.value))}>
            <option value={0}>All scores</option>
            <option value={70}>70+ Strong</option>
            <option value={85}>85+ Exceptional</option>
          </select>
          <select className="dm-input text-sm" style={{ width: "auto" }} value={sortBy} onChange={(e) => setSortBy(e.target.value as "score" | "value")}>
            <option value="score">Sort by Score</option>
            <option value="value">Sort by Value</option>
          </select>
        </div>
      </div>

      {/* Score legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {[{ label: "Exceptional", range: "85–100", color: "var(--emerald)" }, { label: "Strong", range: "70–84", color: "var(--amber)" }, { label: "Moderate", range: "50–69", color: "var(--cyan)" }].map((l) => (
          <div key={l.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: l.color }} />
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}><strong style={{ color: l.color }}>{l.label}</strong> {l.range}</span>
          </div>
        ))}
      </div>

      {/* Opportunity cards */}
      <div className="space-y-4">
        {sorted.map((opp) => {
          const prop = MOCK_PROPERTIES.find((p) => p.id === opp.propertyId);
          const watched = watchlisted.includes(opp.id);
          return (
            <div key={opp.id} className="opportunity-card p-6">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 hidden md:block">
                  <ScoreGauge score={opp.score} size={88} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>{prop?.address}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{prop?.city}, {prop?.state} {prop?.zip}</span>
                        <span className="badge badge-amber">{prop?.propertyType}</span>
                        {prop?.squareFeet && <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{prop.squareFeet.toLocaleString()} SF</span>}
                      </div>
                    </div>
                    <div className="md:hidden flex-shrink-0"><ScoreGauge score={opp.score} size={60} /></div>
                  </div>

                  <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>{opp.narrative}</p>

                  {/* Factors */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    {(opp.factors as { label: string; weight: number; description: string }[]).map((f) => (
                      <div key={f.label} className="p-3 rounded-xl" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.12)" }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold" style={{ color: "var(--amber)" }}>{f.label}</span>
                          <span className="number-display text-xs font-bold" style={{ color: "var(--amber)" }}>+{f.weight}</span>
                        </div>
                        <div className="text-xs leading-tight" style={{ color: "var(--text-muted)" }}>{f.description}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recommended action */}
                  {opp.recommendedAction && (
                    <div className="mb-4 p-3 rounded-xl flex items-start gap-2" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.12)" }}>
                      <Zap size={13} style={{ color: "var(--violet)", flexShrink: 0, marginTop: 1 }} />
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}><strong style={{ color: "var(--violet)" }}>Recommended: </strong>{opp.recommendedAction}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Est. Stabilized Value</div>
                      <div className="number-display font-bold text-xl" style={{ color: "var(--amber)" }}>{opp.estimatedValue ? formatCurrency(opp.estimatedValue, true) : "—"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setDismissed([...dismissed, opp.id])} className="btn-ghost" style={{ padding: "8px 14px", fontSize: "12px" }}><X size={13} /> Dismiss</button>
                      <button onClick={() => setWatchlisted(watched ? watchlisted.filter((w) => w !== opp.id) : [...watchlisted, opp.id])}
                        className={watched ? "btn-secondary" : "btn-ghost"} style={{ padding: "8px 14px", fontSize: "12px" }}>
                        {watched ? <><Check size={13} /> Watching</> : "Watch"}
                      </button>
                      <button onClick={() => setOutreachModal(opp)} className="btn-primary" style={{ padding: "8px 14px", fontSize: "12px" }}>
                        Outreach Draft <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {dismissed.length > 0 && (
        <button onClick={() => setDismissed([])} className="text-xs" style={{ color: "var(--text-tertiary)" }}>Show {dismissed.length} dismissed opportunity{dismissed.length > 1 ? "ies" : "y"}</button>
      )}
    </div>
  );
}
