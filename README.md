# PEER'S CHARITY
> **"Give a Note. Get a Note. Save a Semester."**  
> *"We don't sell notes. We perform academic charity."*

---

## 🌐 Live Application & Repository

- 🔗 **Live Website (GitHub Pages):** [https://asnayem1122.github.io/Peers_Charity/](https://asnayem1122.github.io/Peers_Charity/)
- 💻 **GitHub Repository:** [https://github.com/asnayem1122/Peers_Charity](https://github.com/asnayem1122/Peers_Charity)

---

## 📚 Project Overview
**Peer's Charity** is a university-focused academic resource sharing platform built with Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Express.js, Node.js, MongoDB, Mongoose, and Better Auth.

Students can discover, evaluate, rate, bookmark, and donate verified academic resources (lecture notes, past exam questions, solved problem sets, cheat sheets, presentations). The platform utilizes a non-monetary, reputation-driven gamification ecosystem ("Generosity Olympics", "Charity Points", "Charity Circle") to encourage altruistic educational support.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level & Permissions |
|---|---|---|---|
| **System Admin** | `admin@university.edu` | `password123` | Full Governance, Moderation Queue, 1000 Charity Points, 5.0 Trust Score |
| **Student User** | `nayem@student.university.edu` | `password123` | Academic Benefactor, Upload Notes, Earn Badges & Track Contributions |

---

## 🎭 Role Comparison (Student vs Admin)

| Feature / Capability | 🎓 Student User (e.g. Nayem) | 🛡️ Admin (System Overseer) |
|---|---|---|
| **Primary Goal** | Share & download study notes to pass exams | Moderate quality, review flags & manage platform |
| **Access to Admin HQ (`/admin`)** | ❌ Access Restricted | ✅ Full Access to Moderation Queue & Reports |
| **Donate Knowledge (`/donate`)** | ✅ Upload notes (+10 pts per upload) | ✅ Upload official course materials |
| **Charity Card Profile (`/profile`)** | Student Status (Level 3 / Term 2) | System Overseer Status (5.0 Trust Rating, 1000 pts) |
| **Moderation & Flagging** | Flag suspicious notes for review | Approve, quarantine, or delete reported notes |

---

## 🚀 Key Features

- **🔮 Apple Glassmorphism Design System:** Translucent frosted glass panels (`backdrop-blur-2xl`), ambient glow orbs, and responsive macOS typography smoothing (`-webkit-font-smoothing`).
- **🎨 Warm Sand Beige & Cyber Teal Theme:** Soft cream light mode (`#f5f1e8`) and deep obsidian teal dark mode (`#061316`) with header theme toggle (☀️ / 🌙) and `localStorage` persistence.
- **🔓 Public Guest Browsing:** Public access to HQ, Bazaar, Pantry, Exam Room, and Leaderboard.
- **🔐 Protected Actions & Auth Guards:** Auto-redirects unauthenticated users to `/login` for protected dashboard actions.
- **👤 Profile Dropdown & Logout:** Top-right profile bar displaying user avatar, name, role badge, profile shortcut, and Sign Out button.
- **🎮 Built-in Character Avatar Gallery & PC File Upload:** Upload pictures directly from local PC disk or select official Valorant (Jett, Reyna, Omen, Sage, Phoenix, Chamber) & PC Gaming character logos (Geralt, Kratos, Master Chief, Cyberpunk V).
- **Charity HQ (Dashboard):** Personalized hub featuring course enrollment, academic pantry health gauges, contribution metrics, and recommendations.
- **Charity Bazaar (Discovery):** Catalog discovery with multi-filter search (university, course, resource type, rating), sort controls, and grid/list views.
- **Academic Pantry (`/pantry` & `/pantry/[courseId]`):** Structured course library featuring coverage percentage metrics and Pantry Health.
- **Donate Knowledge (Upload Wizard):** 4-step upload wizard with SHA-256 cryptographic file hash deduplication.
- **Exam Emergency Room (`/exam`):** High-yield exam revision portal filtering past questions, solved problems, cheat sheets, and historical topic frequency signals.
- **Charity Card (Benefactor Profile):** Public profile with reputation metrics bar and interactive tabs (Donations, Achievements & Badges, Peer Reviews, Charity Circle, Contribution Trail).
- **Charity Headquarters (Admin & Police):** Governance dashboard with Donation Vault review queue, Charity Police content moderation, and administrative audit logs.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js, TypeScript, Better Auth Server |
| **Database** | MongoDB 7.0+ (Local Community Server / MongoDB Atlas), Mongoose 8.x ODM |
| **Auth & State** | Client-Side AuthContext with localStorage & Better Auth Express Adapter |
| **CI / CD** | GitHub Actions (`.github/workflows/deploy.yml`) deploying to GitHub Pages |

---

## 💻 Quick Start Guide

### 1. Installation
```bash
npm install
```

### 2. Database Setup (MongoDB Community Server / Atlas)
Ensure MongoDB is running locally or set your `MONGODB_URI` in `apps/api/.env`:
```powershell
# Start local MongoDB (if installed as service)
net start MongoDB

# Seed clean database structure with demo accounts
npm run seed --prefix apps/api
```

### 3. Run Development Application
```bash
npm run dev
```
- **Frontend App:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 📖 Architecture & Documentation
Detailed architectural and technical design specifications are available in the [`docs/`](./docs/) directory:
- [`docs/PROJECT_SPEC.md`](./docs/PROJECT_SPEC.md)
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
- [`docs/DATABASE.md`](./docs/DATABASE.md)
- [`docs/API.md`](./docs/API.md)
- [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md)
- [`docs/SECURITY.md`](./docs/SECURITY.md)
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)
- [`docs/ROADMAP.md`](./docs/ROADMAP.md)

---

## 📜 License
MIT License. Created for Programming Hero Portfolio & Academic Demonstration.
