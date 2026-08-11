# PEER'S CHARITY
> **"Give a Note. Get a Note. Save a Semester."**  
> *"We don't sell notes. We perform academic charity."*

---

## 📚 Project Overview
**Peer's Charity** is a university-focused academic resource sharing platform built with Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Express.js, Node.js, MongoDB, Mongoose, and Better Auth.

Students can discover, evaluate, rate, bookmark, and donate verified academic resources (lecture notes, past exam questions, solved problem sets, cheat sheets, presentations). The platform utilizes a non-monetary, reputation-driven gamification ecosystem ("Generosity Olympics", "Charity Points", "Charity Circle") to encourage altruistic educational support.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **System Admin** | `admin@university.edu` | `password123` | Full Governance, Vault Queue & Moderation |
| **Nayem (User)** | `nayem@student.university.edu` | `password123` | Academic Benefactor & Student Profile |

---

## 🚀 Key Features

- **Charity HQ (Dashboard):** Personalized hub featuring course enrollment, academic pantry health gauges, contribution metrics, and recommendations.
- **Charity Bazaar (Discovery):** Catalog discovery with multi-filter search (university, course, resource type, rating), sort controls, and grid/list views.
- **Academic Pantry (`/pantry` & `/pantry/[courseId]`):** Structured course library featuring coverage percentage metrics (Lecture Notes 94%, Exam Questions 86%, Lab Materials 65%) and Pantry Health.
- **Donate Knowledge (Upload Wizard):** 4-step upload wizard with client MIME/extension validation and SHA-256 cryptographic file hash deduplication ("Hold your horses, fellow philanthropist...").
- **Exam Emergency Room (`/exam`):** High-yield exam revision portal filtering past questions, solved problems, cheat sheets, and historical topic frequency signals.
- **Resource Quality Score (RQS):** Confidence-weighted Bayesian score (0–100) combining ratings, unique download volume, bookmark count, recency, and community report flags.
- **Charity Card (Benefactor Profile):** Public profile with cover banner, verification badge, reputation metrics bar, and 5 interactive tabs (Donations, Achievements & Badges, Peer Reviews, Charity Circle, Contribution Trail).
- **Charity Headquarters (Admin & Police):** Governance dashboard with Donation Vault review queue, Charity Police content moderation, and administrative audit logs.
- **Better Auth Integration:** Centralized authentication mounted authoritatively on Express (`/api/auth/*`) supporting credentials, sessions, and role authorization.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js, TypeScript, Better Auth Server |
| **Database** | MongoDB 7.0+ (Local Community Server / MongoDB Atlas), Mongoose 8.x ODM |
| **Auth** | Better Auth React Client & Express Node Adapter |
| **Storage** | StorageService abstraction (Local Dev Storage / S3 / Cloudflare R2) |

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
