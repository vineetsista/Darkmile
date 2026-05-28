"use client";

import { useEffect, useRef, useState } from "react";

export type Signal = {
  id: string;
  tone: "violet" | "amber" | "cyan" | "emerald";
  label: string;
  text: string;
  ts: number;
};

const SEED: Omit<Signal, "id" | "ts">[] = [
  { tone: "violet",  label: "SALE",   text: "Industrial $16.5M · 2500 Corporate Exchange Dr" },
  { tone: "amber",   label: "OPP 94", text: "Estate disposition · 3200 Morse Rd" },
  { tone: "cyan",    label: "PERMIT", text: "$8.5M new construction · Rickenbacker Pkwy" },
  { tone: "emerald", label: "ENTITY", text: "3 LLCs filed · same registered agent" },
  { tone: "violet",  label: "SALE",   text: "Office $9.2M · 6100 Riverside Dr" },
  { tone: "amber",   label: "OPP 87", text: "Trust-owned asset · 900 Goodale Blvd" },
];

const POOL: Omit<Signal, "id" | "ts">[] = [
  { tone: "violet",  label: "SALE",   text: "Retail $3.4M · 750 Sawmill Rd · Dublin" },
  { tone: "amber",   label: "OPP 91", text: "Vacancy spike · 4200 Polaris Pkwy" },
  { tone: "cyan",    label: "PERMIT", text: "Renovation $1.2M · 200 W Nationwide Blvd" },
  { tone: "emerald", label: "ENTITY", text: "Formation: Rickenbacker Logistics LLC" },
  { tone: "violet",  label: "SALE",   text: "Industrial $11.8M · 5500 New Albany Rd" },
  { tone: "amber",   label: "OPP 78", text: "Comp spread anomaly · Easton submarket" },
  { tone: "cyan",    label: "PERMIT", text: "Change-of-use · former Kroger, Morse Rd" },
  { tone: "emerald", label: "ENTITY", text: "Dissolution · Polaris Holdings II LLC" },
  { tone: "violet",  label: "SALE",   text: "Multifamily $22M · 6100 Riverside Dr · Dublin" },
  { tone: "amber",   label: "OPP 83", text: "Cap-ex signal · 1800 Rickenbacker Pkwy" },
];

let counter = 0;
const fresh = (s: Omit<Signal, "id" | "ts">): Signal => ({ ...s, id: `sig_${Date.now()}_${counter++}`, ts: Date.now() });

const TONE_COLORS: Record<Signal["tone"], string> = {
  violet:  "139,92,246",
  amber:   "245,158,11",
  cyan:    "6,182,212",
  emerald: "16,185,129",
};

/**
 * Streaming signals hook. Adds a new mock signal every 8–14 seconds,
 * caps the buffer at 30, and exposes both list + latest-added flag for animation.
 * In production this would be a WebSocket to /api/signals/stream.
 */
export function useLiveSignals(initial: Signal[] = SEED.map(fresh)) {
  const [signals, setSignals] = useState<Signal[]>(initial);
  const [latestId, setLatestId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    function pushNext() {
      if (cancelled) return;
      const next = fresh(POOL[Math.floor(Math.random() * POOL.length)]);
      setSignals((prev) => [next, ...prev].slice(0, 30));
      setLatestId(next.id);
      const delay = 8000 + Math.random() * 6000;
      setTimeout(pushNext, delay);
    }
    const t = setTimeout(pushNext, 6000);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  return { signals, latestId };
}

export function SignalChip({ s, highlight }: { s: Signal; highlight?: boolean }) {
  const rgb = TONE_COLORS[s.tone];
  return (
    <div
      className="flex items-center gap-2.5 px-3 py-1 rounded-full whitespace-nowrap transition-all"
      style={{
        background: `rgba(${rgb},${highlight ? 0.18 : 0.06})`,
        border: `1px solid rgba(${rgb},${highlight ? 0.5 : 0.18})`,
        boxShadow: highlight ? `0 0 0 1px rgba(${rgb},0.4), 0 0 24px rgba(${rgb},0.4)` : "none",
      }}
    >
      <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "4px", fontWeight: 700, background: `rgba(${rgb},0.18)`, color: `var(--${s.tone})`, letterSpacing: "0.05em" }}>{s.label}</span>
      <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{s.text}</span>
      <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>· {relTime(s.ts)}</span>
    </div>
  );
}

function relTime(ts: number) {
  const d = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  return `${Math.floor(d / 3600)}h ago`;
}

/**
 * Live, rolling marquee. When a new signal arrives it pops in at the front with a glow.
 */
export function LiveSignalRail() {
  const { signals, latestId } = useLiveSignals();
  const display = signals.slice(0, 10);
  return (
    <div className="overflow-hidden py-2.5" style={{ maskImage: "linear-gradient(90deg, transparent, black 5%, black 95%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, black 5%, black 95%, transparent)" }}>
      <div className="flex items-center gap-2 px-4" style={{ animation: "rollLeft 50s linear infinite" }}>
        {[...display, ...display].map((s, i) => (
          <SignalChip key={`${s.id}-${i}`} s={s} highlight={i === 0 && s.id === latestId} />
        ))}
      </div>
      <style>{`@keyframes rollLeft { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
