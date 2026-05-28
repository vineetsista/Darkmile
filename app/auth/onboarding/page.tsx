"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, CheckCircle, MapPin, Building2, DollarSign, Clock, Zap } from "lucide-react";

const COUNTIES = ["Franklin", "Delaware", "Licking", "Fairfield", "Pickaway", "Union", "Madison", "Perry"];
const PROPERTY_TYPES = ["Office", "Industrial", "Retail", "Multifamily", "Land", "Mixed-Use", "Hospitality", "Healthcare", "Self-Storage", "Data Center"];
const DEAL_SIZES = ["Under $1M", "$1M–$5M", "$5M–$25M", "$25M–$100M", "$100M+"];
const ROLES = ["Broker", "Agent", "Principal", "Analyst", "Developer", "Other"];

function DarkmileLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div style={{ width: 32, height: 32, position: "relative" }}>
        <div className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full border-2 border-white opacity-90" style={{ width: "38%", height: "38%" }} />
        </div>
      </div>
      <span className="text-lg font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>darkmile</span>
    </div>
  );
}

function StepDot({ step, current, completed }: { step: number; current: number; completed: boolean }) {
  const active = step === current;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
        style={{
          background: completed ? "var(--violet)" : active ? "rgba(139,92,246,0.2)" : "var(--surface)",
          border: `2px solid ${completed || active ? "var(--violet)" : "var(--border)"}`,
          color: completed || active ? "var(--violet-bright)" : "var(--text-tertiary)",
        }}>
        {completed ? <CheckCircle size={14} /> : step}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const [role, setRole] = useState("Broker");
  const [yearsExp, setYearsExp] = useState("5–10");
  const [phone, setPhone] = useState("");

  const [selectedState, setSelectedState] = useState("OH");
  const [selectedCounties, setSelectedCounties] = useState<string[]>(["Franklin"]);

  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Industrial", "Office"]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["$5M–$25M"]);

  const [briefingTime, setBriefingTime] = useState("07:00");
  const [briefingFormat, setBriefingFormat] = useState("detailed");
  const [includes, setIncludes] = useState(["deed_transfers", "permits", "entities", "opportunities", "market_stats"]);

  const toggleItem = (arr: string[], setArr: (v: string[]) => void, item: string) => {
    setArr(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const next = () => step < totalSteps ? setStep(step + 1) : router.push("/dashboard");
  const prev = () => step > 1 ? setStep(step - 1) : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--void)" }}>
      {/* Top bar */}
      <div className="border-b px-8 py-4 flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
        <DarkmileLogo />
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <StepDot key={i + 1} step={i + 1} current={step} completed={i + 1 < step} />
          ))}
        </div>
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Step {step} of {totalSteps}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1" style={{ background: "var(--surface)" }}>
        <div className="h-full transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%`, background: "linear-gradient(90deg, var(--violet), var(--cyan))" }} />
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          {step === 1 && (
            <div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <Building2 size={22} style={{ color: "var(--violet)" }} />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Tell us about yourself</h2>
              <p className="mb-8 text-sm" style={{ color: "var(--text-secondary)" }}>We'll personalize your experience based on your role and expertise.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Your role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {ROLES.map((r) => (
                      <button key={r} onClick={() => setRole(r)} className="p-3 rounded-xl text-sm font-medium transition-all" style={{ background: role === r ? "rgba(139,92,246,0.12)" : "var(--surface)", border: `1px solid ${role === r ? "rgba(139,92,246,0.4)" : "var(--border)"}`, color: role === r ? "var(--violet-bright)" : "var(--text-secondary)" }}>{r}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Years in CRE</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["0–2", "3–5", "5–10", "10+"].map((y) => (
                      <button key={y} onClick={() => setYearsExp(y)} className="p-3 rounded-xl text-sm font-medium transition-all" style={{ background: yearsExp === y ? "rgba(139,92,246,0.12)" : "var(--surface)", border: `1px solid ${yearsExp === y ? "rgba(139,92,246,0.4)" : "var(--border)"}`, color: yearsExp === y ? "var(--violet-bright)" : "var(--text-secondary)" }}>{y} yrs</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>Phone (optional)</label>
                  <input className="dm-input" type="tel" placeholder="+1 (614) 555-0100" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}>
                <MapPin size={22} style={{ color: "var(--cyan)" }} />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Your market territory</h2>
              <p className="mb-8 text-sm" style={{ color: "var(--text-secondary)" }}>Select up to 3 counties. Standard plan includes 3 counties.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>State</label>
                  <select className="dm-input" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                    <option value="OH">Ohio</option>
                    <option value="IN">Indiana</option>
                    <option value="KY">Kentucky</option>
                    <option value="MI">Michigan</option>
                    <option value="PA">Pennsylvania</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
                    Counties <span style={{ color: "var(--text-tertiary)" }}>({selectedCounties.length}/3 selected)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {COUNTIES.map((c) => {
                      const selected = selectedCounties.includes(c);
                      const disabled = !selected && selectedCounties.length >= 3;
                      return (
                        <button key={c} onClick={() => !disabled && toggleItem(selectedCounties, setSelectedCounties, c)}
                          className="p-3 rounded-xl text-sm font-medium text-left transition-all flex items-center gap-2"
                          style={{ background: selected ? "rgba(139,92,246,0.12)" : "var(--surface)", border: `1px solid ${selected ? "rgba(139,92,246,0.4)" : "var(--border)"}`, color: selected ? "var(--violet-bright)" : disabled ? "var(--text-muted)" : "var(--text-secondary)", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}>
                          {selected && <CheckCircle size={13} style={{ color: "var(--violet)", flexShrink: 0 }} />}
                          {c} County
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Map placeholder */}
                <div className="map-fallback h-40 flex items-center justify-center" style={{ borderRadius: "12px" }}>
                  <div className="text-center">
                    <MapPin size={24} style={{ color: "var(--violet)", margin: "0 auto 8px" }} />
                    <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Interactive map (requires Mapbox token)</div>
                    <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Selected: {selectedCounties.join(", ")} County</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                <Building2 size={22} style={{ color: "var(--amber)" }} />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Property types</h2>
              <p className="mb-8 text-sm" style={{ color: "var(--text-secondary)" }}>Which property types do you focus on? Select all that apply.</p>
              <div className="grid grid-cols-2 gap-2">
                {PROPERTY_TYPES.map((t) => {
                  const sel = selectedTypes.includes(t);
                  return (
                    <button key={t} onClick={() => toggleItem(selectedTypes, setSelectedTypes, t)} className="p-3 rounded-xl text-sm font-medium text-left flex items-center gap-2 transition-all"
                      style={{ background: sel ? "rgba(245,158,11,0.08)" : "var(--surface)", border: `1px solid ${sel ? "rgba(245,158,11,0.3)" : "var(--border)"}`, color: sel ? "var(--amber-bright)" : "var(--text-secondary)" }}>
                      {sel && <CheckCircle size={13} style={{ color: "var(--amber)", flexShrink: 0 }} />}
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <DollarSign size={22} style={{ color: "var(--emerald)" }} />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Target deal size</h2>
              <p className="mb-8 text-sm" style={{ color: "var(--text-secondary)" }}>What deal sizes are you focused on? Select all that apply.</p>
              <div className="space-y-3">
                {DEAL_SIZES.map((s) => {
                  const sel = selectedSizes.includes(s);
                  return (
                    <button key={s} onClick={() => toggleItem(selectedSizes, setSelectedSizes, s)} className="w-full p-4 rounded-xl text-left flex items-center gap-3 transition-all"
                      style={{ background: sel ? "rgba(16,185,129,0.08)" : "var(--surface)", border: `1px solid ${sel ? "rgba(16,185,129,0.3)" : "var(--border)"}`, color: sel ? "var(--emerald-bright)" : "var(--text-secondary)" }}>
                      <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: sel ? "var(--emerald)" : "var(--border)", background: sel ? "var(--emerald)" : "transparent" }}>
                        {sel && <CheckCircle size={12} style={{ color: "white" }} />}
                      </div>
                      <span className="text-sm font-medium">{s}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <Clock size={22} style={{ color: "var(--violet)" }} />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Briefing preferences</h2>
              <p className="mb-8 text-sm" style={{ color: "var(--text-secondary)" }}>Customize your daily intelligence report delivery.</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Briefing time (ET)</label>
                  <select className="dm-input" value={briefingTime} onChange={(e) => setBriefingTime(e.target.value)}>
                    {["05:00", "06:00", "07:00", "08:00", "09:00"].map((t) => (
                      <option key={t} value={t}>{t} AM ET</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Email format</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ val: "detailed", label: "Detailed", desc: "Full analysis, all data" }, { val: "summary", label: "Summary", desc: "Key highlights only" }].map((f) => (
                      <button key={f.val} onClick={() => setBriefingFormat(f.val)} className="p-4 rounded-xl text-left transition-all"
                        style={{ background: briefingFormat === f.val ? "rgba(139,92,246,0.1)" : "var(--surface)", border: `1px solid ${briefingFormat === f.val ? "rgba(139,92,246,0.4)" : "var(--border)"}` }}>
                        <div className="text-sm font-semibold mb-1" style={{ color: briefingFormat === f.val ? "var(--violet-bright)" : "var(--text-primary)" }}>{f.label}</div>
                        <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{f.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Include in briefing</label>
                  <div className="space-y-2">
                    {[
                      { val: "deed_transfers", label: "Deed Transfers" },
                      { val: "permits", label: "Building Permits" },
                      { val: "entities", label: "Entity Filings" },
                      { val: "opportunities", label: "Opportunity Alerts" },
                      { val: "market_stats", label: "Market Statistics" },
                    ].map((inc) => {
                      const sel = includes.includes(inc.val);
                      return (
                        <label key={inc.val} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                          <input type="checkbox" checked={sel} onChange={() => toggleItem(includes, setIncludes, inc.val)} style={{ accentColor: "var(--violet)" }} />
                          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{inc.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.1))", border: "1px solid rgba(139,92,246,0.3)" }}>
                <Zap size={36} style={{ color: "var(--violet)" }} />
              </div>
              <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>You&apos;re all set, Marcus.</h2>
              <p className="mb-8 text-sm" style={{ color: "var(--text-secondary)" }}>
                Your first briefing for <strong style={{ color: "var(--text-primary)" }}>Franklin County · Industrial + Office</strong> will be ready tomorrow at <strong style={{ color: "var(--violet)" }}>{briefingTime} AM ET</strong>. Here&apos;s a preview of what to expect.
              </p>
              <div className="rounded-2xl p-6 mb-8 text-left" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "var(--violet)" }}>Preview: Tomorrow&apos;s Briefing</div>
                <div className="space-y-3">
                  {[
                    { icon: "📄", text: "3 deed transfers in Franklin County totaling $71.7M" },
                    { icon: "🏗️", text: "2 building permits including first spec industrial in 8 months" },
                    { icon: "📋", text: "4 new entity filings including potential new investor entry" },
                    { icon: "🎯", text: "8 opportunity alerts — top score: 94/100 on Morse Rd" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <span style={{ fontSize: "16px" }}>{item.icon}</span>
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button onClick={prev} className="btn-ghost" style={{ padding: "10px 20px", fontSize: "14px" }}>
                <ArrowLeft size={15} /> Back
              </button>
            ) : (
              <div />
            )}
            <button onClick={next} className="btn-primary" style={{ padding: "12px 28px", fontSize: "15px" }}>
              {step === 6 ? "Go to Dashboard" : "Continue"}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
