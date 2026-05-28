import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Darkmile unique color system — deep cosmic purple, NOT navy/blue
        dm: {
          void: "#06040A",
          deep: "#0D0A14",
          surface: "#160D22",
          elevated: "#1E1530",
          border: "#2A1D3E",
          "border-bright": "#3D2A5C",
          // Violet — primary identity color
          violet: {
            DEFAULT: "#8B5CF6",
            bright: "#A78BFA",
            dim: "#5B21B6",
            glow: "#8B5CF620",
            "glow-bright": "#8B5CF640",
          },
          // Cyan — data, metrics, live signals
          cyan: {
            DEFAULT: "#06B6D4",
            bright: "#22D3EE",
            dim: "#0E7490",
            glow: "#06B6D420",
          },
          // Amber — opportunities, gold-tier alerts
          amber: {
            DEFAULT: "#F59E0B",
            bright: "#FCD34D",
            dim: "#92400E",
            glow: "#F59E0B20",
          },
          // Emerald — positive signals
          emerald: {
            DEFAULT: "#10B981",
            bright: "#34D399",
            dim: "#065F46",
            glow: "#10B98120",
          },
          // Rose — danger, decline
          rose: {
            DEFAULT: "#F43F5E",
            bright: "#FB7185",
            dim: "#9F1239",
            glow: "#F43F5E20",
          },
          // Text
          text: {
            primary: "#F0EBF8",
            secondary: "#9D8EC0",
            tertiary: "#5E4D80",
            muted: "#3D2A5C",
          },
        },
      },
      fontFamily: {
        serif: ["Instrument Serif", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        display: ["Instrument Serif", "Georgia", "serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },
      backgroundImage: {
        "dm-grid": "linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)",
        "dm-radial": "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 70%)",
        "dm-glow-violet": "radial-gradient(ellipse at center, rgba(139,92,246,0.2) 0%, transparent 70%)",
        "dm-glow-cyan": "radial-gradient(ellipse at center, rgba(6,182,212,0.15) 0%, transparent 70%)",
        "dm-glow-amber": "radial-gradient(ellipse at center, rgba(245,158,11,0.2) 0%, transparent 70%)",
        "gradient-violet": "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
        "gradient-signal": "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
        "gradient-opportunity": "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
        "card-glass": "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
      },
      backgroundSize: {
        "grid-sm": "24px 24px",
        "grid-md": "48px 48px",
        "grid-lg": "80px 80px",
      },
      boxShadow: {
        "dm-violet": "0 0 30px rgba(139,92,246,0.2), 0 0 80px rgba(139,92,246,0.1)",
        "dm-violet-sm": "0 0 12px rgba(139,92,246,0.3)",
        "dm-cyan": "0 0 30px rgba(6,182,212,0.2)",
        "dm-amber": "0 0 30px rgba(245,158,11,0.3), 0 0 60px rgba(245,158,11,0.1)",
        "dm-amber-sm": "0 0 12px rgba(245,158,11,0.3)",
        "dm-card": "0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.4)",
        "dm-card-hover": "0 1px 0 rgba(139,92,246,0.3), 0 8px 32px rgba(139,92,246,0.15)",
        "dm-inset": "inset 0 1px 0 rgba(255,255,255,0.06)",
        "inner-glow": "inset 0 0 20px rgba(139,92,246,0.1)",
      },
      borderColor: {
        "dm": "#2A1D3E",
        "dm-bright": "#3D2A5C",
        "dm-violet": "#8B5CF640",
        "dm-cyan": "#06B6D440",
        "dm-amber": "#F59E0B40",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-violet": "pulseViolet 3s ease-in-out infinite",
        "pulse-amber": "pulseAmber 2s ease-in-out infinite",
        "radar-sweep": "radarSweep 3s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
        "scan-line": "scanLine 8s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "count-up": "countUp 1s ease-out forwards",
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-right": "slideRight 0.4s ease-out forwards",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "signal-ping": "signalPing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        "typewriter": "typewriter 3s steps(30) forwards",
        "border-rotate": "borderRotate 4s linear infinite",
        "data-flow": "dataFlow 20s linear infinite",
        "orbit": "orbit 20s linear infinite",
        "morph": "morph 8s ease-in-out infinite",
      },
      keyframes: {
        pulseViolet: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(139,92,246,0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(139,92,246,0.8), 0 0 80px rgba(139,92,246,0.3)" },
        },
        pulseAmber: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(245,158,11,0.4)" },
          "50%": { boxShadow: "0 0 30px rgba(245,158,11,0.8), 0 0 60px rgba(245,158,11,0.3)" },
        },
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        signalPing: {
          "75%, 100%": { transform: "scale(2.5)", opacity: "0" },
        },
        typewriter: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        borderRotate: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        dataFlow: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 -1000px" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(120px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(120px) rotate(-360deg)" },
        },
        morph: {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "50%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
        },
        countUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      backdropBlur: {
        xs: "2px",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "112": "28rem",
        "128": "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
