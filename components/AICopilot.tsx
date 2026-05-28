"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send, MessageSquare, ArrowRight } from "lucide-react";
import { MOCK_OPPORTUNITIES, MOCK_PROPERTIES, MOCK_MARKET_STATS, MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

type Message = { role: "user" | "ai"; text: string; ts: number };

const STARTERS = [
  "Summarize today's market activity",
  "What's the highest-scoring opportunity?",
  "Draft outreach for 3200 Morse Rd",
  "Industrial vs Office: which is hotter?",
];

function generateAIResponse(question: string): string {
  const q = question.toLowerCase();
  const topOpp = MOCK_OPPORTUNITIES[0];
  const topProp = MOCK_PROPERTIES.find((p) => p.id === topOpp.propertyId);

  if (q.includes("summar") || q.includes("today") || q.includes("market")) {
    return `**Today's pulse — Franklin County**\n\n• ${MOCK_TRANSACTIONS.length} transactions recorded in the last 7 days (industrial leading, +12% w/w)\n• 7 active building permits — strongest week since Q1\n• **Top opportunity: ${topProp?.address}** at score ${topOpp.score}/100\n\nPattern I'm watching: three LLC formations filed through the same registered agent in the Rickenbacker submarket — classic pre-acquisition signal.`;
  }
  if (q.includes("highest") || q.includes("top") || q.includes("best") || q.includes("opportunity")) {
    return `**${topProp?.address}** — Score **${topOpp.score}/100**\n\n${topOpp.narrative.slice(0, 280)}…\n\nEstimated stabilized value: **${topOpp.estimatedValue ? formatCurrency(topOpp.estimatedValue, true) : "—"}**\n\nRecommended next step: ${topOpp.recommendedAction}`;
  }
  if (q.includes("draft") || q.includes("outreach") || q.includes("letter") || q.includes("email")) {
    return `Here's a draft for ${topProp?.address}:\n\n*"I've been monitoring the ${topProp?.propertyType?.toLowerCase()} market in ${topProp?.city} closely. Based on recent comparable transactions in the area, I have clients actively seeking ${topProp?.propertyType?.toLowerCase()} assets in your submarket. Would you be available for a 15-minute call this week?"*\n\nFull draft + 3 variations available on the Opportunities page.`;
  }
  if (q.includes("industrial") || q.includes("office") || q.includes("hotter") || q.includes("vs")) {
    return `**Industrial is leading the market this quarter:**\n\n• Volume: $${(MOCK_MARKET_STATS.weeklyTrend.reduce((a, b) => a + b.volume, 0)).toFixed(0)}M cumulative (5w)\n• Average price/SF up 8% YoY\n• Office is recovering but inventory is tight — only 2 closings this month above 50K SF\n\nVerdict: Industrial offers more deal flow; Office offers tighter spreads on stabilized assets.`;
  }
  if (q.includes("score") || q.includes("how") && q.includes("work")) {
    return `**How scoring works:** Each property is scored 0–100 across 6 signals:\n\n• **Ownership pattern** (trust/estate/LLC anomalies)\n• **Permit velocity** (filings within 1 mile)\n• **Comparable sale spread** (price/SF vs submarket)\n• **Entity activity** (formation, dissolution, agent changes)\n• **Vacancy proxy** (USPS + utility signals)\n• **Time-since-last-sale** (asset velocity)\n\nScores ≥ 85 are flagged "Exceptional".`;
  }
  return `Interesting question. I'm a mock co-pilot in this demo, but in production I'd pull live county records, permit data, and entity filings to answer this. Try one of the starters → or ask about a specific address.`;
}

export function AICopilot({
  open,
  onClose,
  seedQuestion,
}: {
  open: boolean;
  onClose: () => void;
  seedQuestion?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "ai", text: "Hey, I'm **Darkmile AI** — your deal-intel co-pilot. Ask me anything about properties, opportunities, or market activity in your territory.", ts: Date.now() }]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    if (open && seedQuestion) {
      handleSend(seedQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedQuestion]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function handleSend(text?: string) {
    const q = (text ?? input).trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q, ts: Date.now() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: generateAIResponse(q), ts: Date.now() }]);
      setTyping(false);
    }, 700 + Math.random() * 400);
  }

  if (!open) return null;

  return (
    <div className="copilot-panel" role="dialog" aria-label="Darkmile AI co-pilot">
      <header className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--violet), var(--cyan))", color: "white" }}>
            <Sparkles size={15} />
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Darkmile AI</div>
            <div className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-tertiary)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--emerald)", boxShadow: "0 0 6px var(--emerald)" }} />
              Connected to Franklin County
            </div>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer" }}><X size={14} /></button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "copilot-bubble-user" : "copilot-bubble-ai"}>
            <Bubble text={m.text} />
          </div>
        ))}
        {typing && (
          <div className="copilot-bubble-ai">
            <div className="copilot-typing"><span /><span /><span /></div>
          </div>
        )}
      </div>

      {messages.length <= 1 && !typing && (
        <div className="px-4 pb-2 grid grid-cols-2 gap-2">
          {STARTERS.map((s) => (
            <button key={s} onClick={() => handleSend(s)} className="text-left p-2.5 rounded-lg text-xs transition-colors"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer" }}>
              <span className="inline-flex items-center gap-1.5"><MessageSquare size={11} style={{ color: "var(--violet)" }} /> {s}</span>
            </button>
          ))}
        </div>
      )}

      <form
        className="p-3 flex items-center gap-2"
        style={{ borderTop: "1px solid var(--border)" }}
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your market…"
          className="dm-input"
          style={{ padding: "10px 12px" }}
          autoFocus
        />
        <button type="submit" className="btn-primary" style={{ padding: "10px 14px", flexShrink: 0 }} disabled={!input.trim()}>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}

function Bubble({ text }: { text: string }) {
  // Light markdown: **bold**, line breaks
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
        return (
          <p key={i} style={{ margin: i ? "4px 0 0" : 0 }}>
            {parts.map((p, j) => {
              if (p.startsWith("**") && p.endsWith("**")) return <strong key={j}>{p.slice(2, -2)}</strong>;
              if (p.startsWith("*") && p.endsWith("*")) return <em key={j}>{p.slice(1, -1)}</em>;
              return <span key={j}>{p}</span>;
            })}
          </p>
        );
      })}
    </>
  );
}

export function CopilotFAB({ onClick, active }: { onClick: () => void; active: boolean }) {
  return (
    <button
      className="copilot-fab"
      onClick={onClick}
      aria-label="Open Darkmile AI co-pilot"
      title="Ask Darkmile AI"
      style={{ opacity: active ? 0 : 1, pointerEvents: active ? "none" : "auto", transition: "opacity 0.2s ease" }}
    >
      <Sparkles size={22} />
    </button>
  );
}
