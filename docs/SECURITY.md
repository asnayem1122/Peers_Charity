# PEER'S CHARITY — SECURITY & COMPLIANCE SPECIFICATION

## 1. Authentication & Session Security
- **Authoritative Provider:** Express backend manages Better Auth authentication sessions using HttpOnly, SameSite, Secure cookies.
- **CSRF & Credentials:** CORS configured strictly with explicit trusted origins (`FRONTEND_URL`), wildcard origins with credentials explicitly forbidden.
- **Password Hashing:** Argon2id or bcrypt hashing managed by Better Auth.
- **Token Security:** Private session tokens stored securely in DB; never exposed in URLs or client logs.

---

## 2. Authorization & Role-Based Access Control (RBAC)

```
[STUDENT] < [TEACHER] < [MODERATOR] < [ADMIN] < [SUPER_ADMIN]
```

- **Backend Enforcement:** Middleware checks role privileges directly on Express routes (`authorizeRole(["ADMIN", "SUPER_ADMIN"])`).
- **Frontend Role Protection:** React route guards for UI rendering only. Frontend storage/claims are never trusted for authority.
- **IDOR Protection:** Resource updates/deletions explicitly verify `uploaderId === req.user.id` or user possesses `MODERATOR`/`ADMIN` role.

---

## 3. Upload & File Security
- **MIME & Extension Validation:** Server verifies actual file headers/MIME types (PDF, DOC/X, PPT/X, PNG, JPG) rather than relying solely on file extension.
- **Storage Path Sanitization:** Filenames replaced with random UUIDs / storage keys (`uploads/{universityId}/{sha256}.pdf`) to avoid directory traversal or execution vulnerabilities.
- **Controlled File Access:** Resource download endpoints evaluate authorization before issuing signed temporary storage URLs or streaming files.

---

## 4. Anti-Abuse & Rate Limiting
- **Endpoint Rate Limiting:** Express rate limiting middleware applied to authentication, file upload, rating, and review endpoints.
- **Anti-Farm Reputation:** Points awarded once per unique action per resource/user combination; duplicate download clicks or self-ratings filtered out.
- **Exact Hash Deduplication:** SHA-256 cryptographic check prevents duplicate upload flooding.

---

## 5. Audit Trail & Content Moderation
- **Audit Logging:** Administrative actions (suspension, role elevation, resource rejection, report resolution) appended to immutably designed `auditLogs` collection.
- **DMCA / Takedown Compliance:** Content flagging mechanism allows users/rights holders to submit copyright reports triggering automatic review queue insertion.
