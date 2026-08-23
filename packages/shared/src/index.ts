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
