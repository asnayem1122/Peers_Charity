// ── Product Terminology ──────────────────────────────
export const PRODUCT_TERMINOLOGY = {
  appName: "PEER'S CHARITY",
  tagline: "Give a Note. Get a Note. Save a Semester.",
  secondaryTagline: "We don't sell notes. We perform academic charity.",
  dashboard: "CHARITY HQ",
  discovery: "CHARITY BAZAAR",
  courseLibrary: "ACADEMIC PANTRY",
  upload: "DONATE KNOWLEDGE",
  bookmarks: "MY TREASURE",
  examPrep: "EXAM EMERGENCY ROOM",
  following: "MY CHARITY CIRCLE",
  profile: "CHARITY CARD",
  notifications: "CHARITY BELLS",
  settings: "FINE PRINT",
  admin: "CHARITY HEADQUARTERS",
  resourceVault: "DONATION VAULT",
  moderation: "CHARITY POLICE",
  reports: "SUSPICIOUS DONATIONS",
  users: "THE BENEFACTORS",
  analytics: "CHARITY ACCOUNTING",
  leaderboard: "GENEROSITY OLYMPICS",
} as const;

// ── User & Status Types ──────────────────────────────
export type UserRole = 'STUDENT' | 'TEACHER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';

export type VerificationStatus = 
  | 'UNVERIFIED' 
  | 'EMAIL_VERIFIED' 
  | 'PENDING_REVIEW' 
  | 'VERIFIED' 
  | 'REJECTED';

export type ResourceStatus = 
  | 'DRAFT' 
  | 'PENDING' 
  | 'PUBLISHED' 
  | 'REJECTED' 
  | 'REMOVED' 
  | 'ARCHIVED';

/** @deprecated Use AcademicSection + ExamType/MaterialType instead */
export type ResourceType = 
  | 'Lecture Notes'
  | 'Class Notes'
  | 'Previous Exam Questions'
  | 'Solved Questions'
  | 'Lab Reports'
  | 'Assignments'
  | 'Presentations'
  | 'Cheat Sheets'
  | 'Reference Material'
  | 'Tutorials'
  | 'Question Banks'
  | 'Other';

// ── 3-Tier Academic Taxonomy ─────────────────────────

/**
 * The three academic resource sections:
 * - `question`: Exam archive (CT, Mid, Final papers)
 * - `course_material`: Theory resources (Hand Notes, Slides, External Links)
 * - `sessional`: Lab courses (Lab reports, manuals, task codes)
 */
export type AcademicSection = 'question' | 'course_material' | 'sessional';

/** Exam type for Question section resources */
export type ExamType = 'CT' | 'MID' | 'FINAL';

/** Material type for Course Material section resources */
export type MaterialType = 'HAND_NOTE' | 'SLIDES' | 'EXTERNAL_LINK';

/**
 * Academic metadata attached to every resource.
 * Section-specific fields are conditionally required:
 * - `question`: requires `semester`, `examType`
 * - `course_material`: requires `semester`, `materialType`
 * - `sessional`: requires `labNumber` (optional semester)
 */
export interface IAcademicMetadata {
  section: AcademicSection;
  semester?: string;          // Required for 'question' & 'course_material'
  courseId: string;            // Ref to Course
  batch: string;              // e.g., "11", "12", "Fall 23"
  examType?: ExamType;        // Required if section === 'question'
  materialType?: MaterialType; // Required if section === 'course_material'
  externalLink?: string;      // Optional if materialType === 'EXTERNAL_LINK'
  labNumber?: string | number; // Optional for sessional (e.g., "Lab 03", "Project")
}

/** Section display configuration for UI rendering */
export const SECTION_CONFIG = {
  question: {
    label: 'Question Section',
    shortLabel: 'Questions',
    description: 'Past exam papers — CT, Mid, Final',
    icon: 'FileQuestion',
    color: 'amber',
  },
  course_material: {
    label: 'Course Material',
    shortLabel: 'Materials',
    description: 'Hand notes, slides & external links',
    icon: 'BookOpen',
    color: 'blue',
  },
  sessional: {
    label: 'Sessional',
    shortLabel: 'Sessional',
    description: 'Lab reports, manuals & task codes',
    icon: 'FlaskConical',
    color: 'emerald',
  },
} as const;

/** Exam type display labels */
export const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  CT: 'Class Test (CT)',
  MID: 'Mid-Term Exam',
  FINAL: 'Final Exam',
} as const;

/** Material type display labels */
export const MATERIAL_TYPE_LABELS: Record<MaterialType, string> = {
  HAND_NOTE: 'Hand Note',
  SLIDES: 'Slides / Presentation',
  EXTERNAL_LINK: 'External Link',
} as const;

export * from './validation.js';

