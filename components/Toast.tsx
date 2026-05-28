"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Check, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

type Tone = "success" | "warn" | "error" | "info";
type Toast = { id: string; title: string; body?: string; tone: Tone };

type Ctx = { push: (t: Omit<Toast, "id">) => void };
const ToastCtx = createContext<Ctx>({ push: () => {} });

export function useToast() { return useContext(ToastCtx); }

const ICONS: Record<Tone, React.ReactNode> = {
  success: <Check size={15} />,
  warn: <AlertTriangle size={15} />,
  error: <AlertCircle size={15} />,
  info: <Info size={15} />,
};
const COLORS: Record<Tone, string> = {
  success: "var(--emerald)",
  warn: "var(--amber)",
  error: "var(--rose)",
  info: "var(--violet)",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((arr) => [...arr, { ...t, id }]);
    setTimeout(() => setToasts((arr) => arr.filter((x) => x.id !== id)), 4200);
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className="toast" data-tone={t.tone}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${COLORS[t.tone]}15`, color: COLORS[t.tone] }}>
              {ICONS[t.tone]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold leading-tight">{t.title}</div>
              {t.body && <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{t.body}</div>}
            </div>
            <button onClick={() => setToasts((arr) => arr.filter((x) => x.id !== t.id))} style={{ background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer", flexShrink: 0 }}>
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/**
 * Welcome toast — fires once per session to demo the system without being annoying.
 */
export function WelcomeToast() {
  const { push } = useToast();
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("dm_welcomed")) return;
    sessionStorage.setItem("dm_welcomed", "1");
    setTimeout(() => {
      push({ tone: "info", title: "Press ⌘K to jump anywhere", body: "Search properties, navigate, ask the AI co-pilot — all from one keyboard shortcut." });
    }, 800);
  }, [push]);
  return null;
}
