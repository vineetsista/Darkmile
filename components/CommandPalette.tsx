"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, LayoutDashboard, FileText, TrendingUp, Zap, Map, Bookmark, BarChart3, Settings,
  Building2, Bell, Sparkles, ArrowRight, MapPin, AlertCircle,
} from "lucide-react";
import { MOCK_PROPERTIES, MOCK_OPPORTUNITIES } from "@/lib/mock-data";

type CmdAction = {
  id: string;
  label: string;
  hint?: string;
  group: "Navigate" | "Properties" | "AI Actions" | "Opportunities";
  icon: React.ReactNode;
  onSelect: () => void;
};

export function CommandPalette({
  open,
  onClose,
  onOpenCopilot,
  onOpenNotifications,
}: {
  open: boolean;
  onClose: () => void;
  onOpenCopilot: (seed?: string) => void;
  onOpenNotifications: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const allActions: CmdAction[] = useMemo(() => {
    const nav: CmdAction[] = [
      { id: "n_dash",  label: "Dashboard",        hint: "Home overview",  group: "Navigate", icon: <LayoutDashboard size={15} />, onSelect: () => router.push("/dashboard") },
      { id: "n_brief", label: "Today's Briefing", hint: "AI summary",     group: "Navigate", icon: <FileText size={15} />,        onSelect: () => router.push("/dashboard/briefing") },
      { id: "n_deals", label: "Deal Flow",        hint: "All activity",   group: "Navigate", icon: <TrendingUp size={15} />,      onSelect: () => router.push("/dashboard/deals") },
      { id: "n_opp",   label: "Opportunities",    hint: "Scored leads",   group: "Navigate", icon: <Zap size={15} />,             onSelect: () => router.push("/dashboard/opportunities") },
      { id: "n_map",   label: "Territory Map",    hint: "Radar view",     group: "Navigate", icon: <Map size={15} />,             onSelect: () => router.push("/dashboard/map") },
      { id: "n_watch", label: "Watchlist",        hint: "Tracked props",  group: "Navigate", icon: <Bookmark size={15} />,        onSelect: () => router.push("/dashboard/watchlist") },
      { id: "n_anal",  label: "Analytics",        hint: "Market trends",  group: "Navigate", icon: <BarChart3 size={15} />,       onSelect: () => router.push("/dashboard/analytics") },
      { id: "n_set",   label: "Settings",         hint: "Profile & API",  group: "Navigate", icon: <Settings size={15} />,        onSelect: () => router.push("/dashboard/settings") },
    ];
    const ai: CmdAction[] = [
      { id: "ai_chat",  label: "Ask Darkmile AI…",            hint: "Open co-pilot",            group: "AI Actions", icon: <Sparkles size={15} />,    onSelect: () => onOpenCopilot() },
      { id: "ai_summ",  label: "Summarize today's market",    hint: "AI digest",                group: "AI Actions", icon: <Sparkles size={15} />,    onSelect: () => onOpenCopilot("Summarize today's market activity in Franklin County.") },
      { id: "ai_top",   label: "Best opportunity right now?", hint: "Score + reasoning",        group: "AI Actions", icon: <Sparkles size={15} />,    onSelect: () => onOpenCopilot("What's the single highest-scoring opportunity right now and why?") },
      { id: "ai_letter",label: "Draft outreach letter",       hint: "For top opportunity",      group: "AI Actions", icon: <Sparkles size={15} />,    onSelect: () => onOpenCopilot("Draft a cold outreach letter for the highest opportunity property.") },
      { id: "notif",    label: "Open notifications",          hint: "Alerts inbox",             group: "AI Actions", icon: <Bell size={15} />,        onSelect: () => onOpenNotifications() },
    ];
    const opps: CmdAction[] = MOCK_OPPORTUNITIES.slice(0, 6).map((o) => {
      const prop = MOCK_PROPERTIES.find((p) => p.id === o.propertyId);
      return {
        id: `opp_${o.id}`,
        label: prop?.address || "Opportunity",
        hint: `Score ${o.score} · ${prop?.propertyType || ""}`,
        group: "Opportunities" as const,
        icon: <AlertCircle size={15} />,
        onSelect: () => router.push("/dashboard/opportunities"),
      };
    });
    const props: CmdAction[] = MOCK_PROPERTIES.map((p) => ({
      id: `prop_${p.id}`,
      label: p.address,
      hint: `${p.city}, ${p.state} · ${p.propertyType}`,
      group: "Properties" as const,
      icon: <Building2 size={15} />,
      onSelect: () => router.push("/dashboard/deals"),
    }));
    return [...nav, ...ai, ...opps, ...props];
  }, [router, onOpenCopilot, onOpenNotifications]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allActions.slice(0, 20);
    return allActions.filter((a) => a.label.toLowerCase().includes(q) || (a.hint || "").toLowerCase().includes(q)).slice(0, 30);
  }, [query, allActions]);

  const grouped = useMemo(() => {
    const out: Record<string, CmdAction[]> = {};
    filtered.forEach((a) => { (out[a.group] = out[a.group] || []).push(a); });
    return out;
  }, [filtered]);

  useEffect(() => {
    if (!open) return;
    const flat = filtered;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, flat.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter")     { e.preventDefault(); flat[active]?.onSelect(); onClose(); }
      if (e.key === "Escape")    { e.preventDefault(); onClose(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, active, filtered, onClose]);

  if (!open) return null;

  let runningIdx = -1;
  return (
    <div className="cmdk-overlay" onMouseDown={onClose}>
      <div className="cmdk-panel" onMouseDown={(e) => e.stopPropagation()}>
        <div className="relative" style={{ borderBottom: "1px solid var(--border)" }}>
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="Search properties, navigate, ask Darkmile AI…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <span className="kbd">esc</span>
          </div>
        </div>
        <div style={{ maxHeight: "55vh", overflowY: "auto", padding: "6px 0" }}>
          {filtered.length === 0 ? (
            <div className="text-center py-12 px-6">
              <Sparkles size={20} style={{ color: "var(--text-tertiary)", margin: "0 auto 8px" }} />
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>No matches. Try a property address or &ldquo;briefing&rdquo;.</div>
            </div>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <div className="cmdk-group-label">{group}</div>
                {items.map((item) => {
                  runningIdx++;
                  const isActive = runningIdx === active;
                  return (
                    <div
                      key={item.id}
                      className="cmdk-item"
                      data-active={isActive}
                      onMouseEnter={() => setActive(runningIdx)}
                      onClick={() => { item.onSelect(); onClose(); }}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--elevated)", border: "1px solid var(--border)", color: isActive ? "var(--violet-bright)" : "var(--text-secondary)" }}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{item.label}</div>
                        {item.hint && <div className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>{item.hint}</div>}
                      </div>
                      {isActive && <ArrowRight size={13} style={{ color: "var(--violet)" }} />}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div className="flex items-center justify-between px-5 py-2.5" style={{ borderTop: "1px solid var(--border)", background: "var(--deep)" }}>
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
            <span className="inline-flex items-center gap-1.5"><span className="kbd">↑</span><span className="kbd">↓</span> navigate</span>
            <span className="inline-flex items-center gap-1.5"><span className="kbd">↵</span> open</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-tertiary)" }}>
            <MapPin size={11} /> Franklin County, OH
          </div>
        </div>
      </div>
    </div>
  );
}
