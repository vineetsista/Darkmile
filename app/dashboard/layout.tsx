"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, TrendingUp, Zap, Map, Bookmark,
  BarChart3, Settings, ChevronLeft, ChevronRight, Bell, Search,
  LogOut, ChevronsUpDown, Sparkles,
} from "lucide-react";
import { MOCK_USER } from "@/lib/mock-data";
import { initials } from "@/lib/utils";
import { CommandPalette } from "@/components/CommandPalette";
import { NotificationsPanel, useNotifications } from "@/components/NotificationsPanel";
import { AICopilot, CopilotFAB } from "@/components/AICopilot";
import { ToastProvider, WelcomeToast } from "@/components/Toast";

const NAV_ITEMS = [
  { href: "/dashboard",                 label: "Dashboard",        icon: LayoutDashboard },
  { href: "/dashboard/briefing",        label: "Today's Briefing", icon: FileText },
  { href: "/dashboard/deals",           label: "Deal Flow",        icon: TrendingUp },
  { href: "/dashboard/opportunities",   label: "Opportunities",    icon: Zap },
  { href: "/dashboard/map",             label: "Territory Map",    icon: Map },
  { href: "/dashboard/watchlist",       label: "Watchlist",        icon: Bookmark },
  { href: "/dashboard/analytics",       label: "Analytics",        icon: BarChart3 },
  { href: "/dashboard/settings",        label: "Settings",         icon: Settings },
];

function Sidebar({ collapsed, onToggle, openCmd }: { collapsed: boolean; onToggle: () => void; openCmd: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className="flex-shrink-0 flex flex-col transition-all duration-300 relative"
      style={{
        width: collapsed ? 68 : 244,
        background: "linear-gradient(180deg, #0B0613 0%, #08050E 100%)",
        borderRight: "1px solid var(--border)",
        height: "100vh",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 px-4" style={{ height: 64, borderBottom: "1px solid var(--border)", textDecoration: "none" }}>
        <div style={{ width: 32, height: 32, position: "relative", flexShrink: 0 }}>
          <div className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", boxShadow: "0 0 18px rgba(139,92,246,0.45)" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full border-2 border-white opacity-90" style={{ width: "38%", height: "38%" }} />
          </div>
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-base tracking-tight" style={{ color: "var(--text-primary)" }}>darkmile</span>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>signal intelligence</span>
          </div>
        )}
      </Link>

      {/* Quick action: Cmd+K */}
      {!collapsed && (
        <button
          onClick={openCmd}
          className="mx-3 mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-tertiary)", cursor: "pointer" }}
        >
          <Search size={13} />
          <span className="flex-1 text-left">Search anything…</span>
          <span className="kbd">⌘K</span>
        </button>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${active ? "active" : ""}`}
              style={{
                color: active ? "var(--violet-bright)" : "var(--text-secondary)",
                background: active ? "rgba(139,92,246,0.1)" : "transparent",
                textDecoration: "none",
                borderLeft: active ? "3px solid var(--violet)" : "3px solid transparent",
              }}
              title={collapsed ? label : undefined}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Trial badge */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl text-xs" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.08))", border: "1px solid rgba(139,92,246,0.3)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={11} style={{ color: "var(--violet-bright)" }} />
            <span className="font-bold" style={{ color: "var(--violet-bright)" }}>Trial · 11 days left</span>
          </div>
          <p className="leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>You&apos;re on the free trial. Upgrade to keep your daily 7:00am briefing.</p>
          <Link href="/dashboard/settings" className="text-xs font-semibold" style={{ color: "var(--violet-bright)", textDecoration: "none" }}>Upgrade →</Link>
        </div>
      )}

      {/* User section */}
      <div className="px-2 pb-3 pt-1" style={{ borderTop: "1px solid var(--border)" }}>
        {!collapsed ? (
          <div className="flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-colors mt-2"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
              style={{ background: "linear-gradient(135deg, var(--violet), var(--cyan))", color: "white" }}>
              {initials(MOCK_USER.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{MOCK_USER.name}</div>
              <div className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>{MOCK_USER.firm}</div>
            </div>
            <ChevronsUpDown size={13} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
          </div>
        ) : (
          <div className="flex items-center justify-center mt-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "linear-gradient(135deg, var(--violet), var(--cyan))", color: "white" }}>
              {initials(MOCK_USER.name)}
            </div>
          </div>
        )}
      </div>

      {/* Collapse button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors"
        style={{ background: "var(--elevated)", border: "1px solid var(--border-bright)", color: "var(--text-tertiary)", cursor: "pointer" }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}

function TopBar({
  title,
  unreadCount,
  openCmd,
  openNotif,
  openCopilot,
}: {
  title: string;
  unreadCount: number;
  openCmd: () => void;
  openNotif: () => void;
  openCopilot: () => void;
}) {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const fmt = () => setNow(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
    fmt(); const t = setInterval(fmt, 30_000); return () => clearInterval(t);
  }, []);

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between px-6 h-14"
      style={{ background: "rgba(6,4,10,0.78)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}>
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{title}</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--emerald)", boxShadow: "0 0 6px var(--emerald)", animation: "pulse 2s ease-in-out infinite" }} />
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Live · Franklin County, OH · {now}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={openCmd}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-tertiary)", cursor: "pointer", minWidth: 220 }}
        >
          <Search size={13} />
          <span className="flex-1 text-left">Search properties, briefings, AI…</span>
          <span className="inline-flex items-center gap-0.5">
            <span className="kbd">⌘</span><span className="kbd">K</span>
          </span>
        </button>

        <button
          onClick={openCopilot}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.08))",
            border: "1px solid rgba(139,92,246,0.35)",
            color: "var(--violet-bright)",
            cursor: "pointer",
          }}
          title="Ask Darkmile AI"
        >
          <Sparkles size={13} />
          <span>AI</span>
        </button>

        <button onClick={openNotif} className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors" style={{ background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer" }} title="Notifications">
          <Bell size={15} style={{ color: "var(--text-secondary)" }} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "linear-gradient(135deg, var(--amber), #DC2626)", color: "white", border: "2px solid var(--void)" }}>
              {unreadCount}
            </span>
          )}
        </button>
        <Link href="/" className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }} title="Sign out">
          <LogOut size={14} style={{ color: "var(--text-secondary)" }} />
        </Link>
      </div>
    </div>
  );
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/briefing": "Today's Briefing",
  "/dashboard/deals": "Deal Flow",
  "/dashboard/opportunities": "Opportunities",
  "/dashboard/map": "Territory Map",
  "/dashboard/watchlist": "Watchlist",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings": "Settings",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotSeed, setCopilotSeed] = useState<string | undefined>(undefined);
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] || "Dashboard";
  const notifs = useNotifications();

  // Auto-collapse sidebar on narrow viewports
  useEffect(() => {
    function checkSize() {
      if (typeof window !== "undefined" && window.innerWidth < 768) setCollapsed(true);
    }
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdOpen((v) => !v); }
      if (meta && e.key.toLowerCase() === "j") { e.preventDefault(); setCopilotOpen((v) => !v); }
      if (meta && e.key.toLowerCase() === "i") { e.preventDefault(); setNotifOpen((v) => !v); }
      if (e.key === "Escape") {
        if (cmdOpen) setCmdOpen(false);
        if (notifOpen) setNotifOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cmdOpen, notifOpen]);

  return (
    <ToastProvider>
      <WelcomeToast />
      <div className="flex min-h-screen relative" style={{ background: "var(--void)" }}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} openCmd={() => setCmdOpen(true)} />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar
            title={title}
            unreadCount={notifs.unreadCount}
            openCmd={() => setCmdOpen(true)}
            openNotif={() => setNotifOpen(true)}
            openCopilot={() => { setCopilotSeed(undefined); setCopilotOpen(true); }}
          />
          <main className="flex-1 overflow-auto p-6 relative" style={{ background: "var(--void)" }}>
            <div className="absolute inset-0 grid-bg-fade pointer-events-none opacity-50" />
            <div className="relative">{children}</div>
          </main>
        </div>

        <CommandPalette
          open={cmdOpen}
          onClose={() => setCmdOpen(false)}
          onOpenCopilot={(seed) => { setCopilotSeed(seed); setCopilotOpen(true); }}
          onOpenNotifications={() => setNotifOpen(true)}
        />
        <NotificationsPanel
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
          list={notifs.list}
          markRead={notifs.markRead}
          markAllRead={notifs.markAllRead}
          remove={notifs.remove}
        />
        <AICopilot open={copilotOpen} onClose={() => setCopilotOpen(false)} seedQuestion={copilotSeed} />
        <CopilotFAB onClick={() => { setCopilotSeed(undefined); setCopilotOpen(true); }} active={copilotOpen} />
      </div>
    </ToastProvider>
  );
}
