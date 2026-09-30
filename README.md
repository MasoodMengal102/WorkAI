# WorkAI — International AI Discovery & Workflow Platform

> **"Tell us what you want to accomplish, and we will show you how AI can help."**

WorkAI is a production-grade, full-stack international AI discovery and workflow platform built with Next.js 14 App Router, TypeScript, Tailwind CSS, PostgreSQL, and Prisma. It combines natural-language goal analysis, step-by-step verified workflow pipelines, transparent tool recommendations, objective comparisons, in-depth tutorials, role-specific use cases, and built-in AI utilities.

---

## 🌟 Core Product Features

1. **Natural-Language AI Goal Analyzer (`/api/ai-goal`)**
   - Users describe their objective in plain English (e.g., *"I want to create YouTube videos"* or *"I want to learn Python"*).
   - Extracts structured intent, maps directly to actionable step-by-step workflow pipelines, provides verified free/freemium options, and links built-in AI utilities.
   - Built with deterministic fallback: functions 100% reliably even when external AI API keys are not yet configured.

2. **AI Tool Finder & Recommendation Engine (`/ai-finder`)**
   - Multi-criteria discovery with transparent scoring and zero-hallucination guarantees.
   - Filters by pricing status (Free, Freemium, Paid), platform, commercial use license, and API availability.
   - **Monetization Ethics Rule**: Affiliate tools are **never** ranked higher purely because of commission. Scores reflect verified editorial value and user intent.

3. **Step-by-Step AI Workflows (`/workflows`)**
   - 20 pre-built, production-tested multi-tool workflow pipelines with time estimates, prerequisites, why-it-helps rationale, and copyable prompt templates.

4. **Curated & Verified Tools Catalog (`/tools`)**
   - 50+ thoroughly verified AI tools across 21 categories.
   - Every tool features verified pricing tiers, platform tags, limitations, editorial notes, source links, and verification dates.

5. **Objective Head-to-Head Comparisons (`/compare`)**
   - 10 comprehensive comparison matrices detailing strengths, trade-offs, pricing transparency, and unbiased verdicts.

6. **Role-Specific Use Cases (`/use-cases`)**
   - 15 deep-dive playbooks for Content Creators, Software Engineers, Marketers, Students, Researchers, Small Business Owners, and more.

7. **Educational Guides & Tutorials (`/guides`)**
   - 20 authoritative, step-by-step editorial guides with tables of contents, implementation checklists, and best practices.

8. **15 Built-in AI Utilities (`/ai-services`)**
   - Interactive prompt engines: YouTube Script Generator, SEO Title & Tag Creator, Resume Bullet Point Enhancer, Code Explainer, Email Drafter, and more.
   - Strict API key validation: gracefully informs users when keys are unconfigured without fabricating fake responses.

---

## 🛡️ Business Model & Ethical Integrity Architecture

WorkAI strictly enforces fair, transparent, and compliant operation:

- **100% Free for Users**: No Pro plans, subscriptions, paid credits, or artificial paywalls.
- **Anti-Abuse Rate Limiting**: In-memory rolling rate limiters exist solely to protect server infrastructure and API quotas. Reached limits display polite capacity notices—**never** upsell prompts.
- **Zero Fake Data**:
  - Unconfigured AI providers return clear configuration notices; they **never** return fake mock text claiming to be from the provider.
  - Pricing, commercial use terms, and limitations are verified from official sources.
- **Google AdSense Policy Compliance**:
  - Reusable ad components (`AdSlot`, `TopAd`, `InArticleAd`, `SidebarAd`, `BottomAd`, `ResponsiveAd`).
  - When `ADSENSE_ENABLED=false` (default), ad slots render zero DOM elements—no blank placeholders, reserved spaces, or fake ads.
  - Dynamic, compliant `/ads.txt` route.
- **Affiliate Safety & Non-Deception**:
  - Centralized redirect router at `/go/[id]` resolves only approved database/store IDs.
  - Arbitrary URL redirects are strictly disallowed (immune to open-redirect exploits).
  - Outbound links automatically carry `rel="sponsored nofollow noopener noreferrer"` attributes with explicit disclosures.
- **Privacy & Global Consent**:
  - Dynamic cookie and tracking consent banner (`ConsentBanner.tsx`) supporting acceptance, essential-only cookies, and preference adjustments.

---

## 🎨 Centralized Branding Configuration

Before public launch, the platform brand name, domains, and contact points can be updated from a single central file:

📂 `src/config/brand.ts`

```typescript
export const BRAND_CONFIG = {
  name: "WorkAI",
  shortName: "WorkAI",
  tagline: "Tell Us What You Want To Do With AI",
  description: "The intelligent discovery and workflow platform that turns your goals into actionable AI solutions.",
  primaryDomain: "workai.example.com",
  baseUrl: process.env.BASE_URL || "https://workai.example.com",
  supportEmail: "support@workai.example.com",
  contactEmail: "contact@workai.example.com",
  ...
};
```

---

## 📂 Architecture Domain Structure

```
WorkAI/
├── prisma/
│   └── schema.prisma          # PostgreSQL schema with full relational models
├── scripts/
│   ├── bootstrap-admin.mjs    # Interactive CLI to create initial SUPER_ADMIN
│   └── seed.mjs               # Seeds 50+ tools, 20 workflows, guides, categories
├── src/
│   ├── ai/                    # AI Provider Abstraction (Gemini, OpenAI, Anthropic)
│   │   ├── factory.ts         # Multi-provider runner with automatic failover
│   │   ├── finder.ts          # Deterministic recommendation scoring engine
│   │   ├── goal-analyzer.ts   # Natural-language goal mapping engine
│   │   └── provider.ts        # AIProvider interfaces and error classes
│   ├── app/                   # Next.js 14 App Router
│   │   ├── (auth)/            # /login, /register
│   │   ├── (legal)/           # /about, /privacy, /terms, /affiliate-disclosure, etc.
│   │   ├── admin/             # Audit logs, feedback review, tool verification
│   │   ├── ai-finder/         # Interactive tool discovery wizard
│   │   ├── ai-services/       # Interactive AI service runners
│   │   ├── api/               # Secure route handlers (/ai-goal, /search, /health, etc.)
│   │   ├── categories/        # Dynamic category listings
│   │   ├── compare/           # Tool comparison matrices
│   │   ├── dashboard/         # User dashboard (saved workflows, favorites)
│   │   ├── go/[id]/           # Safe internal redirect gateway
│   │   ├── guides/            # Editorial tutorials
│   │   ├── tools/             # Tool directory and detail pages
│   │   ├── use-cases/         # Role-based guides
│   │   ├── workflows/         # Step-by-step workflow views
│   │   ├── robots.ts          # Dynamic robots.txt
│   │   └── sitemap.ts         # Dynamic sitemap.xml
│   ├── components/            # Reusable UI components
│   │   ├── ads/               # AdSense-compliant ad slots
│   │   ├── home/              # Hero, GoalPrompt, HowItHelps, Features
│   │   ├── layout/            # Header, Footer, ConsentBanner
│   │   ├── tools/             # ToolCard, VerificationBadge
│   │   └── workflows/         # WorkflowCard, WorkflowStepView
│   ├── config/                # Central brand configuration
│   ├── data/                  # Verified offline-resilient datasets (50+ tools, 20 workflows)
│   ├── lib/                   # db.ts (Prisma + Circuit Breaker), auth.ts, rate-limit.ts
│   ├── tests/                 # Vitest unit and integration test suites
│   └── types/                 # Shared TypeScript interfaces
├── render.yaml                # Render Infrastructure-as-Code blueprint
└── vitest.config.ts           # Vitest configuration
```

---

## 🚀 Quickstart & Local Development

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+ (tested on Node v24)
- **npm**: v9+

### 2. Install Dependencies
```bash
npm install
```

### 3. Generate Prisma Client
```bash
npm run db:generate
```

### 4. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

*Note: WorkAI includes an intelligent Circuit Breaker (`src/lib/db.ts`). If PostgreSQL is not running locally, the application automatically falls back to pre-bundled verified code datasets without crashing or hanging.*

### 5. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000`.

### 6. Run Test Suite
```bash
npm run test
```
Executes all 5 Vitest suites covering Goal Analysis, AI Finder scoring, Provider configuration safety, Authentication hashing/JWT, and Rate limiting.

### 7. Run Production Build
```bash
npm run build
```
Typechecks, lints, and compiles all 33 static and dynamic routes.

---

## 🔑 Administrative Setup

### Bootstrap Initial Super Admin
Run the automated CLI bootstrap utility:
```bash
npm run admin:bootstrap admin@workai.internal "YourSecurePassword123!" "Admin Name"
```
Or run interactively:
```bash
npm run admin:bootstrap
```

Log in at `http://localhost:3000/login` to access the Admin Console at `/admin`.

---

## ☁️ Deployment Guide (Render)

WorkAI is pre-configured for automated one-click deployment using Render's Blueprint specification (`render.yaml`).

### Deploying to Render via Blueprint:
1. Push your repository to GitHub or GitLab.
2. In the Render Dashboard, select **New +** → **Blueprint**.
3. Connect your repository. Render will automatically parse `render.yaml` and provision:
   - **Render PostgreSQL Database** (`workai-postgres`)
   - **Render Web Service** (`workai-web`)
4. In the Render Dashboard under Environment Variables, provide your production keys:
   - `AUTH_SECRET`: Generate a random 32+ character string.
   - `OPENAI_API_KEY`, `GEMINI_API_KEY`, or `ANTHROPIC_API_KEY`: Provide at least one API key.
   - `ADSENSE_ENABLED`: Set to `"true"` and supply `ADSENSE_PUBLISHER_ID` when your Google AdSense account is approved.
5. Apply the blueprint. Render executes `npm run db:deploy` followed by `npm run build` and boots the service.
6. Run the seed and admin bootstrap commands from the Render Shell tab:
   ```bash
   npm run db:seed
   npm run admin:bootstrap
   ```

---

## 🔒 Security & Compliance Checklist

- [x] **No Open Redirects**: Outbound traffic routed strictly through validated database records.
- [x] **Strict Content Security**: Custom security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Strict-Transport-Security) enforced in `next.config.mjs`.
- [x] **Sanitized User Inputs**: All natural-language and service inputs sanitized and clamped before processing.
- [x] **Password Protection**: Passwords salted and hashed with `bcryptjs` (salt rounds = 10).
- [x] **Session Security**: JWT session cookies set with `HttpOnly`, `SameSite=Lax`, and `Secure` flags.
- [x] **AdSense Zero Blank Space**: Complies with Google AdSense layout policies when inactive.

---

## 📄 License
Proprietary & Confidential. All rights reserved.
