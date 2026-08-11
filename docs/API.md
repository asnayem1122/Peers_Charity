# PEER'S CHARITY — REST API ARCHITECTURE

All API responses follow a unified JSON response envelope.

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Resource fetched successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42
  }
}
```

---

## 1. Authentication Endpoints (`/api/auth/*`)

Managed directly by **Better Auth** Express handler mounted on `/api/auth/*`:

- `POST /api/auth/sign-up/email` — Register new benefactor account.
- `POST /api/auth/sign-in/email` — Login with credentials.
- `POST /api/auth/sign-out` — Terminate session & clear cookies.
- `GET  /api/auth/get-session` — Retrieve active user session & profile.
- `POST /api/auth/verify-email` — Complete university email verification token.

---

## 2. Resource & Discovery Endpoints (`/api/resources`)

- `GET /api/resources` — Discover resources (query: `search`, `courseId`, `resourceType`, `sort`, `page`, `limit`).
- `GET /api/resources/:id` — Get resource metadata, stats, & contributor info.
- `POST /api/resources/check-duplicate` — Upload hash check returning matching resource if duplicate exists.
- `POST /api/resources` — Create resource entry (Multi-step upload metadata & file payload).
- `PATCH /api/resources/:id` — Update resource details (Uploader or Admin).
- `DELETE /api/resources/:id` — Remove resource.
- `GET /api/resources/:id/preview` — Get browser inline preview URL for PDF viewer.
- `POST /api/resources/:id/download` — Record download event & generate secure download URL.

---

## 3. Social, Rating & Review Endpoints

- `POST /api/resources/:id/ratings` — Add / update resource star rating (1–5).
- `POST /api/resources/:id/reviews` — Post resource review text.
- `DELETE /api/reviews/:id` — Delete review.
- `POST /api/resources/:id/bookmarks` — Toggle bookmark in My Treasure.
- `GET /api/users/me/bookmarks` — Get saved bookmarks.
- `POST /api/resources/:id/reports` — Submit resource report to Charity Police moderation queue.

---

## 4. Academic Taxonomy & Exam Emergency Room

- `GET /api/courses` — List courses & Academic Pantry coverage statistics.
- `GET /api/courses/:id` — Detailed course info & Pantry Health metric.
- `GET /api/exam-mode/:courseId` — Dedicated Exam Emergency Room high-yield resources & topic frequency stats.

---

## 5. Reputation & User Profile

- `GET /api/users/:id/profile` — Fetch Charity Card public profile (stats, badges, donations).
- `POST /api/users/:id/follow` — Follow contributor (My Charity Circle).
- `DELETE /api/users/:id/follow` — Unfollow contributor.
- `GET /api/leaderboard` — Generosity Olympics ranking list (`weekly`, `monthly`, `all-time`).

---

## 6. Admin & Moderation Endpoints (`/api/admin/*`)

*Protected by `ADMIN` / `MODERATOR` role authorization middleware.*

- `GET /api/admin/analytics` — Platform analytics metrics & aggregate charts.
- `GET /api/admin/resources/pending` — Donation Vault review queue.
- `PATCH /api/admin/resources/:id/status` — Approve, Reject, or Archive resource.
- `GET /api/admin/reports` — Charity Police report queue.
- `PATCH /api/admin/reports/:id/resolve` — Resolve or dismiss report.
- `GET /api/admin/users` — List platform users & verification statuses.
- `PATCH /api/admin/users/:id/role` — Update user roles.
- `GET /api/admin/audit-logs` — Administrative audit trail logs.
