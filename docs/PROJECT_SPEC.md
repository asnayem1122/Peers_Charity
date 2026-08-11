# PEER'S CHARITY — PROJECT SPECIFICATION

> **Tagline:** "Give a Note. Get a Note. Save a Semester."  
> **Secondary Tagline:** "We don't sell notes. We perform academic charity."

---

## 1. Executive Summary & Vision
**Peer's Charity** is a university-focused, academic resource-sharing SaaS platform designed to foster peer-to-peer educational support. Students can upload, discover, rate, bookmark, and download high-quality academic resources (lecture notes, past exam papers, solved question banks, lab reports, cheat sheets, presentations). 

The platform operates on a **non-monetary, reputation-driven ecosystem** where student contributions ("Donations") earn Charity Points and badges, boosting their status in the community ("Generosity Olympics").

---

## 2. Core Pillars & Product Value
1. **Academic Context & Discovery:** Content organized by University $\rightarrow$ Department $\rightarrow$ Course $\rightarrow$ Semester $\rightarrow$ Teacher $\rightarrow$ Topic.
2. **Quality & Trust:** Multi-faceted Resource Quality Score (RQS), confidence-weighted rating algorithms, exact cryptographic file hash deduplication, and community moderation ("Charity Police").
3. **Emergency Support:** Dedicated "Exam Emergency Room" providing instant access to high-yield past questions, solved problems, and revision notes during exam seasons.
4. **Reputation & Gamification:** Non-exploitable reputation system ("Charity Points", "Charity Circle", custom badges) encouraging altruistic knowledge donation.

---

## 3. Product Terminology & Mapping

| Functional Area | User-Facing Product Term | Description / Scope |
|---|---|---|
| Main User Dashboard | **Charity HQ** | Personalized hub: course shortcuts, stats, recommendations, impact tracking |
| Resource Discovery | **Charity Bazaar** | Search & browse catalog with rich filters (grid/list views) |
| Course Catalog | **Academic Pantry** | Departmental & course library with resource health metrics |
| Upload Workflow | **Donate Knowledge** | Multi-step wizard for document uploading and metadata tagging |
| Bookmarks / Saved | **My Treasure** | Personal library of saved notes, collections, and offline materials |
| Exam Study Portal | **Exam Emergency Room** | High-yield revision portal for upcoming midterms & finals |
| User Profile | **Charity Card** | Public benefactor card showing reputation, donations, and metrics |
| Social Connections | **My Charity Circle** | Following system to stay notified when top contributors post |
| Notifications | **Charity Bells** | In-app alerts for approvals, followers, badges, and reviews |
| Admin Dashboard | **Charity Headquarters** | Platform overview: analytics, user management, and system stats |
| Admin Resource Vault | **Donation Vault** | Pending approval queue, publishing controls, and archive tools |
| Content Moderation | **Charity Police** | Flagged content, suspicious donation reports, user suspensions |
| Analytics & Metrics | **Charity Accounting** | Platform health charts, download trends, active users, growth |
| Leaderboard | **Generosity Olympics** | Weekly, monthly, and all-time benefactor leaderboards |
| Settings | **Fine Print** | Profile preferences, security settings, notification preferences |

---

## 4. Key Target Features & Requirements

### A. Authentication & Verification
- Auth System: **Better Auth** mounted on backend (`/api/auth/*`).
- Verification: Email domain validation (`@*.edu`), student ID validation, multi-tier status (`UNVERIFIED`, `EMAIL_VERIFIED`, `PENDING_REVIEW`, `VERIFIED`, `REJECTED`).
- Roles: `STUDENT`, `TEACHER`, `MODERATOR`, `ADMIN`, `SUPER_ADMIN`. Server-side strict authorization.

### B. Resource Management & Duplication
- Upload Wizard: Multi-step upload with client & server MIME/extension validation (PDF, DOC/X, PPT/X, PNG, JPG).
- Cryptographic Deduplication: SHA-256 file hashing (`fileHash`) prevents duplicate uploads with alert prompts.
- Document Preview: Native browser responsive PDF viewer (page nav, zoom, scroll).
- File Storage: `StorageService` abstraction supporting S3 / Cloudflare R2 / Cloudinary.

### C. Ratings, Quality Score & Recommendation Engine
- Rating: 1–5 stars (1 rating per user/resource; no self-rating).
- Quality Score (0–100): Calculated via weighted formula considering ratings, download counts, review velocity, recency, and report count.
- Deterministic Recommendations: Interest profile based on user's course enrollments, recent searches, and topic engagement.

### D. Exam Emergency Room & Pantry Health
- Exam Portal: Filter by Course & Exam type to view high-yield notes, previous questions, solved problems.
- Pantry Health: Real-time database metric calculating percentage coverage of essential study topics per course.

---

## 5. Technology Stack Summary
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express.js, TypeScript, Better Auth.
- **Database:** MongoDB & Mongoose.
- **Storage:** Object Storage abstraction (S3 / R2 compatible).
- **Tooling:** Git, GitHub, ESLint, TypeScript compiler (`tsc`).
