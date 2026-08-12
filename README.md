<div align="center">

# PEER'S CHARITY

### Give a Note. Get a Note. Save a Semester.

*We don't sell notes. We perform academic charity.*

[![Live Site](https://img.shields.io/badge/Live_Site-GitHub_Pages-181717?style=for-the-badge&logo=github)](https://asnayem1122.github.io/Peers_Charity/)
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

</div>

---

## 📚 About

**Peer's Charity** is a full-stack academic resource sharing platform where university students help each other survive semesters by donating, discovering, and rating study materials — handwritten notes, lecture slides, past exam questions, solved problem sets, cheat sheets, and external educational links.

The platform operates on a **non-monetary, reputation-driven gamification ecosystem** — students earn **Charity Points**, unlock **badges**, climb the **Generosity Leaderboard**, and build their **Charity Card** profile as recognized academic benefactors.

> **🔗 Live Demo:** [asnayem1122.github.io/Peers_Charity](https://asnayem1122.github.io/Peers_Charity/)

---

## ✨ Key Features

### 🏠 Landing & Public Discovery
- **Public Browsing Without Login** — Unauthenticated guests can search, filter, browse, and preview educational resources across `/bazaar`, `/pantry`, `/exam`, `/leaderboard`, and `/hq`. Account login is required only for contributing actions (downloading, saving, rating, uploading, reporting).
- **Interactive Constellation Grid** — Animated canvas background with dynamic node connections that respond to cursor movement; auto-detects light/dark mode per frame.
- **Academic Protocol Flow** — Pinned step cards with animated SVG connecting paths showing the donate → verify → earn → access → save workflow.
- **Liquid Metal Button System** — Premium dark obsidian buttons with iridescent chrome rim gradients (`conic-gradient`), specular top-edge highlights, and animated diagonal sheen sweep on hover.

### 📖 Academic Modules
| Module | Route | Description |
|--------|-------|-------------|
| **Charity HQ** | `/hq` | Personalized dashboard with course enrollment, pantry health gauges, and contribution metrics |
| **Charity Bazaar** | `/bazaar` | Public resource discovery catalog with 25+ items, multi-filter search, sort controls, and grid/list views |
| **Academic Pantry** | `/pantry` | Structured course library (CSE 2103, CSE 3101, CSE 3205) with 85%+ coverage metrics and nested course detail pages |
| **Exam Emergency Room** | `/exam` | High-yield exam revision portal with emergency packs and one-click download buttons |
| **Generosity Leaderboard** | `/leaderboard` | Ranked benefactor standings with Gold 🥇, Silver 🥈, Bronze 🥉 badges, Charity Points, and Trust Scores |
| **Treasure Vault** | `/treasure` | Bookmarked and saved resources collection |
| **Donate Knowledge** | `/donate` | 4-step upload wizard with 4 core resource types, display identity options, and SHA-256 hash deduplication |

### 🕵️ Anonymous Sharing & Public Display Identity
- **Flexible Identity Options** — Uploaders can select how their identity appears on public cards:
  - `○ My Profile`: Displays real name and academic level/term (e.g. *Nayem (Level 3 / Term 2)*)
  - `○ Share Anonymously`: Publicly displays *"Shared Anonymously"* to peer scholars
  - `○ Custom Display Name`: Displays a custom pseudonym (e.g. *AlgoNinja_42*)
- **Admin Moderation Integrity** — Anonymous public display does **NOT** hide uploader identity from administrators (`/admin`). Admins see real uploader emails even for anonymous posts.

### 📁 4 Core Resource Formats & Preview Modal
- **Supported Formats**: `Notes`, `Slides`, `PDF`, and `External Link`.
- **Resource Detail Modal (`components/ui/resource-detail-modal.tsx`)**:
  - Displays description, tags, quality rating, download/bookmark counts.
  - Interactive **Inline Text & PDF Simulator** or **External Link Launcher**.
  - Student peer review section with 1–5 star rating submission form.

### 🎓 Level & Term System
- **Dedicated Level & Term Badge** — Each student's Charity Card profile displays a high-contrast `LEVEL & TERM: Level 3 / Term 2` badge.
- **Structured Selector** — Profile editor features a dropdown select with all combinations from `Level 1 / Term 1` through `Level 4 / Term 2` and `Faculty Admin`.
- **Scoped Notifications** — Notification events are dynamically filtered to match the student's enrolled Level & Term.

### 🔐 Auth & Access Control
- **Dynamic Auth State** — Header, topbar, sidebar, and mobile bottom nav react dynamically to login state (Sign In ↔ Enter HQ / Profile).
- **Guest Auth Modal** — Attempting protected actions as a guest launches `GuestAuthModal` with login credentials hint.
- **Role-Based Admin Guard** — `/admin` enforces `user.role === 'ADMIN'` check; non-admin students see a "System Admin Access Required" guard with admin credential hints.
- **Charity Card Profile** — Public benefactor profile with reputation metrics, interactive tabs (Donations, Achievements, Peer Reviews, Charity Circle, Contribution Trail), and avatar gallery.

### 🛡️ Admin Governance & Resource Moderation
- **Resource Reports Queue** (`/admin`) — Moderation queue for reported resources (copyright concerns, incorrect info, spam, inappropriate content) with real uploader tracking.
- **Interactive Resolution** — *Delete & Issue Warning* or *Dismiss Report* buttons with real-time queue updates.
- **Donation Vault Review** — Approve & Publish or Quarantine pending uploads with real-time counter updates.
- **Fresh Installation State Reset** — Topbar `RotateCcw` button and `resetAllUserData()` helper to restore fresh installation state.

### 🎨 Design System
- **OLED Monochrome Theme** — Pure white (`#ffffff`) light mode and deep OLED black (`#09090b`) dark mode with `localStorage` persistence.
- **Glassmorphism Panels** — Translucent `backdrop-blur-2xl` frosted glass cards with ambient glow orbs.
- **Liquid Metal Buttons** — Multi-layered metallic chrome rim gradient (`conic-gradient`), specular top-edge highlights (`inset 0 1px 2px rgba(255,255,255,0.75)`), dark obsidian gradient core, and animated diagonal sweep sheen on hover.
- **Geist Typography** — Apple SF Pro Display / Geist monochrome font stack with `-webkit-font-smoothing: antialiased`.

---

## 🔑 Demo Credentials

| Role | Email | Password | Permissions & Features |
|------|-------|----------|------------------------|
| **System Admin** | `admin@university.edu` | `password123` | Full Governance Access, Resource Reports Moderation, Vault Review, Real Uploader Tracking |
| **Student User** | `nayem@student.university.edu` | `password123` | Upload Notes (+10 pts), Earn Badges, Choose Anonymous Display Identity, Level 3 / Term 2 |

---

## 🛠️ Tech Stack

### Frontend — `apps/web`
| Technology | Purpose |
|-----------|---------|
| **Next.js 14** (App Router) | React framework with static export (`output: 'export'`) |
| **React 18** | UI component library |
| **TypeScript** | Type safety across component props and state |
| **Tailwind CSS 3** | Utility-first styling with custom CSS variables |
| **Lucide React** | Modern SVG icon system |
| **Motion (Framer Motion)** | Kinetic animations and SVG path transitions |
| **Better Auth** | Client-side auth context & state management |

### Backend — `apps/api`
| Technology | Purpose |
|-----------|---------|
| **Node.js + Express 4** | REST API server |
| **TypeScript** | Type safety across controllers and middleware |
| **MongoDB + Mongoose 8** | NoSQL database and schema ODM |
| **Better Auth** | Server-side auth adapter |
| **Multer** | File upload handling |
| **Zod** | Schema validation |
| **Helmet + CORS** | Security headers and cross-origin resource sharing |

### Infrastructure & CI/CD
| Technology | Purpose |
|-----------|---------|
| **GitHub Actions** | Automated CI/CD build & deploy pipeline (`.github/workflows/deploy.yml`) |
| **GitHub Pages** | Static frontend hosting at `/Peers_Charity` base path |
| **npm Workspaces** | Monorepo package management |

---

## 📁 Project Structure

```
peers-charity/
├── apps/
│   ├── web/                          # Next.js 14 Frontend
│   │   ├── app/
│   │   │   ├── page.tsx              # Landing page (hero, constellation grid, protocol flow)
│   │   │   ├── globals.css           # Theme variables, glassmorphism, liquid metal buttons
│   │   │   ├── layout.tsx            # Root layout with meta tags
│   │   │   ├── (auth)/
│   │   │   │   ├── login/            # Sign in page
│   │   │   │   └── register/         # Registration with avatar gallery
│   │   │   └── (dashboard)/
│   │   │       ├── layout.tsx        # Dashboard shell (sidebar + topbar + bottom nav)
│   │   │       ├── hq/               # Charity HQ dashboard
│   │   │       ├── bazaar/           # Resource discovery catalog (25+ seed items)
│   │   │       ├── pantry/           # Course library + [courseId] detail
│   │   │       ├── exam/             # Exam emergency room
│   │   │       ├── donate/           # Upload wizard (4 formats + anonymous options)
│   │   │       ├── leaderboard/      # Generosity rankings
│   │   │       ├── treasure/         # Saved resources vault
│   │   │       ├── profile/          # Charity Card profile with Level & Term
│   │   │       └── admin/            # Admin governance HQ (reports & real uploader tracking)
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── constellation-grid.tsx   # Interactive canvas background
│   │   │   │   ├── how-it-works.tsx         # Protocol flow step cards
│   │   │   │   ├── liquid-metal-button.tsx  # Reusable Liquid Metal button component
│   │   │   │   ├── resource-detail-modal.tsx# Preview, review & download modal
│   │   │   │   ├── report-resource-modal.tsx# Resource report modal
│   │   │   │   ├── guest-auth-modal.tsx     # Guest action auth prompt modal
│   │   │   │   └── about-project-modal.tsx  # Portfolio & about platform modal
│   │   │   └── layout/
│   │   │       ├── Sidebar.tsx        # Desktop sidebar navigation
│   │   │       ├── Topbar.tsx         # Top bar with auth state, notifications & reset button
│   │   │       └── MobileBottomNav.tsx # Mobile bottom navigation
│   │   ├── lib/
│   │   │   ├── resources-data.ts      # Unified 25+ catalog, review & report state helpers
│   │   │   ├── auth-context.tsx       # Auth provider with levelTerm support
│   │   │   └── constants.ts           # Product terminology map
│   │   ├── next.config.mjs            # Static export + basePath config
│   │   └── tailwind.config.js         # Theme color mappings
│   │
│   └── api/                          # Express.js Backend
│       └── src/
│           ├── server.ts             # Entry point
│           ├── app.ts                # Express app setup
│           ├── seed.ts               # Database seeder with demo accounts
│           ├── auth/                 # Better Auth configuration
│           ├── config/               # Database connection
│           ├── controllers/          # Route handlers
│           ├── middleware/           # Auth guards, error handling
│           ├── models/              # Mongoose schemas
│           ├── routes/              # API route definitions
│           └── services/            # Business logic
│
├── docs/                             # Technical documentation
├── packages/                         # Shared packages (monorepo)
├── .github/workflows/deploy.yml      # GitHub Pages CI/CD
└── package.json                      # Monorepo root (npm workspaces)
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** 18+ (recommended: 22)
- **MongoDB** 7.0+ (local Community Server or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/asnayem1122/Peers_Charity.git
cd Peers_Charity
npm install
```

### 2. Configure Environment

Create backend environment file:

```bash
cp .env.example apps/api/.env
```

```env
# apps/api/.env
MONGODB_URI=mongodb://localhost:27017/peers-charity
PORT=5000
BETTER_AUTH_SECRET=your-secret-key
```

### 3. Initialize & Seed Database

```bash
# Start MongoDB service (Windows)
net start MongoDB

# Seed demo accounts and initial sample materials
npm run seed --prefix apps/api
```

### 4. Run Local Development Server

```bash
# Concurrently start frontend + backend
npm run dev
```

- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend REST API:** [http://localhost:5000](http://localhost:5000)

### 5. Build for Production

```bash
npm run build:web    # Generates static export in apps/web/out/
npm run build:api    # Compiles TypeScript into apps/api/dist/
```

---

## 🌐 Deployment Pipeline

The frontend automatically builds and deploys to **GitHub Pages** on every push to the `main` branch via GitHub Actions:

1. `.github/workflows/deploy.yml` triggers on `push` to `main`.
2. Runs `npm install` and `npm run build` in `apps/web`.
3. Uploads `./apps/web/out` static artifact and deploys to GitHub Pages.
4. Access live site at **[asnayem1122.github.io/Peers_Charity](https://asnayem1122.github.io/Peers_Charity/)**.

---

## 🔒 Business Rules & Security

| Rule | Implementation |
|------|---------------|
| **Public Discovery** | Unauthenticated guests can search, filter, and preview resources without login |
| **Auth Lock Guards** | Protected actions (download, bookmark, rate, upload, report) prompt `GuestAuthModal` |
| **Anonymous Upload Identity** | Uploaders can select `PROFILE`, `ANONYMOUS`, or `CUSTOM` display identity |
| **Admin Moderation Integrity** | Anonymous public posts still track real uploader ID for admin moderation in `/admin` |
| **4 Core Resource Formats** | Dedicated UI handling for Notes, Slides, PDFs, and External Links |
| **SHA-256 Deduplication** | File hash verification in Step 3 of donate wizard prevents duplicate uploads |
| **Interactive Admin Moderation** | Resource reports and vault approval/quarantine state update counters in real-time |
| **Fresh State Reset** | Topbar `RotateCcw` button and `resetAllUserData()` restore initial installation state |

---

## 📜 License

Distributed under the **MIT License**. Created for Programming Hero Portfolio & Academic Demonstration.

<div align="center">

---

**Built with ❤️ for students who believe in sharing knowledge freely.**

</div>
