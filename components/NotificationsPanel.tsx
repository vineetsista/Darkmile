"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { X, Bell, Zap, FileText, Building2, Users, ArrowRight, Check, BellOff } from "lucide-react";

type Notif = {
  id: string;
  type: "opportunity" | "permit" | "transaction" | "entity" | "watchlist";
  title: string;
  body: string;
  ts: string;
  href: string;
  unread: boolean;
};

export const SEED_NOTIFICATIONS: Notif[] = [
  {
    id: "n1",
    type: "opportunity",
    title: "New 94-score opportunity in your territory",
    body: "3200 Morse Rd — estate disposition pattern, 37% below replacement cost.",
    ts: "2m ago",
    href: "/dashboard/opportunities",
    unread: true,
  },
  {
    id: "n2",
    type: "watchlist",
    title: "Watchlist trigger: 6100 Riverside Dr",
    body: "Owner entity filed an amendment — second time in 90 days.",
    ts: "18m ago",
    href: "/dashboard/watchlist",
    unread: true,
  },
  {
    id: "n3",
    type: "transaction",
    title: "$16.5M industrial transaction recorded",
    body: "2500 Corporate Exchange Dr — NorthPoint Development acquired from Polaris LLC.",
    ts: "1h ago",
    href: "/dashboard/deals",
    unread: true,
  },
  {
    id: "n4",
    type: "permit",
    title: "New construction permit: $8.5M warehouse",
    body: "1800 Rickenbacker Pkwy — first spec warehouse permit in 8 months.",
    ts: "3h ago",
    href: "/dashboard/deals",
    unread: false,
  },
  {
    id: "n5",
    type: "entity",
    title: "3 new LLC formations in submarket",
    body: "All filed with same registered agent — typical pre-acquisition pattern.",
    ts: "6h ago",
    href: "/dashboard/deals",
    unread: false,
  },
  {
    id: "n6",
    type: "opportunity",
    title: "Opportunity score updated: 750 Sawmill Rd",
    body: "Score moved from 72 → 81 after adjacent permit filing.",
    ts: "yesterday",
    href: "/dashboard/opportunities",
    unread: false,
  },
];

const ICONS: Record<Notif["type"], { icon: React.ReactNode; color: string }> = {
  opportunity: { icon: <Zap size={14} />,      color: "var(--amber)" },
  permit:      { icon: <FileText size={14} />, color: "var(--cyan)" },
  transaction: { icon: <Building2 size={14} />,color: "var(--violet)" },
  entity:      { icon: <Users size={14} />,    color: "var(--emerald)" },
  watchlist:   { icon: <Bell size={14} />,     color: "var(--violet)" },
};

export function useNotifications() {
  const [list, setList] = useState<Notif[]>(SEED_NOTIFICATIONS);
  const unreadCount = useMemo(() => list.filter((n) => n.unread).length, [list]);
  return {
    list,
    unreadCount,
    markRead: (id: string) => setList((l) => l.map((n) => (n.id === id ? { ...n, unread: false } : n))),
    markAllRead: () => setList((l) => l.map((n) => ({ ...n, unread: false }))),
    remove: (id: string) => setList((l) => l.filter((n) => n.id !== id)),
  };
}

export function NotificationsPanel({
  open,
  onClose,
  list,
  markRead,
  markAllRead,
  remove,
}: {
  open: boolean;
  onClose: () => void;
  list: Notif[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const unread = list.filter((n) => n.unread).length;

  return (
    <>
      <div className="panel-backdrop" onMouseDown={onClose} />
      <aside className="panel-side" role="dialog" aria-label="Notifications">
        <header className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>Notifications</h2>
              {unread > 0 && <span className="badge badge-violet">{unread} new</span>}
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>Live signals from your territory.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={markAllRead} title="Mark all read" className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer" }}><Check size={14} /></button>
            <button onClick={onClose} title="Close" className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer" }}><X size={14} /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {list.length === 0 ? (
            <div className="flex flex-col items-center text-center py-20 px-6">
              <BellOff size={28} style={{ color: "var(--text-muted)", marginBottom: 10 }} />
              <div className="font-semibold" style={{ color: "var(--text-secondary)" }}>You&apos;re all caught up</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>New signals will appear here as they hit your territory.</div>
            </div>
          ) : (
            list.map((n) => {
              const cfg = ICONS[n.type];
              return (
                <div key={n.id} className="notif-item" data-unread={n.unread} onClick={() => markRead(n.id)}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}30`, color: cfg.color }}>
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>{n.title}</div>
                        <span className="text-xs flex-shrink-0" style={{ color: "var(--text-tertiary)" }}>{n.ts}</span>
                      </div>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{n.body}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Link href={n.href} onClick={onClose} className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--violet)", textDecoration: "none" }}>
                          View <ArrowRight size={11} />
                        </Link>
                        <button onClick={(e) => { e.stopPropagation(); remove(n.id); }} className="text-xs" style={{ color: "var(--text-tertiary)", background: "none", border: "none", cursor: "pointer" }}>Dismiss</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <footer className="px-5 py-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Updated every 60s</span>
          <Link href="/dashboard/settings" onClick={onClose} className="text-xs font-semibold" style={{ color: "var(--violet)", textDecoration: "none" }}>Notification settings →</Link>
        </footer>
      </aside>
    </>
  );
}
