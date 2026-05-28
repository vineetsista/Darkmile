<div align="center">

<br />

<img src=".github/logo.svg" alt="Darkmile" width="96" />

# Darkmile

### AI-powered deal intelligence for independent CRE brokers.

*Every deed transfer, building permit, and entity filing in your territory — scored, ranked, and delivered before your competition sees it.*

<br />

[![Built with Next.js 16](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748?logo=prisma&logoColor=white)](https://prisma.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-A78BFA.svg)](LICENSE)
[![Demo Ready](https://img.shields.io/badge/demo-ready-10B981.svg)]()

<br />

**[Quick Start](#-quick-start-demo-mode) · [Features](#-features) · [Screenshots](#-screenshots) · [Tech Stack](#-tech-stack) · [Roadmap](#%EF%B8%8F-roadmap)**

</div>

<br />

---

## What is Darkmile?

Darkmile is a **signal intelligence platform** for independent commercial real estate brokers. Instead of paying $1,500+/month for CoStar to look up listings, you get a personalized **7:00 AM AI briefing** that surfaces:

- **Every deed transfer** in your territory — with buyer/seller, price/SF, and pattern context
- **Every building permit** — new construction, renovation, demolition, change-of-use
- **Every entity filing** — LLC formations, dissolutions, registered-agent changes
- **AI-scored opportunities** ranked 0–100 by signal strength (estate disposition, distress, vacancy proxy, comp spread, etc.)
- **Personalized outreach drafts** for the highest-scoring leads
- **Territory radar map** with live activity overlay

All filtered to your exact counties, property types, and deal size ranges. All for **$299/month** instead of $1,500.

<br />

## Features

<table>
<tr>
<td width="50%" valign="top">

### Built for wow

- **`⌘K` command palette** — jump to any page, property, or AI action instantly
- **AI co-pilot** (`⌘J`) — ask anything about your market with mocked streaming responses
- **Live notifications panel** (`⌘I`) — real-time alerts with categorized signals
- **Animated signal ticker** — see the market pulse update in real time on the dashboard
- **ROI calculator** — model your revenue lift with live sliders on the landing page

</td>
<td width="50%" valign="top">

### Intelligence layer

- **AI opportunity scoring** with explainable factor breakdown
- **Daily AI briefing** in digest + deep-dive modes
- **Outreach draft generation** with property context
- **Score gauges** with strength tier (Exceptional / Strong / Moderate)
- **Mock fallbacks** for every AI route — works without an OpenAI key
- **Comparison table** vs CoStar / Reonomy / Crexi on the landing page

</td>
</tr>
<tr>
<td width="50%" valign="top">

### Design system

- Custom **"Signal Intelligence" aesthetic** — cosmic violet × cyan palette
- 25+ reusable design tokens (CSS variables)
- Glass-morphism cards with shimmer borders
- Tabular monospace numerics for data density
- Reduced-motion support out of the box
- Radar-sweep territory map (SVG, no API key required)
- Toast system with welcome hint
- Marquee live tickers with fade-edge masks

</td>
<td width="50%" valign="top">

### Production-ready foundation

- **Next.js 16** App Router + Turbopack with TypeScript
- **Prisma v7** + PostgreSQL (with the new `adapter-pg` pattern)
- **NextAuth v5** beta (Credentials + Google OAuth)
- **Demo mode** bypasses DB & auth — `DEMO_MODE=true`, any creds work
- **Docker Compose** included for one-command Postgres
- **22 routes** — 9 pages, 9 API endpoints, all building clean

</td>
</tr>
</table>

<br />

## Quick Start (Demo Mode)

No database, no API keys, no setup — just run.

```bash
git clone https://github.com/vineetsista/Darkmile.git
cd Darkmile
npm install
cp .env.example .env.local
npm run dev
```

Open **http://localhost:3000** and sign in with **any** email/password — demo mode is enabled by default.

> **Want to use real AI?** Drop your `OPENAI_API_KEY` into `.env.local` and the AI routes will switch from mock responses to live GPT-4o-mini calls.

<br />

## Full Setup (with Postgres)

```bash
# 1. Spin up Postgres
docker compose up db -d

# 2. Apply schema and seed Franklin County demo data
npm run db:push
npm run db:seed

# 3. Run dev server
npm run dev
```

Demo credentials after seeding: `marcus@webbcommercial.com` / `demo1234`

<br />

## Screenshots

### Landing
<img src=".github/screenshots/01-landing-hero.png" alt="Landing — hero, live signal ticker, particle field" width="100%" />

| ROI Calculator | Comparison vs CoStar / Reonomy / Crexi |
|---|---|
| <img src=".github/screenshots/02-landing-roi.png" alt="ROI calculator with live sliders" /> | <img src=".github/screenshots/03-landing-compare.png" alt="Feature comparison table" /> |

### Dashboard
<img src=".github/screenshots/05-dashboard-home.png" alt="Dashboard home with live ticker, metrics, market pulse" width="100%" />

| `⌘K` Command Palette | AI Co-pilot | Notifications |
|---|---|---|
| <img src=".github/screenshots/11-command-palette.png" alt="Command palette with grouped results" /> | <img src=".github/screenshots/12-ai-copilot.png" alt="AI co-pilot floating chat" /> | <img src=".github/screenshots/13-notifications.png" alt="Sliding notifications panel" /> |

| Opportunities | Deal Flow | Territory Radar Map |
|---|---|---|
| <img src=".github/screenshots/06-dashboard-opportunities.png" alt="Scored opportunities with gauges + outreach" /> | <img src=".github/screenshots/07-dashboard-deals.png" alt="Deal flow grid + filters" /> | <img src=".github/screenshots/08-dashboard-map.png" alt="Radar-sweep territory map" /> |

| Daily Briefing | Analytics | Sign In |
|---|---|---|
| <img src=".github/screenshots/09-dashboard-briefing.png" alt="Daily AI briefing with score gauges" /> | <img src=".github/screenshots/10-dashboard-analytics.png" alt="Market analytics dashboard" /> | <img src=".github/screenshots/04-signin.png" alt="Sign in split-screen" /> |

<br />

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) | Edge-ready, file-based routing, RSC streaming |
| **Language** | TypeScript 5 | Type-safe across UI + API + DB |
| **Styling** | Tailwind CSS v4 + CSS variables | Utility-first with design tokens for theme cohesion |
| **Database** | PostgreSQL + Prisma ORM v7 | Type-safe queries; v7's `adapter-pg` pattern |
| **Auth** | NextAuth v5 beta | Credentials + Google OAuth, JWT sessions |
| **AI** | OpenAI GPT-4o-mini | Fast + cheap for scoring, narrative, outreach |
| **Charts** | Recharts | Composable React charts on top of D3 |
| **Email** | Resend + React Email | Beautiful HTML briefings |
| **Map** | Mapbox GL (with SVG fallback) | Live territory visualization |
| **Deploy** | Vercel / Docker | Both supported out of the box |

<br />

## Architecture

```
darkmile/
├── app/                       Next.js App Router
│   ├── page.tsx                 Marketing landing page
│   ├── auth/                    Sign in, sign up, onboarding wizard
│   ├── dashboard/               Authenticated app shell
│   │   ├── layout.tsx             Sidebar + topbar + ⌘K + AI + notifs
│   │   ├── page.tsx               Dashboard home + live ticker
│   │   ├── briefing/              Daily AI briefing
│   │   ├── deals/                 Deal flow (grid + table)
│   │   ├── opportunities/         Scored opps + outreach modal
│   │   ├── map/                   Radar-sweep territory map
│   │   ├── watchlist/             Tracked properties with triggers
│   │   ├── analytics/             Market charts (Recharts)
│   │   └── settings/              Profile · Territory · Billing · API
│   └── api/                     Route handlers
│       ├── ai/{score,insight,outreach}   AI routes (with mock fallbacks)
│       ├── auth/[...nextauth]            Auth handler
│       └── {properties,deals,…}          REST endpoints
├── components/                Cross-cutting UI
│   ├── CommandPalette.tsx       ⌘K with grouped, keyboard-navigable results
│   ├── AICopilot.tsx            Floating chat panel with typing animation
│   ├── NotificationsPanel.tsx   Sliding alerts inbox
│   └── Toast.tsx                Provider + welcome hint
├── lib/                       Domain logic
│   ├── ai.ts                    OpenAI client + prompt builders + mocks
│   ├── auth.ts                  NextAuth config
│   ├── db.ts                    Prisma client singleton
│   ├── mock-data.ts             15 properties, 10 txns, 7 permits, 6 filings
│   └── utils.ts                 Formatting, scoring, color helpers
└── prisma/
    ├── schema.prisma            14 models — Property, Transaction, Permit, …
    └── seed.ts                  Franklin County demo data seed
```

<br />

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl K` | Open command palette |
| `⌘J` / `Ctrl J` | Toggle AI co-pilot |
| `⌘I` / `Ctrl I` | Toggle notifications panel |
| `↑ ↓` + `↵` | Navigate / select in palette |
| `Esc` | Close any overlay |

<br />

## Design Tokens

The "Signal Intelligence" palette is exposed as CSS variables in `app/globals.css`:

```css
--void:    #06040A    /* Background */
--deep:    #0D0A14    /* Surface */
--violet:  #8B5CF6    /* Primary accent */
--cyan:    #06B6D4    /* Secondary accent */
--amber:   #F59E0B    /* Opportunity flag */
--emerald: #10B981    /* Success / live */
--rose:    #F43F5E    /* Warning */
```

All component styles use these variables — change a single token and the whole product re-themes.

<br />

## Environment Variables

Copy `.env.example` to `.env.local` and configure as needed. Everything except `DATABASE_URL` is optional in demo mode.

```ini
# Database (required when DEMO_MODE=false)
DATABASE_URL="postgresql://user:pass@localhost:5432/darkmile"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate via: openssl rand -base64 32"

# Demo mode — when true, bypasses DB & auth, any credentials work
DEMO_MODE=true

# Optional integrations
OPENAI_API_KEY=""              # AI routes fall back to mock responses
GOOGLE_CLIENT_ID=""            # Google OAuth (optional)
GOOGLE_CLIENT_SECRET=""
RESEND_API_KEY=""              # Email briefings (optional)
NEXT_PUBLIC_MAPBOX_TOKEN=""    # SVG fallback shown without this
```

<br />

## Available Scripts

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm start            # Run built app
npm run lint         # ESLint
npm run db:push      # Apply Prisma schema to DB
npm run db:seed      # Seed Franklin County demo data
npm run db:studio    # Launch Prisma Studio
npm run db:generate  # Regenerate Prisma client
```

<br />

## Roadmap

- [x] Daily AI briefing — digest + deep-dive views
- [x] Opportunity scoring 0–100 with factor breakdown
- [x] Outreach draft generation
- [x] Watchlist with trigger alerts
- [x] Territory radar map (SVG)
- [x] `⌘K` command palette
- [x] AI co-pilot chat
- [x] Live notifications panel
- [x] ROI calculator on landing
- [x] Comparison table vs CoStar / Reonomy / Crexi
- [ ] Real-time WebSocket signal stream
- [ ] PDF briefing export (button → actual PDF)
- [ ] Multi-county map clustering
- [ ] CRM sync (Salesforce, HubSpot)
- [ ] Slack / Email digest channels
- [ ] Mobile responsive auth flow improvements

<br />

## Contributing

This is a personal project, but ideas, bug reports, and PRs are welcome. Open an issue and let's chat.

<br />

## License

MIT © Vineet Sista — see [LICENSE](LICENSE) for details.

<br />

## Acknowledgements

- [Next.js](https://nextjs.org) for the framework
- [Recharts](https://recharts.org), [Lucide Icons](https://lucide.dev), [Radix UI](https://radix-ui.com) for great primitives
- [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) by Rodrigo Fuenzalida for the editorial display font

<br />

<div align="center">

**Built for independent CRE brokers · Franklin County, OH and beyond**

<sub>If this project resonates, please consider giving it a ⭐ on GitHub.</sub>

</div>
