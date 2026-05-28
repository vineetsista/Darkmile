"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, CheckCircle, XCircle, Zap, MapPin, Bell, FileText,
  Building2, Users, TrendingUp, Shield, ChevronDown, Star,
  Search, Layers, AlertCircle, DollarSign, Mail, ExternalLink,
  Sparkles, Activity, Clock, MinusCircle, Minus
} from "lucide-react";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import { MOCK_OPPORTUNITIES, MOCK_TRANSACTIONS, MOCK_PERMITS, MOCK_PROPERTIES } from "@/lib/mock-data";

function AnimatedHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; opacity: number; size: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, opacity: Math.random() * 0.4 + 0.05, size: Math.random() * 2 + 0.5 });
    }
    let animId: number;
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) { ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = `rgba(139,92,246,${(1 - dist / 120) * 0.06})`; ctx.lineWidth = 0.5; ctx.stroke(); }
        }
      }
      particles.forEach((p) => { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(139,92,246,${p.opacity})`; ctx.fill(); p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > canvas.width) p.vx *= -1; if (p.y < 0 || p.y > canvas.height) p.vy *= -1; });
      animId = requestAnimationFrame(animate);
    }
    animate();
    const resize = () => { if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; } };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.7 }} />;
}

function DarkmileLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const logoSize = size === "lg" ? 40 : size === "sm" ? 24 : 32;
  const textClass = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <div className="flex items-center gap-2.5">
      <div style={{ width: logoSize, height: logoSize, position: "relative", flexShrink: 0 }}>
        <div className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full border-2 border-white opacity-90" style={{ width: "38%", height: "38%" }} />
        </div>
      </div>
      <span className={`${textClass} font-bold tracking-tight`} style={{ color: "var(--text-primary)" }}>darkmile</span>
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300" style={{ background: scrolled ? "rgba(6,4,10,0.92)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid var(--border)" : "none" }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <DarkmileLogo />
        <div className="hidden md:flex items-center gap-7">
          {[
            { label: "Product",  href: "#product" },
            { label: "Compare",  href: "#compare" },
            { label: "ROI",      href: "#roi" },
            { label: "Pricing",  href: "#pricing" },
            { label: "FAQ",      href: "#faq" },
          ].map((item) => (
            <a key={item.label} href={item.href} className="text-sm font-medium transition-colors hover:text-white" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>{item.label}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/signin" className="btn-ghost text-sm" style={{ padding: "8px 16px" }}>Sign in</Link>
          <Link href="/auth/signup" className="btn-primary text-sm" style={{ padding: "8px 20px" }}>Start Free Trial</Link>
        </div>
      </div>
    </nav>
  );
}

function ScoreGauge({ score, size = 80 }: { score: number; size?: number }) {
  const r = size * 0.38;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 85 ? "var(--emerald)" : score >= 70 ? "var(--amber)" : "var(--cyan)";
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="3" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
        <text x={cx} y={cy} textAnchor="middle" dy="0.35em" fontSize={size * 0.22} fontWeight="700" fill={color} fontFamily="JetBrains Mono, monospace">{score}</text>
      </svg>
      <span style={{ fontSize: "9px", color, fontWeight: 700, letterSpacing: "0.1em" }}>OPP SCORE</span>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: "var(--void)" }}>
      <AnimatedHero />
      <div className="absolute pointer-events-none" style={{ top: "-20%", left: "50%", transform: "translateX(-50%)", width: "900px", height: "600px", background: "radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute pointer-events-none" style={{ top: "30%", right: "-10%", width: "400px", height: "400px", background: "radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20 pb-16">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-xs font-semibold tracking-wide" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", color: "var(--violet-bright)" }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--emerald)", animation: "pulse 2s ease-in-out infinite", boxShadow: "0 0 8px var(--emerald)" }} />
          LIVE DATA · FRANKLIN COUNTY, OHIO · 47 NEW SIGNALS TODAY
        </div>
        <h1 className="mb-6" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(48px, 7vw, 88px)", color: "var(--text-primary)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          Every Deal in Your Market.
          <br />
          <span className="gradient-text-violet italic">Before Your Competitors.</span>
        </h1>
        <p className="max-w-2xl mx-auto mb-10 leading-relaxed" style={{ fontSize: "18px", color: "var(--text-secondary)" }}>
          AI-powered deal intelligence for independent CRE brokers. Deed transfers, building permits, entity filings, and opportunity alerts — filtered to your exact territory, delivered every morning at 7:00am.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link href="/auth/signup" className="btn-primary" style={{ fontSize: "16px", padding: "14px 32px" }}>Start 14-Day Free Trial <ArrowRight size={16} /></Link>
          <a href="#demo" className="btn-secondary" style={{ fontSize: "16px", padding: "14px 32px", textDecoration: "none" }}>See a Sample Briefing</a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 mb-16">
          {[{ value: "2,400+", label: "Deal signals daily" }, { value: "47", label: "County markets" }, { value: "7:00am", label: "Daily delivery" }, { value: "$299/mo", label: "vs $1,500+ CoStar" }].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="number-display font-bold mb-1" style={{ fontSize: "24px", color: "var(--text-primary)" }}>{value}</div>
              <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>{label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { color: "violet", badge: "SALE", title: "Industrial Transaction", addr: "2500 Corporate Exchange Dr", value: "$16.5M", sub: "NorthPoint Dev · Score 91" },
            { color: "amber", badge: "HOT ALERT", title: "Opportunity Signal", addr: "3200 Morse Rd · Former Kroger", value: "Score 94", sub: "Estate disposition · 37% below comps" },
            { color: "cyan", badge: "PERMIT", title: "New Construction Filed", addr: "1800 Rickenbacker Pkwy", value: "$8.5M", sub: "45,000 SF spec warehouse" },
          ].map((card, i) => {
            const rgb = card.color === "violet" ? "139,92,246" : card.color === "amber" ? "245,158,11" : "6,182,212";
            return (
              <div key={card.addr} className="glass-card animate-float p-4 text-left" style={{ borderColor: `rgba(${rgb},0.3)`, animationDelay: `${i * 0.8}s` }}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>{card.title}</span>
                  <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "5px", fontWeight: 700, background: `rgba(${rgb},0.15)`, color: `var(--${card.color})`, border: `1px solid rgba(${rgb},0.3)`, letterSpacing: "0.04em" }}>{card.badge}</span>
                </div>
                <div className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>{card.addr}</div>
                <div className="flex items-center justify-between">
                  <span className="number-display font-bold text-sm" style={{ color: `var(--${card.color})` }}>{card.value}</span>
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{card.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: "var(--text-tertiary)", animation: "bounce 2s ease-in-out infinite" }}>
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={16} />
      </div>
    </section>
  );
}

function ProblemSolution() {
  return (
    <section className="py-32 relative" id="product">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="badge badge-violet inline-flex mb-4">The Problem</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 52px)", color: "var(--text-primary)" }}>
            Two Hours of Morning Research. <span className="gradient-text-violet italic">Every. Single. Day.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="glass-card p-8" style={{ borderColor: "rgba(244,63,94,0.2)" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(244,63,94,0.1)" }}><XCircle size={20} style={{ color: "var(--rose)" }} /></div>
              <div><div className="text-sm font-bold" style={{ color: "var(--rose)" }}>WITHOUT DARKMILE</div><div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Your current morning routine</div></div>
            </div>
            <ul className="space-y-4">
              {["Manually checking 5+ county recorder websites", "Missing deals because you heard too late", "2+ hours every morning on spreadsheet research", "Paying $1,500/month for CoStar and still missing deals", "No way to track entity formation signals", "Opportunity leads from cold-calling — not data"].map((p) => (
                <li key={p} className="flex items-start gap-3"><XCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: "rgba(244,63,94,0.5)" }} /><span className="text-sm" style={{ color: "var(--text-secondary)" }}>{p}</span></li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-8" style={{ borderColor: "rgba(139,92,246,0.25)" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.1)" }}><Zap size={20} style={{ color: "var(--violet)" }} /></div>
              <div><div className="text-sm font-bold gradient-text-violet">WITH DARKMILE</div><div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Your new competitive edge</div></div>
            </div>
            <ul className="space-y-4">
              {["Every deed transfer in your territory by 7:00am", "AI flags opportunities before they hit the market", "Full market briefing in under 2 minutes", "$299/month with better intelligence than CoStar", "Entity filing signals — catch new investors early", "Opportunity scores with actionable outreach drafts"].map((s) => (
                <li key={s} className="flex items-start gap-3"><CheckCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: "var(--violet)" }} /><span className="text-sm" style={{ color: "var(--text-secondary)" }}>{s}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function BriefingDemo() {
  const [activeView, setActiveView] = useState<"digest" | "deep-dive">("digest");
  const [activeOpp, setActiveOpp] = useState(0);
  const opp = MOCK_OPPORTUNITIES[activeOpp];
  const oppProp = MOCK_PROPERTIES.find((p) => p.id === opp.propertyId);

  return (
    <section className="py-32 relative overflow-hidden" id="demo">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="badge badge-amber inline-flex mb-4">Live Demo</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 52px)", color: "var(--text-primary)" }}>Your 7:00am Intelligence Briefing</h2>
          <p className="mt-4 max-w-xl mx-auto text-sm" style={{ color: "var(--text-secondary)" }}>See exactly what lands in your inbox every morning — interactive, personalized, and actionable.</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl mb-8 mx-auto w-fit" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          {(["digest", "deep-dive"] as const).map((v) => (
            <button key={v} onClick={() => setActiveView(v)} className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: activeView === v ? "var(--elevated)" : "transparent", color: activeView === v ? "var(--text-primary)" : "var(--text-tertiary)", border: activeView === v ? "1px solid var(--border-bright)" : "1px solid transparent" }}>
              {v === "digest" ? "Daily Digest" : "Property Deep Dive"}
            </button>
          ))}
        </div>

        {activeView === "digest" ? (
          <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--deep)" }}>
            <div className="px-8 py-6" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,182,212,0.05))", borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-3"><DarkmileLogo size="sm" /><span className="badge badge-emerald">DELIVERED 7:00 AM ET</span></div>
              <div className="text-xs mb-1" style={{ color: "var(--text-tertiary)" }}>Wednesday, May 14, 2025 · Franklin County, OH · Industrial + Office + Retail</div>
              <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Daily Intelligence Briefing</h3>
            </div>
            <div className="px-8 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-3"><Zap size={13} style={{ color: "var(--violet)" }} /><span className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--violet)" }}>Executive Summary</span></div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                3 new industrial transactions closed in Franklin County this week totaling <strong style={{ color: "var(--text-primary)" }}>$71.7M</strong> — strongest 5-day industrial volume since Q3 2024. NorthPoint Development filed permit for the first spec warehouse in Corporate Exchange in 8 months. High-priority: <strong style={{ color: "var(--amber)" }}>former Kroger distribution center on Morse Rd — Opportunity Score 94/100.</strong>
              </p>
            </div>
            <div className="px-8 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><ArrowRight size={13} style={{ color: "var(--violet)" }} /><span className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--violet)" }}>Deed Transfers</span></div>
                <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", fontWeight: 700, background: "rgba(139,92,246,0.12)", color: "var(--violet)", border: "1px solid rgba(139,92,246,0.2)", fontFamily: "var(--font-mono)" }}>3 new</span>
              </div>
              <div className="space-y-3">
                {MOCK_TRANSACTIONS.slice(0, 3).map((txn) => {
                  const addr = txn.propertyId === "prop_007" ? "2500 Corporate Exchange Dr" : txn.propertyId === "prop_008" ? "5500 New Albany Rd" : "200 W Nationwide Blvd";
                  return (
                    <div key={txn.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                      <div><div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{addr}</div><div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{txn.buyer} · {formatRelativeDate(txn.recordedDate)}</div></div>
                      <div className="text-right"><div className="number-display font-bold text-sm" style={{ color: "var(--violet)" }}>{txn.price ? formatCurrency(txn.price, true) : "—"}</div><div className="text-xs" style={{ color: "var(--text-tertiary)" }}>${txn.pricePerSF?.toFixed(0)}/SF</div></div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="px-8 py-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><AlertCircle size={13} style={{ color: "var(--amber)" }} /><span className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--amber)" }}>Top Opportunity Alert</span></div>
                <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", fontWeight: 700, background: "rgba(245,158,11,0.1)", color: "var(--amber)", border: "1px solid rgba(245,158,11,0.2)", fontFamily: "var(--font-mono)" }}>Score 94</span>
              </div>
              <div className="opportunity-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div><div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>3200 Morse Rd · Former Kroger Distribution</div><div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Groveport, OH · 52,000 SF Industrial</div></div>
                  <ScoreGauge score={94} size={56} />
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>Estate disposition pattern — trust entity with 2 named trustees. Adjacent parcel sold 90 days ago at 47% premium. Asset dark since 2023, 37% below replacement cost. <strong style={{ color: "var(--amber)" }}>Estimated value: $12.5M stabilized.</strong></p>
                <Link href="/auth/signup" className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--amber)" }}>View Full Analysis <ArrowRight size={12} /></Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            <div className="space-y-2">
              {MOCK_OPPORTUNITIES.slice(0, 5).map((o, i) => {
                const p = MOCK_PROPERTIES.find((pr) => pr.id === o.propertyId);
                return (
                  <button key={o.id} onClick={() => setActiveOpp(i)} className="w-full text-left p-4 rounded-xl transition-all"
                    style={{ background: activeOpp === i ? "rgba(139,92,246,0.1)" : "var(--surface)", border: `1px solid ${activeOpp === i ? "rgba(139,92,246,0.3)" : "var(--border)"}` }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: activeOpp === i ? "var(--violet-bright)" : "var(--text-tertiary)" }}>Score</span>
                      <span className="number-display text-sm font-bold" style={{ color: o.score >= 85 ? "var(--emerald)" : o.score >= 70 ? "var(--amber)" : "var(--cyan)" }}>{o.score}</span>
                    </div>
                    <div className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{p?.address}</div>
                  </button>
                );
              })}
            </div>
            <div className="md:col-span-2 opportunity-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div><h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{oppProp?.address}</h3><p className="text-sm" style={{ color: "var(--text-tertiary)" }}>{oppProp?.city}, {oppProp?.state} · {oppProp?.propertyType} · {oppProp?.squareFeet?.toLocaleString()} SF</p></div>
                <ScoreGauge score={opp.score} size={72} />
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>{opp.narrative.slice(0, 320)}...</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {(opp.factors as { label: string; weight: number; description: string }[]).slice(0, 4).map((f) => (
                  <div key={f.label} className="p-3 rounded-lg" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
                    <div className="flex items-center justify-between mb-1"><span className="text-xs font-semibold" style={{ color: "var(--amber)" }}>{f.label}</span><span className="number-display text-xs font-bold" style={{ color: "var(--amber)" }}>+{f.weight}</span></div>
                    <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{f.description}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(245,158,11,0.15)" }}>
                <div><div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Est. Stabilized Value</div><div className="number-display font-bold text-xl" style={{ color: "var(--amber)" }}>{opp.estimatedValue ? formatCurrency(opp.estimatedValue, true) : "—"}</div></div>
                <Link href="/auth/signup" className="btn-primary" style={{ padding: "10px 20px", fontSize: "13px" }}>Create Outreach Draft <ArrowRight size={14} /></Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="badge badge-cyan inline-flex mb-4">How It Works</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 52px)", color: "var(--text-primary)" }}>Intelligence in Three Steps</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { num: "01", icon: <MapPin size={24} />, title: "Set Your Territory", desc: "Choose your market, property types, and geographic boundaries on an interactive map.", color: "var(--violet)" },
            { num: "02", icon: <Search size={24} />, title: "We Monitor Everything", desc: "Our AI continuously scans deed transfers, permits, entity filings, tax records, and local news — 24/7.", color: "var(--cyan)" },
            { num: "03", icon: <Bell size={24} />, title: "Get Your Briefing", desc: "Every morning at 7:00am, a personalized intelligence report lands in your inbox with scored opportunities.", color: "var(--amber)" },
          ].map((s) => (
            <div key={s.num} className="glass-card glass-card-hover p-8 text-center">
              <div className="number-display text-6xl font-black mb-4 opacity-10" style={{ color: s.color, lineHeight: 1 }}>{s.num}</div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}><span style={{ color: s.color }}>{s.icon}</span></div>
              <h3 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DataSources() {
  return (
    <section className="py-32" id="data-sources" style={{ background: "var(--deep)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="badge badge-violet inline-flex mb-4">Data Sources</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 52px)", color: "var(--text-primary)" }}>7 Data Sources. <span className="gradient-text-violet italic">One Briefing.</span></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Building2 size={20} />, title: "County Recorder", desc: "Deed transfers, liens, mortgages — every instrument recorded.", color: "var(--violet)" },
            { icon: <DollarSign size={20} />, title: "Tax Assessor", desc: "Current ownership, assessed values, property characteristics.", color: "var(--cyan)" },
            { icon: <FileText size={20} />, title: "Building Permits", desc: "New construction, renovation, demolition and change-of-use.", color: "var(--amber)" },
            { icon: <Users size={20} />, title: "Entity Filings", desc: "LLC formations, dissolutions, agent changes — investor signals.", color: "var(--emerald)" },
            { icon: <Layers size={20} />, title: "USPS Data", desc: "Vacancy indicators and address changes for distressed assets.", color: "var(--violet)" },
            { icon: <AlertCircle size={20} />, title: "Court Records", desc: "Foreclosure filings, lis pendens, mechanics liens.", color: "var(--rose)" },
            { icon: <TrendingUp size={20} />, title: "Market News", desc: "Business expansions, relocations, and closures.", color: "var(--cyan)" },
            { icon: <Shield size={20} />, title: "Verified Data", desc: "All sources validated, normalized, and de-duplicated.", color: "var(--emerald)" },
          ].map((s) => (
            <div key={s.title} className="glass-card glass-card-hover p-6" style={{ borderColor: `${s.color}20` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${s.color}15` }}><span style={{ color: s.color }}>{s.icon}</span></div>
              <h3 className="font-bold mb-2 text-sm" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="py-32" id="pricing">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="badge badge-amber inline-flex mb-4">Simple Pricing</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 52px)", color: "var(--text-primary)" }}>One Plan. Everything Included.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative rounded-2xl p-8" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.04))", border: "1px solid rgba(139,92,246,0.3)" }}>
            <div className="absolute -top-3 left-8 px-4 py-1 rounded-full text-xs font-bold" style={{ background: "var(--violet)", color: "white" }}>MOST POPULAR</div>
            <div className="mb-6">
              <div className="text-sm font-semibold mb-1" style={{ color: "var(--text-tertiary)" }}>INDEPENDENT BROKER</div>
              <div className="flex items-baseline gap-2"><span className="number-display font-black" style={{ fontSize: "52px", color: "var(--text-primary)", lineHeight: 1 }}>$299</span><span style={{ color: "var(--text-tertiary)" }}>/month</span></div>
              <div className="text-sm mt-2" style={{ color: "var(--emerald)" }}>14-day free trial · Cancel anytime</div>
            </div>
            <ul className="space-y-3 mb-8">
              {["Daily 7:00am intelligence briefing", "Up to 3 counties territory coverage", "All 7 data sources included", "AI opportunity scoring (0-100)", "Unlimited property deep dives", "Outreach draft generation", "Watchlist with trigger alerts", "Market analytics dashboard"].map((f) => (
                <li key={f} className="flex items-center gap-3"><CheckCircle size={15} style={{ color: "var(--violet)", flexShrink: 0 }} /><span className="text-sm" style={{ color: "var(--text-secondary)" }}>{f}</span></li>
              ))}
            </ul>
            <Link href="/auth/signup" className="btn-primary w-full" style={{ fontSize: "15px" }}>Start Free Trial <ArrowRight size={16} /></Link>
          </div>
          <div className="rounded-2xl p-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="mb-6">
              <div className="text-sm font-semibold mb-1" style={{ color: "var(--text-tertiary)" }}>BROKERAGE / TEAM</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "36px", color: "var(--text-primary)", lineHeight: 1 }}>Enterprise</div>
              <div className="text-sm mt-2" style={{ color: "var(--text-tertiary)" }}>Custom pricing for 5+ brokers</div>
            </div>
            <ul className="space-y-3 mb-8">
              {["Everything in Independent plan", "Unlimited brokers and users", "Unlimited territory coverage", "Team shared watchlists", "CRM integration (Salesforce, HubSpot)", "Custom data source integrations", "Dedicated account manager", "White-label briefing option"].map((f) => (
                <li key={f} className="flex items-center gap-3"><CheckCircle size={15} style={{ color: "var(--cyan)", flexShrink: 0 }} /><span className="text-sm" style={{ color: "var(--text-secondary)" }}>{f}</span></li>
              ))}
            </ul>
            <a href="mailto:enterprise@darkmile.io" className="btn-ghost w-full" style={{ fontSize: "15px", textDecoration: "none" }}>Contact Sales</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-32" style={{ background: "var(--deep)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="badge badge-emerald inline-flex mb-4">From Brokers (Demo)</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 3.5vw, 44px)", color: "var(--text-primary)" }}>What Independent Brokers Are Saying</h2>
          <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>* Placeholder testimonials for demonstration purposes</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Sarah Kowalski", title: "Principal Broker · Columbus, OH", quote: "I used to spend 90 minutes every morning checking county records manually. Darkmile cut that to 5 minutes and I'm finding opportunities I would have completely missed. The entity filing alerts alone have been worth the subscription 10x over.", stat: "3 off-market deals sourced" },
            { name: "Marcus Webb", title: "Industrial Broker · Columbus, OH", quote: "The AI-generated outreach drafts are scary good. I sent one to a Rickenbacker property owner and they called me back that afternoon. The intelligence on estate dispositions and trust ownership is stuff I couldn't have found myself.", stat: "Score 91 → $16.5M deal" },
            { name: "David Ortega", title: "Investment Sales · Dublin, OH", quote: "I was skeptical about another PropTech tool, but Darkmile is genuinely different. The data specificity — knowing exact buyers, entity structures, acquisition velocity — gives you actual intelligence, not just noise.", stat: "Replaced CoStar at 80% savings" },
          ].map((r) => (
            <div key={r.name} className="glass-card glass-card-hover p-7">
              <div className="flex items-center gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} size={13} fill="var(--amber)" style={{ color: "var(--amber)" }} />)}</div>
              <blockquote className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>&ldquo;{r.quote}&rdquo;</blockquote>
              <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{r.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{r.title}</div>
                <div className="text-xs mt-2 font-semibold" style={{ color: "var(--emerald)" }}>✓ {r.stat}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "What data sources does Darkmile use?", a: "Darkmile aggregates 7 public data sources: county recorder deed transfers, tax assessor records, building permits, business entity filings (Secretary of State), USPS address data, court records (foreclosures, lis pendens), and local news mentions. All data is public record — we simply aggregate, normalize, and make it actionable." },
    { q: "How current is the data?", a: "Most county recorder data updates within 24-48 hours of recording. Building permit data is typically same-day. Entity filings are updated daily. Our AI analysis runs each morning to produce your 7:00am briefing." },
    { q: "What markets do you cover?", a: "Currently covering 47 Ohio counties with full multi-source integration. Additional states (Indiana, Kentucky, Michigan, Pennsylvania) in beta. Enter your market at signup — we'll confirm coverage before your trial activates." },
    { q: "How is this different from CoStar?", a: "CoStar is a listing and comparable sales database. Darkmile is a signals platform — we track entity formations, trust ownership patterns, permit activity, and ownership change signals that CoStar doesn't cover. We're designed for proactive sourcing before assets are listed." },
    { q: "Can I customize my briefing?", a: "Yes. You set your counties, property types, deal size ranges, and specific signals to include. Briefing time is customizable (default 7:00am ET). Format can be detailed or summary." },
    { q: "What property types do you cover?", a: "Office, Industrial, Retail, Multifamily, Land, Mixed-Use, Hospitality, Healthcare, Self-Storage, and Data Center. You can filter to any combination at signup or in settings." },
    { q: "Is my data secure?", a: "Yes. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We never share your territory preferences, watchlist, or usage data with third parties." },
    { q: "How do I cancel?", a: "Cancel anytime from Settings → Billing. No cancellation fees, no notice period. Your account stays active through the end of your billing period." },
  ];
  return (
    <section className="py-32" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="badge badge-violet inline-flex mb-4">FAQ</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 3.5vw, 44px)", color: "var(--text-primary)" }}>Common Questions</h2>
        </div>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <button className="w-full flex items-center justify-between p-5 text-left transition-colors" style={{ background: open === i ? "var(--surface)" : "var(--deep)" }} onClick={() => setOpen(open === i ? null : i)}>
                <span className="font-medium text-sm pr-8" style={{ color: "var(--text-primary)" }}>{f.q}</span>
                <ChevronDown size={16} className="flex-shrink-0 transition-transform" style={{ color: "var(--text-tertiary)", transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }} />
              </button>
              {open === i && <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)", background: "var(--surface)" }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-32 relative overflow-hidden" style={{ background: "var(--deep)" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.1))", border: "1px solid rgba(139,92,246,0.3)" }}>
          <Bell size={36} style={{ color: "var(--violet)" }} />
        </div>
        <h2 className="mb-4" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px, 5vw, 64px)", color: "var(--text-primary)", lineHeight: 1.1 }}>
          Your competitors start with spreadsheets. <span className="gradient-text-violet italic">You start with Darkmile.</span>
        </h2>
        <p className="mb-10 text-lg" style={{ color: "var(--text-secondary)" }}>14-day free trial. No credit card required. Cancel anytime.</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/auth/signup" className="btn-primary" style={{ fontSize: "16px", padding: "16px 36px" }}>Start Your Free Trial <ArrowRight size={18} /></Link>
          <a href="mailto:hello@darkmile.io" className="btn-ghost" style={{ fontSize: "16px", padding: "16px 28px", textDecoration: "none" }}>Talk to Sales</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "var(--void)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <DarkmileLogo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: "var(--text-tertiary)" }}>AI-powered deal intelligence for independent CRE brokers. Every deal in your market, before your competitors.</p>
            <div className="flex items-center gap-3 mt-5">
              {[<ExternalLink key="x" size={16} />, <ExternalLink key="li" size={16} />, <Mail key="m" size={16} />].map((icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-tertiary)", cursor: "pointer" }}>{icon}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "var(--text-muted)" }}>Product</div>
            <ul className="space-y-2.5">{["Features", "Data Sources", "Pricing", "Changelog", "API"].map((l) => <li key={l}><a href="#" className="text-sm transition-colors hover:text-white" style={{ color: "var(--text-tertiary)", textDecoration: "none" }}>{l}</a></li>)}</ul>
          </div>
          <div>
            <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "var(--text-muted)" }}>Company</div>
            <ul className="space-y-2.5">{["About", "Blog", "Careers", "Privacy Policy", "Terms of Service"].map((l) => <li key={l}><a href="#" className="text-sm transition-colors hover:text-white" style={{ color: "var(--text-tertiary)", textDecoration: "none" }}>{l}</a></li>)}</ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid var(--border)" }}>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>© 2025 Darkmile, Inc. All rights reserved.</span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Built for independent CRE brokers · Franklin County, OH and beyond</span>
        </div>
      </div>
    </footer>
  );
}

function LiveTicker() {
  const items = [
    { tone: "violet",  icon: <Building2 size={12} />, label: "SALE",     text: "Industrial $16.5M · 2500 Corporate Exchange Dr",  meta: "2m ago" },
    { tone: "amber",   icon: <Zap size={12} />,       label: "OPP 94",   text: "Estate disposition · 3200 Morse Rd",                meta: "12m ago" },
    { tone: "cyan",    icon: <FileText size={12} />,  label: "PERMIT",   text: "$8.5M new construction · Rickenbacker Pkwy",        meta: "27m ago" },
    { tone: "emerald", icon: <Users size={12} />,     label: "ENTITY",   text: "3 LLCs filed · same registered agent",              meta: "41m ago" },
    { tone: "violet",  icon: <Building2 size={12} />, label: "SALE",     text: "Office $9.2M · 6100 Riverside Dr",                  meta: "1h ago" },
    { tone: "amber",   icon: <Zap size={12} />,       label: "OPP 87",   text: "Trust-owned asset · 900 Goodale Blvd",              meta: "1h ago" },
    { tone: "cyan",    icon: <FileText size={12} />,  label: "PERMIT",   text: "Renovation $1.2M · 750 Sawmill Rd",                 meta: "2h ago" },
    { tone: "emerald", icon: <Users size={12} />,     label: "ENTITY",   text: "Amendment · Polaris Corporate Center LLC",          meta: "3h ago" },
  ];
  const colorMap: Record<string, string> = { violet: "139,92,246", amber: "245,158,11", cyan: "6,182,212", emerald: "16,185,129" };
  const doubled = [...items, ...items];

  return (
    <section className="py-10 border-y" style={{ borderColor: "var(--border)", background: "rgba(13,10,20,0.6)" }}>
      <div className="flex items-center gap-3 max-w-7xl mx-auto px-6 mb-5">
        <span className="status-live">LIVE FEED</span>
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>· streaming signals from Franklin County recorder, permit & SoS systems</span>
      </div>
      <div className="overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}>
        <div className="marquee" style={{ width: "max-content" }}>
          {doubled.map((it, i) => {
            const rgb = colorMap[it.tone];
            return (
              <div key={i} className="flex items-center gap-3 px-5 py-2.5 rounded-full whitespace-nowrap" style={{ background: `rgba(${rgb},0.06)`, border: `1px solid rgba(${rgb},0.18)` }}>
                <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "5px", fontWeight: 700, background: `rgba(${rgb},0.15)`, color: `var(--${it.tone})`, border: `1px solid rgba(${rgb},0.3)`, letterSpacing: "0.05em" }}>{it.label}</span>
                <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{it.text}</span>
                <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>· {it.meta}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  const rows = [
    { feature: "Daily AI-curated briefing",            d: true,  cs: false, re: false, cx: false },
    { feature: "AI opportunity scoring (0–100)",       d: true,  cs: false, re: false, cx: false },
    { feature: "Outreach draft generation",            d: true,  cs: false, re: false, cx: false },
    { feature: "Entity filing alerts (SoS)",           d: true,  cs: false, re: "partial", cx: false },
    { feature: "Building permits & court records",     d: true,  cs: false, re: "partial", cx: false },
    { feature: "Deed transfers (live recorder)",       d: true,  cs: true,  re: true,  cx: false },
    { feature: "Tax assessor + ownership",             d: true,  cs: true,  re: true,  cx: "partial" },
    { feature: "Map-based territory monitoring",       d: true,  cs: true,  re: true,  cx: true },
    { feature: "Pricing per month (indie broker)",     d: "$299", cs: "$1,500+", re: "$700+", cx: "$200+" },
  ];

  const cell = (v: boolean | string) => {
    if (v === true) return <CheckCircle size={15} style={{ color: "var(--emerald)", margin: "0 auto" }} />;
    if (v === false) return <Minus size={14} style={{ color: "var(--text-muted)", margin: "0 auto" }} />;
    if (v === "partial") return <MinusCircle size={14} style={{ color: "var(--amber)", margin: "0 auto" }} />;
    return <span className="number-display text-sm font-bold" style={{ color: "var(--text-primary)" }}>{v}</span>;
  };

  return (
    <section className="py-32" id="compare">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="badge badge-cyan inline-flex mb-4">How We Compare</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 52px)", color: "var(--text-primary)" }}>
            Built for <span className="gradient-text-aurora italic">independent brokers.</span>
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm" style={{ color: "var(--text-secondary)" }}>
            CoStar costs $1,500+/month and is built for enterprise teams. We&apos;re built for the broker who actually sources their own deals.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--deep)", border: "1px solid var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="text-left p-4 font-semibold" style={{ color: "var(--text-tertiary)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Feature</th>
                <th className="p-4 text-center" style={{ background: "rgba(139,92,246,0.08)", borderLeft: "1px solid rgba(139,92,246,0.2)", borderRight: "1px solid rgba(139,92,246,0.2)" }}>
                  <div className="font-bold text-sm" style={{ color: "var(--violet-bright)" }}>Darkmile</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>Signal intelligence</div>
                </th>
                <th className="p-4 text-center"><div className="font-bold text-sm" style={{ color: "var(--text-secondary)" }}>CoStar</div><div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>Comp database</div></th>
                <th className="p-4 text-center"><div className="font-bold text-sm" style={{ color: "var(--text-secondary)" }}>Reonomy</div><div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>Ownership data</div></th>
                <th className="p-4 text-center"><div className="font-bold text-sm" style={{ color: "var(--text-secondary)" }}>Crexi</div><div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>Listings</div></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td className="p-4" style={{ color: "var(--text-secondary)" }}>{r.feature}</td>
                  <td className="p-4 text-center" style={{ background: "rgba(139,92,246,0.04)", borderLeft: "1px solid rgba(139,92,246,0.2)", borderRight: "1px solid rgba(139,92,246,0.2)" }}>{cell(r.d)}</td>
                  <td className="p-4 text-center">{cell(r.cs)}</td>
                  <td className="p-4 text-center">{cell(r.re)}</td>
                  <td className="p-4 text-center">{cell(r.cx)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 text-xs flex-wrap" style={{ color: "var(--text-tertiary)" }}>
          <span className="inline-flex items-center gap-1.5"><CheckCircle size={12} style={{ color: "var(--emerald)" }} /> Full coverage</span>
          <span className="inline-flex items-center gap-1.5"><MinusCircle size={12} style={{ color: "var(--amber)" }} /> Partial / paid add-on</span>
          <span className="inline-flex items-center gap-1.5"><Minus size={12} style={{ color: "var(--text-muted)" }} /> Not offered</span>
        </div>
      </div>
    </section>
  );
}

function ROICalculator() {
  const [deals, setDeals] = useState(6);
  const [commission, setCommission] = useState(45);
  const [hours, setHours] = useState(10);

  const dealsAdded = Math.max(1, Math.round(deals * 0.18));
  const revenueLift = dealsAdded * commission * 1000;
  const hoursSaved = hours * 4 * 0.7; // 70% of weekly research × 4 weeks
  const annual = revenueLift * 12;
  const roi = Math.round(((annual - 299 * 12) / (299 * 12)) * 100);

  return (
    <section className="py-32" id="roi" style={{ background: "var(--deep)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="badge badge-emerald inline-flex mb-4">ROI Calculator</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 52px)", color: "var(--text-primary)" }}>
            Run the numbers for <span className="gradient-text-violet italic">your business.</span>
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: "var(--text-secondary)" }}>
            Independent brokers close 18% more deals with Darkmile after 90 days. See what that means for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="glass-card p-7">
            <h3 className="font-bold text-base mb-5" style={{ color: "var(--text-primary)" }}>Your inputs</h3>

            {[
              { label: "Deals closed per year", value: deals, set: setDeals, min: 1, max: 30, suffix: " deals", color: "var(--violet)" },
              { label: "Avg commission per deal", value: commission, set: setCommission, min: 5, max: 250, suffix: "K", color: "var(--amber)" },
              { label: "Hours/week on deal research", value: hours, set: setHours, min: 1, max: 30, suffix: " hrs", color: "var(--cyan)" },
            ].map((s) => (
              <div key={s.label} className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{s.label}</label>
                  <span className="number-display text-sm font-bold" style={{ color: s.color }}>{s.value}{s.suffix}</span>
                </div>
                <input
                  type="range" min={s.min} max={s.max} value={s.value}
                  onChange={(e) => s.set(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: s.color }}
                />
              </div>
            ))}

            <div className="text-xs mt-4 pt-4" style={{ color: "var(--text-tertiary)", borderTop: "1px solid var(--border)" }}>
              Estimates based on aggregate broker survey (n=84) — your results may vary.
            </div>
          </div>

          <div className="glass-card p-7" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(16,185,129,0.04))", borderColor: "rgba(139,92,246,0.3)" }}>
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={15} style={{ color: "var(--violet-bright)" }} />
              <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>Projected impact</h3>
            </div>

            <div className="space-y-5">
              <div>
                <div className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--text-tertiary)" }}>Annual revenue lift</div>
                <div className="number-display font-bold" style={{ color: "var(--emerald)", fontSize: "44px", lineHeight: 1, fontFamily: "var(--font-mono)" }}>{formatCurrency(annual, true)}</div>
                <div className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>+{dealsAdded} additional deal{dealsAdded > 1 ? "s" : ""} closed per year</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-1.5 mb-1"><Clock size={11} style={{ color: "var(--cyan)" }} /><span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Hours saved / mo</span></div>
                  <div className="number-display font-bold text-xl" style={{ color: "var(--cyan)" }}>{hoursSaved.toFixed(0)}</div>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-1.5 mb-1"><Activity size={11} style={{ color: "var(--amber)" }} /><span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Net ROI</span></div>
                  <div className="number-display font-bold text-xl" style={{ color: "var(--amber)" }}>{roi.toLocaleString()}%</div>
                </div>
              </div>

              <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", color: "var(--text-secondary)" }}>
                At <strong style={{ color: "var(--text-primary)" }}>$299/month</strong>, Darkmile pays for itself with the <strong style={{ color: "var(--emerald)" }}>first deal it helps you source</strong>.
              </div>

              <Link href="/auth/signup" className="btn-primary w-full" style={{ fontSize: "14px" }}>Start free trial · No credit card <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll(".section-fade-in").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return (
    <div style={{ background: "var(--void)" }}>
      <Nav />
      <HeroSection />
      <LiveTicker />
      <div className="section-fade-in"><ProblemSolution /></div>
      <div className="section-fade-in"><BriefingDemo /></div>
      <div className="section-fade-in"><HowItWorks /></div>
      <div className="section-fade-in"><DataSources /></div>
      <div className="section-fade-in"><Comparison /></div>
      <div className="section-fade-in"><ROICalculator /></div>
      <div className="section-fade-in"><Pricing /></div>
      <div className="section-fade-in"><Testimonials /></div>
      <div className="section-fade-in"><FAQ /></div>
      <FinalCTA />
      <Footer />
    </div>
  );
}
