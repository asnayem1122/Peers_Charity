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

**Peer's Charity** is a full-stack academic resource sharing platform where university students help each other survive semesters by donating, discovering, and rating study materials — lecture notes, past exam questions, solved problem sets, cheat sheets, and presentations.

The platform runs on a **non-monetary, reputation-driven gamification ecosystem** — students earn **Charity Points**, unlock **badges**, climb the **Generosity Leaderboard**, and build their **Charity Card** profile as recognized academic benefactors.

> **🔗 Live:** [asnayem1122.github.io/Peers_Charity](https://asnayem1122.github.io/Peers_Charity/)

---

## ✨ Key Features

### 🏠 Landing Experience
- **Interactive Constellation Grid** — Animated canvas background with dynamic node connections that respond to cursor movement; auto-detects light/dark mode per frame.
- **Academic Protocol Flow** — Pinned step cards with animated SVG connecting paths showing the donate → verify → earn → access → save workflow.
- **Responsive Mobile Navigation** — Hamburger slide-down menu on phones with grid-layout nav items.

### 📖 Academic Modules
| Module | Route | Description |
|--------|-------|-------------|
| **Charity HQ** | `/hq` | Personalized dashboard with course enrollment, pantry health gauges, and contribution metrics |
| **Charity Bazaar** | `/bazaar` | Resource discovery catalog with multi-filter search, sort controls, and grid/list views |
| **Academic Pantry** | `/pantry` | Structured course library with coverage percentage metrics and nested course detail pages |
| **Exam Emergency Room** | `/exam` | High-yield exam revision portal filtering past questions, solved problems, and topic frequency signals |
| **Generosity Leaderboard** | `/leaderboard` | Ranked benefactor standings with Charity Points, badges, and contribution streaks |
| **Treasure Vault** | `/treasure` | Bookmarked and saved resources collection |
| **Donate Knowledge** | `/donate` | 4-step upload wizard with SHA-256 cryptographic file hash deduplication |

### 🔐 Auth & Access
- **Dynamic Auth State** — Header, topbar, and mobile bottom nav react dynamically to login state (Sign In ↔ Enter HQ / Profile).
- **Public Guest Browsing** — HQ, Bazaar, Pantry, Exam Room, and Leaderboard accessible without login.
- **Protected Actions** — Donation uploads, profile editing, and admin actions require authentication.
- **Charity Card Profile** — Public benefactor profile with reputation metrics, interactive tabs (Donations, Achievements, Peer Reviews, Charity Circle, Contribution Trail).

### 🛡️ Admin & Moderation
- **Admin HQ** (`/admin`) — Governance dashboard with Donation Vault review queue, Content Moderation, and audit logs.
- **Flagging System** — Students flag suspicious notes; admins approve, quarantine, or delete.

### 🎨 Design System
- **OLED Monochrome Theme** — Pure white (`#ffffff`) light mode and deep OLED black (`#09090b`) dark mode with `localStorage` persistence.
- **Glassmorphism Panels** — Translucent `backdrop-blur-2xl` frosted glass cards with ambient glow orbs.
- **Geist Typography** — Apple SF Pro Display / Geist monochrome font stack with `-webkit-font-smoothing: antialiased`.
- **Theme Toggle** — ☀️ / 🌙 button in header with smooth CSS transitions.

---

## 🔑 Demo Credentials

| Role | Email | Password | Permissions & Features |
|------|-------|----------|------------------------|
| **System Admin** | `admin@university.edu` | `password123` | Full Governance Access, Moderation Queue, 1000 Charity Points, 5.0 Trust Score |
| **Student User** | `nayem@student.university.edu` | `password123` | Upload Study Notes (+10 pts per upload), Earn Badges, Track Contributions |

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
│   │   │   ├── globals.css           # Theme variables, glassmorphism, typography
│   │   │   ├── layout.tsx            # Root layout with meta tags
│   │   │   ├── (auth)/
│   │   │   │   ├── login/            # Sign in page
│   │   │   │   └── register/         # Registration with avatar gallery
│   │   │   └── (dashboard)/
│   │   │       ├── layout.tsx        # Dashboard shell (sidebar + topbar + bottom nav)
│   │   │       ├── hq/               # Charity HQ dashboard
│   │   │       ├── bazaar/           # Resource discovery catalog
│   │   │       ├── pantry/           # Course library + [courseId] detail
│   │   │       ├── exam/             # Exam emergency room
│   │   │       ├── donate/           # Upload wizard
│   │   │       ├── leaderboard/      # Generosity rankings
│   │   │       ├── treasure/         # Saved resources vault
│   │   │       ├── profile/          # Charity Card profile
│   │   │       └── admin/            # Admin governance HQ
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── constellation-grid.tsx   # Interactive canvas background
│   │   │   │   └── how-it-works.tsx         # Protocol flow step cards
│   │   │   └── layout/
│   │   │       ├── Sidebar.tsx        # Desktop sidebar navigation
│   │   │       ├── Topbar.tsx         # Top navigation bar with auth state
│   │   │       └── MobileBottomNav.tsx # Mobile bottom navigation
│   │   ├── lib/                       # Auth context, utilities
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

## 📖 Architecture & Documentation

Comprehensive system design, security policies, and schema documents are stored in [`docs/`](./docs/):

| Document | Link | Focus Area |
|----------|------|------------|
| Product Specifications | [`PROJECT_SPEC.md`](./docs/PROJECT_SPEC.md) | Platform goals, functional & non-functional requirements |
| Architecture Guide | [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | System components, data pipelines, module structure |
| Database Schemas | [`DATABASE.md`](./docs/DATABASE.md) | MongoDB collections, indexes, and entity relations |
| REST API Reference | [`API.md`](./docs/API.md) | Endpoints, payload validation, status codes |
| Design System | [`DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md) | OLED monochrome tokens, glassmorphism specs |
| Security Policy | [`SECURITY.md`](./docs/SECURITY.md) | Auth guards, CORS, deduplication security |
| Deployment Guide | [`DEPLOYMENT.md`](./docs/DEPLOYMENT.md) | GitHub Actions workflow & static export pipeline |
| Feature Roadmap | [`ROADMAP.md`](./docs/ROADMAP.md) | Future enhancements & upcoming milestones |

---

## 📜 License

Distributed under the **MIT License**. Created for Programming Hero Portfolio & Academic Demonstration.

<div align="center">

---

**Built with ❤️ for students who believe in sharing knowledge freely.**

</div>
