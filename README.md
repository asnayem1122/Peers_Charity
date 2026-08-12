<![CDATA[<div align="center">

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

## 🖥️ Screenshots

| Landing Page (Dark Mode) | Dashboard HQ |
|:---:|:---:|
| Hero section with constellation grid, glassmorphism cards, and animated protocol flow | Personalized hub with course enrollment, contribution metrics, and recommendations |

---

## ✨ Key Features

### 🏠 Landing Experience
- **Interactive Constellation Grid** — Animated canvas background with dynamic node connections that respond to cursor movement; auto-detects light/dark mode per frame
- **Academic Protocol Flow** — Pinned step cards with animated SVG connecting paths showing the donate → verify → earn → access → save workflow
- **Responsive Mobile Navigation** — Hamburger slide-down menu on phones with grid-layout nav items

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
- **Dynamic Auth State** — Header, topbar, and mobile bottom nav react to login state (Sign In ↔ Enter HQ / Profile)
- **Public Guest Browsing** — HQ, Bazaar, Pantry, Exam Room, and Leaderboard accessible without login
- **Protected Actions** — Donation uploads, profile editing, and admin actions require authentication
- **Charity Card Profile** — Public benefactor profile with reputation metrics, interactive tabs (Donations, Achievements, Peer Reviews, Charity Circle, Contribution Trail)

### 🛡️ Admin & Moderation
- **Admin HQ** (`/admin`) — Governance dashboard with Donation Vault review queue, Charity Police content moderation, and audit logs
- **Flagging System** — Students flag suspicious notes; admins approve, quarantine, or delete

### 🎨 Design System
- **OLED Monochrome Theme** — Pure white (`#ffffff`) light mode and deep OLED black (`#09090b`) dark mode with `localStorage` persistence
- **Glassmorphism Panels** — Translucent `backdrop-blur-2xl` frosted glass cards with ambient glow orbs
- **Geist Typography** — Apple SF Pro Display / Geist monochrome font stack with `-webkit-font-smoothing: antialiased`
- **Theme Toggle** — ☀️ / 🌙 button in header with smooth CSS transitions

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@university.edu` | `password123` |
| **Student** | `nayem@student.university.edu` | `password123` |

> **Admin** has full governance access, 1000 Charity Points, and 5.0 Trust Score.
> **Student** can upload notes (+10 pts per upload), earn badges, and track contributions.

---

## 🛠️ Tech Stack

### Frontend — `apps/web`
| Technology | Purpose |
|-----------|---------|
| **Next.js 14** (App Router) | React framework with static export (`output: 'export'`) |
| **React 18** | UI component library |
| **TypeScript** | Type safety |
| **Tailwind CSS 3** | Utility-first styling with custom CSS variables |
| **Lucide React** | Icon system |
| **Motion (Framer Motion)** | Animations and SVG path transitions |
| **Better Auth** | Client-side auth context |

### Backend — `apps/api`
| Technology | Purpose |
|-----------|---------|
| **Node.js + Express 4** | REST API server |
| **TypeScript** | Type safety |
| **MongoDB + Mongoose 8** | Database and ODM |
| **Better Auth** | Server-side auth adapter |
| **Multer** | File upload handling |
| **Zod** | Request validation |
| **Helmet + CORS** | Security middleware |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| **GitHub Actions** | CI/CD pipeline (`.github/workflows/deploy.yml`) |
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

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (recommended: 22)
- **MongoDB** 7.0+ (local Community Server or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone & Install

```bash
git clone https://github.com/asnayem1122/Peers_Charity.git
cd Peers_Charity
npm install
```

### 2. Configure Environment

Copy the example env and update with your MongoDB URI:

```bash
cp .env.example apps/api/.env
```

```env
# apps/api/.env
MONGODB_URI=mongodb://localhost:27017/peers-charity
PORT=5000
BETTER_AUTH_SECRET=your-secret-key
```

### 3. Setup Database

```bash
# Start MongoDB (if installed as a Windows service)
net start MongoDB

# Seed demo accounts and sample data
npm run seed --prefix apps/api
```

### 4. Run Development Servers

```bash
# Start both frontend + backend concurrently
npm run dev
```

| Service | URL |
|---------|-----|
| **Frontend** | [http://localhost:3000](http://localhost:3000) |
| **Backend API** | [http://localhost:5000](http://localhost:5000) |

### 5. Build for Production

```bash
npm run build:web    # Static export → apps/web/out/
npm run build:api    # TypeScript compile → apps/api/dist/
```

---

## 🌐 Deployment

The frontend is automatically deployed to **GitHub Pages** on every push to `main`:

1. GitHub Actions runs `npm install` and `npm run build` in `apps/web`
2. The static export (`apps/web/out/`) is uploaded as a Pages artifact
3. Deployed to `https://asnayem1122.github.io/Peers_Charity/`

The `next.config.mjs` is configured with:
```js
{
  output: 'export',
  basePath: '/Peers_Charity',
  assetPrefix: '/Peers_Charity/',
  images: { unoptimized: true }
}
```

---

## 📖 Documentation

Detailed technical specifications are available in the [`docs/`](./docs/) directory:

| Document | Description |
|----------|-------------|
| [`PROJECT_SPEC.md`](./docs/PROJECT_SPEC.md) | Product requirements and feature specifications |
| [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | System architecture and data flow diagrams |
| [`DATABASE.md`](./docs/DATABASE.md) | MongoDB schema design and relationships |
| [`API.md`](./docs/API.md) | REST API endpoint reference |
| [`DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md) | Theme tokens, components, and styling guidelines |
| [`SECURITY.md`](./docs/SECURITY.md) | Authentication, authorization, and security policies |
| [`DEPLOYMENT.md`](./docs/DEPLOYMENT.md) | CI/CD pipeline and hosting configuration |
| [`ROADMAP.md`](./docs/ROADMAP.md) | Planned features and future development |

---

## 📜 License

MIT License — Created for Programming Hero Portfolio & Academic Demonstration.

<div align="center">

---

**Built with ❤️ for students who believe in sharing knowledge freely.**

</div>
]]>
