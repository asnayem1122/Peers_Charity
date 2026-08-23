<div align="center">

# PEER'S CHARITY

### Give a Note. Get a Note. Save a Semester.

*We don't sell notes. We perform academic charity.*

[![Vercel Deployment](https://img.shields.io/badge/Vercel_App-Live_Platform-000000?style=for-the-badge&logo=vercel)](https://peers-charity-api.vercel.app)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Docs_%26_Demo-181717?style=for-the-badge&logo=github)](https://asnayem1122.github.io/Peers_Charity/)
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

</div>

---

## 📚 About

**Peer's Charity** is a full-stack academic resource sharing platform where university students help each other survive semesters by donating, discovering, and rating study materials — handwritten lecture notes, slides, past exam papers, solved problem sets, cheat sheets, and external educational resources.

The platform operates on a **non-monetary, reputation-driven gamification ecosystem** — students earn **Charity Points**, unlock **badges**, climb the **Generosity Leaderboard**, and build their **Charity Card** profile as recognized academic benefactors.

> **🔗 Production Deployments:**
> - **Primary Web App (Vercel):** [peers-charity-api.vercel.app](https://peers-charity-api.vercel.app)
> - **GitHub Pages:** [asnayem1122.github.io/Peers_Charity](https://asnayem1122.github.io/Peers_Charity/)

---

## ✨ Key Features

### 🏠 Landing & Public Discovery
- **Public Browsing Without Login** — Unauthenticated guests can search, filter, browse, and preview educational resources across `/bazaar`, `/pantry`, `/exam`, `/leaderboard`, and `/hq`. Account login is required only for contributing actions (downloading, saving, rating, uploading, reporting).
- **Interactive Constellation Grid** — Animated canvas background with dynamic node connections that respond to cursor movement; auto-detects light/dark mode per frame.
- **Academic Protocol Flow** — Pinned step cards with animated SVG connecting paths showing the donate → verify → earn → access → save workflow.
- **Liquid Metal Button System** — Dark obsidian buttons with iridescent chrome rim gradients (`conic-gradient`), specular top-edge highlights, and animated diagonal sheen sweep on hover.

### 📖 Academic Modules
| Module | Route | Description |
|---|---|---|
| **Charity HQ** | `/hq` | Personalized benefactor command center with course coverage gauges and contribution stats |
| **Charity Bazaar** | `/bazaar` | Public resource discovery catalog with multi-filter search, sort controls, and grid/list layouts |
| **Academic Pantry** | `/pantry` | Dynamic course library grouped from genuine uploads with Pantry Health coverage metrics |
| **Exam Emergency Room** | `/exam` | High-yield exam revision portal with emergency packs and dynamic course filters |
| **Generosity Leaderboard** | `/leaderboard` | Dynamic benefactor rankings with Gold 🥇, Silver 🥈, Bronze 🥉 badges, Charity Points, and Trust Scores |
| **Treasure Vault** | `/treasure` | Bookmarked and saved resources collection |
| **Donate Knowledge** | `/donate` | 4-step upload wizard with 4 core resource types, display identity options, and SHA-256 hash deduplication |

### 🕵️ Anonymous Sharing & Public Display Identity
- **Flexible Identity Options** — Uploaders can select how their identity appears on public cards:
  - `○ My Profile`: Displays real name and academic level/term (e.g. *Nayem (Level 3 / Term 2)*)
  - `○ Share Anonymously`: Publicly displays *"Shared Anonymously"* to peer scholars
  - `○ Custom Display Name`: Displays a custom pseudonym (e.g. *AlgoNinja_42*)
- **Admin Moderation Integrity** — Anonymous public display does **NOT** hide uploader identity from administrators (`/admin`). Admins see real uploader emails even for anonymous posts.

### 📁 4 Core Resource Formats & Safe Previews
- **Supported Formats**: `Notes`, `Slides`, `PDF`, and `External Link`.
- **Resource Detail Modal (`components/ui/resource-detail-modal.tsx`)**:
  - Displays description, tags, quality rating, download/bookmark counts.
  - Interactive **Inline Text & Document Viewer** or **Sanitized External Link Launcher**.
  - Student peer review section with 1–5 star rating submission form.

### 🎓 Level & Term System
- **Dedicated Level & Term Badge** — Each student's Charity Card profile displays a high-contrast `LEVEL & TERM: Level 3 / Term 2` badge.
- **Structured Selector** — Profile editor features a dropdown select with all combinations from `Level 1 / Term 1` through `Level 4 / Term 2` and `Faculty Admin`.
- **Scoped Notifications** — Notification events are dynamically filtered to match the student's enrolled Level & Term.

### 🔐 Security & Access Control
- **Strict Role-Based Admin Guard** — The `Charity Headquarters` (`/admin`) navigation item is completely hidden from non-admin accounts. Direct visits auto-redirect to `/hq`.
- **Client Privilege Escalation Protection** — Immutable parameters (`role`, `id`, `email`) cannot be tampered with via profile update actions.
- **Protocol Sanitization (Anti-XSS)** — External link submissions strictly validate `http://` and `https://` protocols, preventing JavaScript URI injection.
- **Storage Security** — Explicit file extension allowlists (`.pdf`, `.docx`, `.doc`, `.pptx`, `.ppt`, `.zip`, `.png`, `.jpg`, `.jpeg`, `.txt`) prevent arbitrary file execution.

---

## 🛠️ Tech Stack

### Frontend — `apps/web`
| Technology | Purpose |
|---|---|
| **Next.js 14** (App Router) | React framework with static export (`output: 'export'`) |
| **React 18** | UI component library |
| **TypeScript** | Type safety across component props and state |
| **Tailwind CSS 3** | Utility-first styling with custom CSS variables |
| **Lucide React** | Modern SVG icon system |
| **Motion (Framer Motion)** | Kinetic animations and SVG path transitions |
| **Better Auth** | Client-side auth context & state management |

### Backend — `apps/api`
| Technology | Purpose |
|---|---|
| **Node.js + Express 4** | REST API server |
| **TypeScript** | Type safety across controllers and middleware |
| **MongoDB + Mongoose 8** | NoSQL database and schema ODM |
| **Better Auth** | Server-side auth adapter |
| **Multer** | File upload handling with extension validation |
| **Zod** | Schema validation |
| **Helmet + CORS** | Security headers and cross-origin resource sharing |

---

## 📁 Project Structure

```
peers-charity/
├── apps/
│   ├── web/                          # Next.js 14 Frontend
│   │   ├── app/
│   │   │   ├── page.tsx              # Landing page (hero, constellation grid, protocol flow)
│   │   │   ├── globals.css           # Theme variables, glassmorphism, liquid metal buttons
│   │   │   ├── layout.tsx            # Root layout with metadata
│   │   │   ├── (auth)/
│   │   │   │   ├── login/            # Sign in page
│   │   │   │   └── register/         # Registration with avatar gallery
│   │   │   └── (dashboard)/
│   │   │       ├── layout.tsx        # Dashboard shell (sidebar + topbar + bottom nav)
│   │   │       ├── hq/               # Charity HQ dashboard
│   │   │       ├── bazaar/           # Dynamic resource discovery catalog
│   │   │       ├── pantry/           # Dynamic course library + [courseId] detail
│   │   │       ├── exam/             # Exam emergency room
│   │   │       ├── donate/           # Upload wizard (4 formats + anonymous options)
│   │   │       ├── leaderboard/      # Generosity rankings
│   │   │       ├── treasure/         # Saved resources vault
│   │   │       ├── profile/          # Charity Card profile with Level & Term
│   │   │       └── admin/            # Admin governance HQ (protected)
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
│   │   │       ├── Topbar.tsx         # Top bar with auth state & notifications
│   │   │       └── MobileBottomNav.tsx # Mobile bottom navigation
│   │   ├── lib/
│   │   │   ├── resources-data.ts      # Catalog, review & report state helpers
│   │   │   ├── auth-context.tsx       # Auth provider with levelTerm support
│   │   │   └── constants.ts           # Product terminology map
│   │   ├── next.config.mjs            # Static export config
│   │   └── tailwind.config.js         # Theme color mappings
│   │
│   └── api/                          # Express.js Backend
│       └── src/
│           ├── server.ts             # Entry point
│           ├── app.ts                # Express app setup
│           ├── seed.ts               # Database seeder
│           ├── auth/                 # Better Auth configuration
│           ├── config/               # Database connection
│           ├── controllers/          # Route handlers
│           ├── middleware/           # Auth guards, error handling
│           ├── models/              # Mongoose schemas
│           ├── routes/              # API route definitions
│           └── services/            # Business logic & storage
│
├── docs/                             # Technical documentation
├── packages/                         # Shared packages (monorepo)
├── .github/workflows/deploy.yml      # CI/CD pipeline
└── package.json                      # Monorepo root (npm workspaces)
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** 18+ (recommended: 20+)
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

### 3. Run Local Development Server

```bash
# Concurrently start frontend + backend
npm run dev
```

- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend REST API:** [http://localhost:5000](http://localhost:5000)

### 4. Build for Production

```bash
npm run build:web    # Generates static export in apps/web/out/
npm run build:api    # Compiles TypeScript into apps/api/dist/
```

---

## 📜 License

Distributed under the **MIT License**. Created for Academic Portfolio & Demonstration.

<div align="center">

---

**Built with ❤️ for students who believe in sharing knowledge freely.**

</div>
