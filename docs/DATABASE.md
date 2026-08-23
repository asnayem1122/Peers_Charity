# PEER'S CHARITY — DATABASE DESIGN & SCHEMA

> **Database Engine:** MongoDB 7.0+  
> **Object Document Mapper (ODM):** Mongoose 8.x

---

## 1. Entity Relationship Overview

```
[University]
    |-- 1:N --> [Department]
                     |-- 1:N --> [Course]
                                      |-- 1:N --> [Resource]
                                                       |-- 1:N --> [Rating]
                                                       |-- 1:N --> [Review]
                                                       |-- 1:N --> [Bookmark]
                                                       |-- 1:N --> [Download]
                                                       |-- 1:N --> [Report]

[User]
   |-- 1:N --> [Resource] (as Uploader)
   |-- 1:N --> [ReputationEvent]
   |-- 1:N --> [UserAchievement]
   |-- 1:N --> [Follow] (Follower / Following)
   |-- 1:N --> [Notification]
```

---

## 2. Primary Collections & Models

### A. `users`
Managed partly by Better Auth (credentials, sessions) and extended with application profile data:
- `_id`: ObjectId
- `name`: String (required)
- `email`: String (unique, required)
- `emailVerified`: Boolean
- `role`: Enum (`STUDENT`, `TEACHER`, `MODERATOR`, `ADMIN`, `SUPER_ADMIN`)
- `universityId`: ObjectId (ref: `University`)
- `departmentId`: ObjectId (ref: `Department`)
- `semester`: String (e.g., "Level 3 / Term 2")
- `studentIdNumber`: String (optional/encrypted reference)
- `verificationStatus`: Enum (`UNVERIFIED`, `EMAIL_VERIFIED`, `PENDING_REVIEW`, `VERIFIED`, `REJECTED`)
- `charityPoints`: Number (default: 0)
- `avatarUrl`: String
- `bio`: String
- `createdAt`, `updatedAt`: Date

### B. `universities`, `departments`, `courses`, `semesters`, `teachers`
Hierarchical academic taxonomy to organize content across institutions.
- **University:** `name`, `code`, `domains` (e.g. `["@university.edu"]`), `logoUrl`.
- **Department:** `name`, `code`, `universityId`.
- **Course:** `title`, `code` (e.g. "CSE 2103"), `departmentId`, `description`, `pantryHealthScore`.
- **Teacher:** `name`, `title`, `departmentId`, `email`.

### C. `resources`
Core content entity containing document metadata and file storage references:
- `_id`: ObjectId
- `title`: String (required, indexed)
- `description`: String
- `uploaderId`: ObjectId (ref: `User`, indexed)
- `universityId`: ObjectId (ref: `University`)
- `departmentId`: ObjectId (ref: `Department`)
- `courseId`: ObjectId (ref: `Course`, indexed)
- `semester`: String
- `teacherId`: ObjectId (ref: `Teacher`)
- `resourceType`: Enum (`Lecture Notes`, `Class Notes`, `Previous Exam Questions`, `Solved Questions`, `Lab Reports`, `Assignments`, `Presentations`, `Cheat Sheets`, `Reference Material`, `Tutorials`, `Question Banks`, `Other`)
- `topics`: [String]
- `tags`: [String]
- `fileUrl`: String (storage path / URL)
- `fileKey`: String (S3 object key)
- `fileHash`: String (SHA-256 hash, indexed)
- `mimeType`: String
- `sizeBytes`: Number
- `status`: Enum (`DRAFT`, `PENDING`, `PUBLISHED`, `REJECTED`, `REMOVED`, `ARCHIVED`)
- `qualityScore`: Number (0–100, default: 50, indexed)
- `stats`:
  - `viewsCount`: Number (default: 0)
  - `downloadsCount`: Number (default: 0)
  - `ratingsCount`: Number (default: 0)
  - `averageRating`: Number (default: 0)
  - `bookmarksCount`: Number (default: 0)
- `createdAt`, `updatedAt`: Date

### D. Supporting Engagement Collections
- **`ratings`**: `resourceId`, `userId`, `stars` (1–5), `createdAt` (Unique index on `resourceId` + `userId`).
- **`reviews`**: `resourceId`, `userId`, `content`, `helpfulVotes`, `createdAt`.
- **`bookmarks`**: `userId`, `resourceId`, `collectionName`, `createdAt` (Unique index on `userId` + `resourceId`).
- **`downloads`**: `userId`, `resourceId`, `ipHash`, `createdAt`.
- **`reports`**: `resourceId`, `reporterId`, `reason`, `details`, `status` (`PENDING`, `INVESTIGATING`, `RESOLVED`, `DISMISSED`), `auditLog`.
- **`follows`**: `followerId`, `followingId`, `createdAt` (Unique index).
- **`reputationEvents`**: `userId`, `eventType`, `points`, `resourceId`, `metadata`, `createdAt`.
- **`achievements`** & **`userAchievements`**: Track earned badges (e.g. "🌱 First Donation", "🎓 Exam Savior").
- **`auditLogs`**: Track administrative actions (approvals, rejections, suspensions, permissions).

---

## 3. Indexing Strategy

| Collection | Fields Indexed | Index Type | Rationale |
|---|---|---|---|
| `resources` | `fileHash` | Single Field | Rapid exact duplicate lookup during multi-step upload wizard |
| `resources` | `{ courseId: 1, status: 1, qualityScore: -1 }` | Compound | Fast discovery filtering in Charity Bazaar and Exam Emergency Room |
| `resources` | `{ title: "text", description: "text", topics: "text", tags: "text" }` | Text | Full-text search for Charity Bazaar global search |
| `ratings` | `{ resourceId: 1, userId: 1 }` | Compound Unique | Enforces 1 rating per user per resource |
| `bookmarks` | `{ userId: 1, resourceId: 1 }` | Compound Unique | Prevents duplicate bookmarks |
| `follows` | `{ followerId: 1, followingId: 1 }` | Compound Unique | Enforces single follow relation |
