# PEER'S CHARITY — DEPLOYMENT & DEVOPS GUIDE

## 1. Deployment Architecture Overview

```
                         Production User
                                |
                        +-------v-------+
                        | Custom Domain |
                        +-------+-------+
                                |
               +----------------+----------------+
               |                                 |
        +------v------+                   +------v------+
        | Next.js App |                   | Express API |
        |  (Vercel)   |                   |  (Render)   |
        +------+------+                   +------+------+
               |                                 |
               | HTTPS REST API Calls            | Mongoose / S3 SDK
               +----------------+----------------+
                                |
             +------------------+------------------+
             v                                     v
   +-------------------+                 +-------------------+
   |   MongoDB Atlas   |                 |   Cloudflare R2   |
   | (Managed DB Cluster)                |   (Object Storage)|
   +-------------------+                 +-------------------+
```

---

## 2. Environment Configuration Reference

### Backend (`apps/api/.env`)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/peers_charity?retryWrites=true&w=majority
BETTER_AUTH_SECRET=super_secret_better_auth_key_min_32_chars
BETTER_AUTH_URL=https://api.peerscharity.com
FRONTEND_URL=https://peerscharity.com
CORS_ORIGIN=https://peerscharity.com

# Storage Service Configuration (S3 / R2 compatible)
STORAGE_PROVIDER=r2 # r2 | s3 | local
STORAGE_BUCKET=peers-charity-uploads
STORAGE_REGION=auto
STORAGE_ACCESS_KEY_ID=your_access_key_id
STORAGE_SECRET_ACCESS_KEY=your_secret_access_key
STORAGE_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com

# Verification Domains
UNIVERSITY_EMAIL_DOMAINS=@university.edu,@student.university.edu
```

### Frontend (`apps/web/.env`)
```env
NEXT_PUBLIC_API_URL=https://api.peerscharity.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://api.peerscharity.com
NEXT_PUBLIC_APP_NAME=Peer's Charity
```

---

## 3. Production Deployment Instructions

### A. Database Setup (MongoDB Atlas)
1. Provision a MongoDB Atlas M0/M10 cluster.
2. Configure IP Access List (allow deployment host IP or 0.0.0.0/0 with strong auth).
3. Create database user with ReadWrite permissions on `peers_charity`.

### B. Backend Deployment (Render / Railway)
- **Build Command:** `pnpm --filter api build` or `npm run build --prefix apps/api`
- **Start Command:** `npm run start --prefix apps/api`
- **Health Check Endpoint:** `GET /api/health`

### C. Frontend Deployment (Vercel)
- **Framework Preset:** Next.js
- **Root Directory:** `apps/web`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
