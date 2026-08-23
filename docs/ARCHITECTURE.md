# PEER'S CHARITY — SYSTEM ARCHITECTURE

## 1. High-Level Modular Monolith Architecture

Peer's Charity uses a modular full-stack architecture separated into a Next.js Frontend application and an Express.js Backend server backed by MongoDB Atlas and S3-compatible Object Storage.

```
                                  INTERNET
                                     |
                                     v
                        +------------------------+
                        |    Next.js App Router  |
                        |   (Frontend Web App)   |
                        +-----------+------------+
                                    |
                            HTTPS REST / JSON
                                    |
                                    v
                        +------------------------+
                        |    Express.js Server   |
                        |   (Backend API & Auth) |
                        +----+--------------+----+
                             |              |
           +-----------------+              +-----------------+
           v                                                  v
+--------------------+                              +--------------------+
|   MongoDB Atlas    |                              |   Object Storage   |
| (Metadata & State) |                              |  (PDFs, Docs, Imgs)|
+--------------------+                              +--------------------+
```

---

## 2. Server Responsibilities & Boundaries

### A. Express Backend (`apps/api`)
- **Authoritative System:** Sole owner of authentication, session management, roles, authorization logic, and DB operations.
- **Better Auth Integration:** Express mounts Better Auth handler at `/api/auth/*` before standard JSON body parsers where required.
- **Service Layer Pattern:** Clean separation of concerns using Controllers $\rightarrow$ Services $\rightarrow$ Mongoose Models.
- **Storage Abstraction:** Manages file stream uploads, storage keys, cryptographic hash calculations, and signed preview/download URLs.

### B. Next.js Frontend (`apps/web`)
- **Presentation & Routing:** React 19 App Router layout shell, client interactions, state management.
- **Better Auth React Client:** Communicates directly with Express backend authentication endpoints (`/api/auth/*`) using credentials-enabled CORS.
- **SaaS UI Design System:** Custom Tailwind CSS design tokens, command palette (`Cmd+K`), dark/light mode toggle, skeleton loaders, and responsive layouts.

---

## 3. Core Component Diagram

```
+-----------------------------------------------------------------------+
|                             Frontend (Web)                            |
| +-----------------+  +------------------+  +------------------------+ |
| | Landing & Auth  |  | Charity HQ &     |  | Exam Emergency Room &  | |
| | Views           |  | Bazaar Catalog   |  | Academic Pantry        | |
| +--------+--------+  +--------+---------+  +-----------+------------+ |
+----------|--------------------|------------------------|--------------+
           |                    |                        |
           +--------------------+------------------------+
                                | REST API calls (with Credentials/Cookies)
                                v
+-----------------------------------------------------------------------+
|                             Backend (API)                             |
| +-------------------------------------------------------------------+ |
| |                      Routes & Auth Controllers                    | |
| |   /api/auth/*   /api/resources   /api/courses   /api/admin        | |
| +----------------------------------+--------------------------------+ |
|                                    |                                  |
| +----------------------------------v--------------------------------+ |
| |                           Services Layer                          | |
| |  AuthService         ResourceService       RecommendationService  | |
| |  StorageService      QualityScoreService   ReputationService      | |
| +----------------------------------+--------------------------------+ |
|                                    |                                  |
| +----------------------------------v--------------------------------+ |
| |                           Mongoose Models                         | |
| |  User, University, Department, Course, Resource, Rating, AuditLog | |
| +----------------------------------+--------------------------------+ |
+------------------------------------|----------------------------------+
                                     |
                         +-----------+-----------+
                         v                       v
               +-------------------+   +-------------------+
               |   MongoDB Atlas   |   |   S3 / R2 Bucket  |
               +-------------------+   +-------------------+
```

---

## 4. Resource Quality Score (RQS) Formula

To ensure low-rating or single-vote submissions do not dominate rankings, Peer's Charity calculates a confidence-weighted Quality Score (0–100) for every published resource:

$$\text{RQS} = \min\left(100, \; \text{Round}\left( w_r \cdot S_{bayesian} + w_d \cdot S_{downloads} + w_v \cdot S_{reviews} + w_t \cdot S_{recency} - P_{reports} \right)\right)$$

Where:
- **Bayesian Rating Score ($S_{bayesian}$):** Smooths 1–5 star ratings using global average prior ($m = 3.5$, $C = 5$ minimum votes).
- **Download Score ($S_{downloads}$):** Logarithmic scaling of legitimate unique user downloads.
- **Review Sentiment ($S_{reviews}$):** Weighted positive/helpful review count.
- **Recency Decay ($S_{recency}$):** Time decay factor keeping active semester content fresh.
- **Report Penalty ($P_{reports}$):** Penalty score subtracted for unresolved community flags.

---

## 5. File Upload & Storage Abstraction

```
User File Upload
       |
       v
Client MIME Check
       |
       v
Express Multer Buffer Stream
       |
       v
Compute SHA-256 Hash  ===> Query DB for fileHash match ===> [Duplicate Warning if found]
       |
       v
StorageService.upload()
       |
       +---> Provider: S3 / Cloudflare R2 / Local Dev Storage
       |
       v
Save Resource Document to MongoDB
```
