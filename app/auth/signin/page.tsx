"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";

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

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Demo: accept any credentials
    await new Promise((r) => setTimeout(r, 800));
    if (email && password) {
      router.push("/dashboard");
    } else {
      setError("Please enter your email and password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--void)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: "var(--deep)" }}>
        <div className="absolute inset-0 grid-bg-fade opacity-60" />
        <div className="absolute pointer-events-none" style={{ top: "-10%", left: "20%", width: "600px", height: "600px", background: "radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute pointer-events-none" style={{ bottom: "-10%", right: "-10%", width: "400px", height: "400px", background: "radial-gradient(ellipse, rgba(6,182,212,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="relative flex flex-col justify-between p-12 w-full">
          <div className="flex items-center justify-between">
            <DarkmileLogo />
            <span className="status-live">47 signals today</span>
          </div>
          <div>
            <blockquote className="text-2xl leading-relaxed mb-6" style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}>
              &ldquo;I closed 3 off-market deals in 60 days using Darkmile opportunity alerts. The entity filing signals alone are worth <span className="gradient-text-aurora italic">10x the subscription</span>.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "linear-gradient(135deg, var(--violet), var(--cyan))", color: "white" }}>MW</div>
              <div>
                <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Marcus Webb</div>
                <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Industrial Broker · Webb Commercial Realty · Columbus, OH</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {[{ value: "47", label: "Counties" }, { value: "2,400+", label: "Daily signals" }, { value: "94", label: "Top opp score" }].map(({ value, label }) => (
              <div key={label}>
                <div className="number-display font-bold text-2xl" style={{ color: "var(--violet)" }}>{value}</div>
                <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <DarkmileLogo />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Welcome back</h1>
          <p className="mb-8 text-sm" style={{ color: "var(--text-secondary)" }}>Sign in to your Darkmile account to access your daily briefings.</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)", color: "var(--rose)" }}>
              {error}
            </div>
          )}

          {/* Demo credentials notice */}
          <div className="mb-6 p-3 rounded-xl text-xs" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", color: "var(--violet-bright)" }}>
            <strong>Demo mode:</strong> Enter any email + password to explore the dashboard.
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
                <input className="dm-input pl-9" type="email" placeholder="you@brokerage.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
                <input className="dm-input pl-9 pr-10" type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)", background: "none", border: "none", cursor: "pointer" }} onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                <input type="checkbox" className="rounded" style={{ accentColor: "var(--violet)" }} />
                Remember me
              </label>
              <a href="#" className="text-xs font-medium" style={{ color: "var(--violet)", textDecoration: "none" }}>Forgot password?</a>
            </div>
            <button type="submit" className="btn-primary w-full" style={{ fontSize: "15px", padding: "12px 24px" }} disabled={loading}>
              {loading ? "Signing in..." : (<>Sign In <ArrowRight size={16} /></>)}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          <button className="btn-ghost w-full" style={{ fontSize: "14px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center mt-6 text-sm" style={{ color: "var(--text-tertiary)" }}>
            No account?{" "}
            <Link href="/auth/signup" className="font-semibold" style={{ color: "var(--violet)", textDecoration: "none" }}>Start free trial</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
