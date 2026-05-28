"use client";

import { useState } from "react";
import { User, MapPin, Bell, CreditCard, Code, Shield, Check, ChevronRight } from "lucide-react";
import { MOCK_USER } from "@/lib/mock-data";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "territory", label: "Territory", icon: MapPin },
  { id: "briefing", label: "Briefing", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "api", label: "API Access", icon: Code },
];

const PROPERTY_TYPES = ["Office", "Industrial", "Retail", "Multifamily", "Land", "Mixed-Use", "Hospitality", "Healthcare", "Self-Storage", "Data Center"];

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{label}</div>
        {desc && <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{desc}</div>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="relative inline-flex items-center w-10 h-5 rounded-full transition-colors cursor-pointer" style={{ background: on ? "var(--violet)" : "var(--elevated)", border: "none" }}>
      <div className="absolute w-4 h-4 rounded-full bg-white shadow transition-transform" style={{ transform: on ? "translateX(22px)" : "translateX(2px)" }} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile
  const [name, setName] = useState(MOCK_USER.name);
  const [firm, setFirm] = useState(MOCK_USER.firm);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [saved, setSaved] = useState(false);

  // Territory
  const [selectedTypes, setSelectedTypes] = useState<string[]>(MOCK_USER.propertyTypes);

  // Briefing
  const [briefingTime, setBriefingTime] = useState(MOCK_USER.briefingTime);
  const [briefingFormat, setBriefingFormat] = useState("detailed");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [highScoreAlerts, setHighScoreAlerts] = useState(true);
  const [watchlistAlerts, setWatchlistAlerts] = useState(true);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const toggleType = (t: string) => {
    setSelectedTypes(selectedTypes.includes(t) ? selectedTypes.filter((s) => s !== t) : [...selectedTypes, t]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>Settings</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Manage your account, territory, and briefing preferences.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-0.5">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all"
                style={{ background: activeTab === id ? "rgba(139,92,246,0.1)" : "transparent", color: activeTab === id ? "var(--violet-bright)" : "var(--text-secondary)", border: "none", cursor: "pointer", borderLeft: activeTab === id ? "3px solid var(--violet)" : "3px solid transparent" }}>
                <Icon size={15} style={{ flexShrink: 0 }} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 glass-card overflow-hidden">
          <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
            <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>{TABS.find((t) => t.id === activeTab)?.label}</h2>
          </div>
          <div className="px-6 pb-6">
            {activeTab === "profile" && (
              <div>
                <SettingRow label="Full name" desc="Your display name in briefings and reports">
                  <input className="dm-input text-sm" style={{ width: "220px" }} value={name} onChange={(e) => setName(e.target.value)} />
                </SettingRow>
                <SettingRow label="Firm name" desc="Your brokerage or company">
                  <input className="dm-input text-sm" style={{ width: "220px" }} value={firm} onChange={(e) => setFirm(e.target.value)} />
                </SettingRow>
                <SettingRow label="Email address" desc="Used for daily briefings and alerts">
                  <input className="dm-input text-sm" style={{ width: "220px" }} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </SettingRow>
                <SettingRow label="Role" desc="Your primary role in CRE">
                  <select className="dm-input text-sm" style={{ width: "180px" }}>
                    {["Broker", "Agent", "Principal", "Analyst", "Developer", "Other"].map((r) => <option key={r}>{r}</option>)}
                  </select>
                </SettingRow>
                <SettingRow label="Password" desc="Last changed: never">
                  <button className="btn-ghost" style={{ padding: "8px 16px", fontSize: "13px" }}>Change Password</button>
                </SettingRow>
                <div className="pt-5 flex items-center gap-3">
                  <button onClick={save} className="btn-primary" style={{ padding: "10px 24px", fontSize: "14px" }}>
                    {saved ? <><Check size={14} /> Saved</> : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "territory" && (
              <div>
                <SettingRow label="State" desc="Your primary market state">
                  <select className="dm-input text-sm" style={{ width: "180px" }} defaultValue="OH">
                    <option>Ohio</option>
                    <option>Indiana</option>
                    <option>Kentucky</option>
                  </select>
                </SettingRow>
                <SettingRow label="Counties" desc="Up to 3 counties on standard plan">
                  <div className="text-sm" style={{ color: "var(--violet)" }}>Franklin County ×<br /><a href="#" className="text-xs" style={{ color: "var(--violet)", textDecoration: "none" }}>+ Add county</a></div>
                </SettingRow>
                <SettingRow label="Property types" desc="Filter your briefing to these property types">
                  <div className="grid grid-cols-2 gap-1.5" style={{ width: "260px" }}>
                    {PROPERTY_TYPES.map((t) => {
                      const sel = selectedTypes.includes(t);
                      return (
                        <button key={t} onClick={() => toggleType(t)} className="px-2 py-1.5 rounded-lg text-xs font-medium text-center transition-all"
                          style={{ background: sel ? "rgba(139,92,246,0.12)" : "var(--surface)", border: `1px solid ${sel ? "rgba(139,92,246,0.3)" : "var(--border)"}`, color: sel ? "var(--violet-bright)" : "var(--text-secondary)", cursor: "pointer" }}>
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </SettingRow>
              </div>
            )}

            {activeTab === "briefing" && (
              <div>
                <SettingRow label="Email briefings" desc="Receive your daily intelligence report via email">
                  <Toggle on={emailEnabled} onChange={() => setEmailEnabled(!emailEnabled)} />
                </SettingRow>
                <SettingRow label="Delivery time" desc="When your briefing is delivered (ET)">
                  <select className="dm-input text-sm" style={{ width: "160px" }} value={briefingTime} onChange={(e) => setBriefingTime(e.target.value)}>
                    {["05:00", "06:00", "07:00", "08:00", "09:00"].map((t) => <option key={t} value={t}>{t} AM ET</option>)}
                  </select>
                </SettingRow>
                <SettingRow label="Email format" desc="Detailed includes AI insights; Summary is highlights only">
                  <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                    {["detailed", "summary"].map((f) => (
                      <button key={f} onClick={() => setBriefingFormat(f)} className="px-4 py-2 text-xs font-semibold capitalize"
                        style={{ background: briefingFormat === f ? "var(--elevated)" : "var(--surface)", color: briefingFormat === f ? "var(--text-primary)" : "var(--text-tertiary)", cursor: "pointer", border: "none" }}>{f}</button>
                    ))}
                  </div>
                </SettingRow>
                <SettingRow label="High-score alerts" desc="Instant email when opportunity score ≥ 85">
                  <Toggle on={highScoreAlerts} onChange={() => setHighScoreAlerts(!highScoreAlerts)} />
                </SettingRow>
                <SettingRow label="Watchlist alerts" desc="Notify me when watched properties have activity">
                  <Toggle on={watchlistAlerts} onChange={() => setWatchlistAlerts(!watchlistAlerts)} />
                </SettingRow>
              </div>
            )}

            {activeTab === "billing" && (
              <div>
                <div className="py-5" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div className="p-4 rounded-2xl mb-4" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.04))", border: "1px solid rgba(139,92,246,0.2)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="badge badge-violet">INDEPENDENT BROKER</span>
                      <span className="badge badge-emerald">ACTIVE</span>
                    </div>
                    <div className="number-display font-bold text-3xl mb-1" style={{ color: "var(--text-primary)" }}>$299<span className="text-base font-normal" style={{ color: "var(--text-tertiary)" }}>/month</span></div>
                    <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Next billing date: June 14, 2025 · Trial ends May 28, 2025</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="btn-primary" style={{ padding: "10px 20px", fontSize: "13px" }}>Add Payment Method</button>
                    <button className="btn-ghost" style={{ padding: "10px 20px", fontSize: "13px" }}>Cancel Subscription</button>
                  </div>
                </div>
                <SettingRow label="Payment method" desc="No card on file — trial period">
                  <button className="btn-ghost" style={{ padding: "8px 16px", fontSize: "12px" }}>Add Card</button>
                </SettingRow>
                <SettingRow label="Invoices" desc="Download your billing history">
                  <button className="btn-ghost" style={{ padding: "8px 16px", fontSize: "12px" }}>View Invoices</button>
                </SettingRow>
                <SettingRow label="Upgrade to Enterprise" desc="5+ brokers? Get team pricing and CRM integration">
                  <a href="mailto:enterprise@darkmile.io" className="btn-secondary" style={{ padding: "8px 16px", fontSize: "12px", textDecoration: "none" }}>Contact Sales <ChevronRight size={12} /></a>
                </SettingRow>
              </div>
            )}

            {activeTab === "api" && (
              <div>
                <div className="py-5" style={{ borderBottom: "1px solid var(--border)" }}>
                  <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                    Use the Darkmile API to integrate deal intelligence into your CRM, custom dashboard, or workflow automation.
                  </p>
                  <div className="p-4 rounded-xl" style={{ background: "var(--void)", border: "1px solid var(--border)" }}>
                    <div className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Your API Key</div>
                    <div className="font-mono text-sm" style={{ color: "var(--violet-bright)" }}>dm_live_••••••••••••••••••••••••••••••••</div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button className="btn-primary" style={{ padding: "10px 20px", fontSize: "13px" }}>Reveal Key</button>
                    <button className="btn-ghost" style={{ padding: "10px 20px", fontSize: "13px" }}>Regenerate</button>
                  </div>
                </div>
                <SettingRow label="API Documentation" desc="Full reference for REST API endpoints">
                  <a href="#" className="btn-ghost" style={{ padding: "8px 16px", fontSize: "12px", textDecoration: "none" }}>View Docs <ChevronRight size={12} /></a>
                </SettingRow>
                <SettingRow label="Webhooks" desc="Receive real-time events to your endpoint">
                  <button className="btn-ghost" style={{ padding: "8px 16px", fontSize: "12px" }}>Configure</button>
                </SettingRow>
                <div className="mt-5 p-4 rounded-xl text-xs" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)", color: "var(--text-secondary)" }}>
                  <strong style={{ color: "var(--violet)" }}>CRM Integration coming soon. </strong>
                  Native integrations with Salesforce, HubSpot, and Follow Up Boss are in development. <a href="#" style={{ color: "var(--violet)", textDecoration: "none" }}>Join waitlist →</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
