'use client';

export type ResourceType =
  | 'Notes'
  | 'Slides'
  | 'PDF'
  | 'External Link'
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

export type AcademicSection = 'question' | 'course_material' | 'sessional';
export type ExamType = 'CT' | 'MID' | 'FINAL';
export type MaterialType = 'HAND_NOTE' | 'SLIDES' | 'EXTERNAL_LINK';

export interface AcademicMetadata {
  section: AcademicSection;
  semester?: string;
  courseId?: string;
  batch: string;
  examType?: ExamType;
  materialType?: MaterialType;
  externalLink?: string;
  labNumber?: string | number;
}

export type DisplayMode = 'PROFILE' | 'ANONYMOUS' | 'CUSTOM';

export type ContentSource = 'Created by me' | 'Shared with permission' | 'Public resource' | 'External link';

export interface ResourceReview {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface ResourceReport {
  id: string;
  resourceId: string;
  resourceTitle: string;
  reporterId: string;
  reporterName: string;
  reason: 'Copyright/ownership concern' | 'Incorrect information' | 'Spam' | 'Inappropriate content' | 'Other';
  details: string;
  createdAt: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  courseName: string;
  department: string;
  semester: string;
  resourceType: ResourceType;
  academicMetadata?: AcademicMetadata;
  contentSource: ContentSource;
  
  // File or Link
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  externalUrl?: string;

  // Uploader Identity System (Anonymous to public ≠ Anonymous to Admin)
  realUploaderId: string;
  realUploaderEmail: string;
  realUploaderName: string;
  displayMode: DisplayMode;
  customDisplayName?: string;
  publicDisplayIdentity: string; // Calculated for public UI

  // Metadata & Stats
  tags: string[];
  qualityScore: number; // Out of 5.0 or percentage
  rating: number; // 1.0 - 5.0
  ratingCount: number;
  downloadsCount: number;
  bookmarksCount: number;
  createdAt: string;
  fileHash: string; // SHA-256 hash representation

  // Content Preview Snippet / HTML
  previewText?: string;
  reviews: ResourceReview[];
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Verified Initial Demo Resources (BAUST CSE Academic Taxonomy)
export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-cse2103-final-2023',
    title: 'CSE 2103: Database Systems - Fall 2023 Semester Final Paper',
    description: 'Official semester final exam question paper for Database Systems covering SQL DDL/DML, Relational Algebra, Normalization (1NF-BCNF), and Transaction ACID properties.',
    courseCode: 'CSE 2103',
    courseName: 'Database Systems',
    department: 'Computer Science & Engineering',
    semester: 'Level 2 / Term 1',
    resourceType: 'Previous Exam Questions',
    academicMetadata: {
      section: 'question',
      semester: 'Level 2 / Term 1',
      batch: '11',
      examType: 'FINAL',
    },
    contentSource: 'Created by me',
    fileUrl: '/samples/cse2103-final-2023.pdf',
    fileName: 'CSE2103_Final_Exam_2023.pdf',
    fileSize: '2.4 MB',
    realUploaderId: 'user_top_contributor',
    realUploaderEmail: 'top.contributor@demo.com',
    realUploaderName: 'Sarah Ahmed',
    displayMode: 'PROFILE',
    publicDisplayIdentity: 'Sarah Ahmed (CSE 11th)',
    tags: ['Exam', 'Final', 'Fall23', 'Batch11', 'Database'],
    qualityScore: 78,
    rating: 4.5,
    ratingCount: 2,
    downloadsCount: 45,
    bookmarksCount: 12,
    createdAt: '2024-01-15',
    fileHash: 'sha256:cse2103final2023demohash',
    previewText: 'BAUST Semester Final Examination\nCourse Code: CSE 2103\nCourse Title: Database Systems\nFull Marks: 70 | Time: 3 Hours',
    reviews: [
      {
        id: 'rev-1',
        userId: 'user_student',
        userName: 'Tanvir Hasan',
        rating: 5,
        comment: 'Accurate question paper! Saved me before the exam.',
        createdAt: '2024-01-20',
      },
    ],
  },
  {
    id: 'res-cse2105-mid-2024',
    title: 'CSE 2105: Object Oriented Programming - Spring 2024 Mid-Term Paper',
    description: 'Mid-term exam paper on OOP fundamentals: polymorphism, abstract classes, operator overloading, and exception handling in C++.',
    courseCode: 'CSE 2105',
    courseName: 'Data Structures & Algorithms',
    department: 'Computer Science & Engineering',
    semester: 'Level 2 / Term 1',
    resourceType: 'Previous Exam Questions',
    academicMetadata: {
      section: 'question',
      semester: 'Level 2 / Term 1',
      batch: '12',
      examType: 'MID',
    },
    contentSource: 'Created by me',
    fileUrl: '/samples/cse2105-mid-2024.pdf',
    fileName: 'CSE2105_Mid_Exam_2024.pdf',
    fileSize: '1.8 MB',
    realUploaderId: 'user_student',
    realUploaderEmail: 'student@demo.com',
    realUploaderName: 'Tanvir Hasan',
    displayMode: 'PROFILE',
    publicDisplayIdentity: 'Tanvir Hasan',
    tags: ['MidTerm', 'Spring24', 'Batch12', 'OOP'],
    qualityScore: 72,
    rating: 4.0,
    ratingCount: 1,
    downloadsCount: 28,
    bookmarksCount: 8,
    createdAt: '2024-03-10',
    fileHash: 'sha256:cse2105mid2024demohash',
    reviews: [],
  },
  {
    id: 'res-eee1201-ct02',
    title: 'EEE 1201: Class Test 02 - AC Circuit Analysis & Thevenin Theorem',
    description: 'Class test paper covering sinusoidal steady-state analysis, mesh/nodal analysis, and Thevenin/Norton equivalent circuits.',
    courseCode: 'EEE 1201',
    courseName: 'Electrical Circuit Analysis',
    department: 'Electrical & Electronic Engineering',
    semester: 'Level 1 / Term 2',
    resourceType: 'Previous Exam Questions',
    academicMetadata: {
      section: 'question',
      semester: 'Level 1 / Term 2',
      batch: '12',
      examType: 'CT',
    },
    contentSource: 'Created by me',
    fileUrl: '/samples/eee1201-ct02.pdf',
    fileName: 'EEE1201_CT02.pdf',
    fileSize: '980 KB',
    realUploaderId: 'user_moderator',
    realUploaderEmail: 'moderator@demo.com',
    realUploaderName: 'Nafis Iqbal',
    displayMode: 'PROFILE',
    publicDisplayIdentity: 'Nafis Iqbal',
    tags: ['CT', 'ClassTest', 'Batch12', 'EEE'],
    qualityScore: 70,
    rating: 4.0,
    ratingCount: 1,
    downloadsCount: 19,
    bookmarksCount: 5,
    createdAt: '2024-02-14',
    fileHash: 'sha256:eee1201ct02demohash',
    reviews: [],
  },
  {
    id: 'res-db-normalization-slides',
    title: 'Normalization (1NF to BCNF) Lecture Slides',
    description: 'Complete lecture slide deck explaining functional dependencies, lossless decomposition, dependency preservation, 1NF, 2NF, 3NF, and BCNF with solved examples.',
    courseCode: 'CSE 2103',
    courseName: 'Database Systems',
    department: 'Computer Science & Engineering',
    semester: 'Level 2 / Term 1',
    resourceType: 'Presentations',
    academicMetadata: {
      section: 'course_material',
      semester: 'Level 2 / Term 1',
      batch: '11',
      materialType: 'SLIDES',
    },
    contentSource: 'Created by me',
    fileUrl: '/samples/db-normalization-slides.pptx',
    fileName: 'DB_Normalization_1NF_BCNF.pptx',
    fileSize: '5.2 MB',
    realUploaderId: 'user_top_contributor',
    realUploaderEmail: 'top.contributor@demo.com',
    realUploaderName: 'Sarah Ahmed',
    displayMode: 'PROFILE',
    publicDisplayIdentity: 'Sarah Ahmed (CSE 11th)',
    tags: ['Slides', 'Lecture', 'BCNF', 'Batch11', 'Database'],
    qualityScore: 92,
    rating: 4.8,
    ratingCount: 3,
    downloadsCount: 78,
    bookmarksCount: 28,
    createdAt: '2024-02-01',
    fileHash: 'sha256:dbnormalizationslidesdemohash',
    reviews: [
      {
        id: 'rev-2',
        userId: 'user_student',
        userName: 'Tanvir Hasan',
        rating: 5,
        comment: 'Crystal clear decomposition examples!',
        createdAt: '2024-02-05',
      },
    ],
  },
  {
    id: 'res-cpp-memory-cheatsheet',
    title: 'C++ Pointers and Memory Management Cheat Sheet',
    description: 'Comprehensive handwritten study notes covering pointer arithmetic, dynamic memory allocation (new/delete), smart pointers (unique/shared/weak), and avoiding memory leaks.',
    courseCode: 'CSE 2105',
    courseName: 'Data Structures & Algorithms',
    department: 'Computer Science & Engineering',
    semester: 'Level 2 / Term 1',
    resourceType: 'Lecture Notes',
    academicMetadata: {
      section: 'course_material',
      semester: 'Level 2 / Term 1',
      batch: '12',
      materialType: 'HAND_NOTE',
    },
    contentSource: 'Created by me',
    fileUrl: '/samples/cpp-memory-cheatsheet.pdf',
    fileName: 'CPP_Pointers_Memory_CheatSheet.pdf',
    fileSize: '3.1 MB',
    realUploaderId: 'user_top_contributor',
    realUploaderEmail: 'top.contributor@demo.com',
    realUploaderName: 'Sarah Ahmed',
    displayMode: 'PROFILE',
    publicDisplayIdentity: 'Sarah Ahmed (CSE 11th)',
    tags: ['Notes', 'CheatSheet', 'HandNotes', 'Batch12', 'C++'],
    qualityScore: 96,
    rating: 5.0,
    ratingCount: 3,
    downloadsCount: 112,
    bookmarksCount: 42,
    createdAt: '2024-01-25',
    fileHash: 'sha256:cppmemorycheatsheetdemohash',
    reviews: [
      {
        id: 'rev-3',
        userId: 'user_moderator',
        userName: 'Nafis Iqbal',
        rating: 5,
        comment: 'Top tier hand notes. Covers all pointer questions from teachers.',
        createdAt: '2024-01-28',
      },
    ],
  },
  {
    id: 'res-ode-video-playlist',
    title: 'Ordinary Differential Equations & Laplace Transforms - Video Lectures',
    description: 'Curated high-yield video lectures covering second-order linear differential equations, Laplace transforms, and convolution integrals.',
    courseCode: 'MATH 2101',
    courseName: 'Mathematics III - Fourier & Vector Analysis',
    department: 'Basic Science & Humanities',
    semester: 'Level 2 / Term 1',
    resourceType: 'External Link',
    academicMetadata: {
      section: 'course_material',
      semester: 'Level 2 / Term 1',
      batch: '11',
      materialType: 'EXTERNAL_LINK',
      externalLink: 'https://www.youtube.com/playlist?list=PLDesaqWTN6ESPaHy2QUKVaXNZuQNxGmAQ',
    },
    contentSource: 'External link',
    externalUrl: 'https://www.youtube.com/playlist?list=PLDesaqWTN6ESPaHy2QUKVaXNZuQNxGmAQ',
    realUploaderId: 'user_top_contributor',
    realUploaderEmail: 'top.contributor@demo.com',
    realUploaderName: 'Sarah Ahmed',
    displayMode: 'PROFILE',
    publicDisplayIdentity: 'Sarah Ahmed (CSE 11th)',
    tags: ['Video', 'Math', 'Laplace', 'Batch11'],
    qualityScore: 84,
    rating: 4.7,
    ratingCount: 2,
    downloadsCount: 49,
    bookmarksCount: 15,
    createdAt: '2024-02-18',
    fileHash: 'sha256:odevideoplaylistdemohash',
    reviews: [],
  },
  {
    id: 'res-cse2104-lab04-manual',
    title: 'Lab 04: Advanced SQL Joins and Subqueries Manual',
    description: 'Detailed lab manual with executed queries, ER schema, inner/outer joins, correlated subqueries, and output screenshots for Oracle SQL.',
    courseCode: 'CSE 2104',
    courseName: 'Database Systems Sessional',
    department: 'Computer Science & Engineering',
    semester: 'Level 2 / Term 1',
    resourceType: 'Lab Reports',
    academicMetadata: {
      section: 'sessional',
      batch: '11',
      labNumber: 'Lab 04',
    },
    contentSource: 'Created by me',
    fileUrl: '/samples/cse2104-lab04-manual.pdf',
    fileName: 'CSE2104_Lab04_Manual.pdf',
    fileSize: '4.1 MB',
    realUploaderId: 'user_top_contributor',
    realUploaderEmail: 'top.contributor@demo.com',
    realUploaderName: 'Sarah Ahmed',
    displayMode: 'PROFILE',
    publicDisplayIdentity: 'Sarah Ahmed (CSE 11th)',
    tags: ['LabReport', 'Manual', 'SQL', 'Batch11', 'CSE 2104'],
    qualityScore: 88,
    rating: 4.5,
    ratingCount: 2,
    downloadsCount: 54,
    bookmarksCount: 19,
    createdAt: '2024-02-22',
    fileHash: 'sha256:cse2104lab04demohash',
    reviews: [],
  },
  {
    id: 'res-cse2106-oop-project',
    title: 'Term Project: Library Management System - Full C++ Source Code',
    description: 'Complete object-oriented semester project in C++ featuring file handling, book issuing/return logic, fine calculation, and student account persistence.',
    courseCode: 'CSE 2106',
    courseName: 'Data Structures & Algorithms Sessional',
    department: 'Computer Science & Engineering',
    semester: 'Level 2 / Term 1',
    resourceType: 'Lab Reports',
    academicMetadata: {
      section: 'sessional',
      batch: '12',
      labNumber: 'Project',
    },
    contentSource: 'Created by me',
    fileUrl: '/samples/cse2106-project-source.zip',
    fileName: 'Library_Management_System_CPP.zip',
    fileSize: '6.8 MB',
    realUploaderId: 'user_student',
    realUploaderEmail: 'student@demo.com',
    realUploaderName: 'Tanvir Hasan',
    displayMode: 'PROFILE',
    publicDisplayIdentity: 'Tanvir Hasan',
    tags: ['Project', 'Sessional', 'OOP', 'Batch12', 'CSE 2106'],
    qualityScore: 90,
    rating: 4.5,
    ratingCount: 2,
    downloadsCount: 65,
    bookmarksCount: 22,
    createdAt: '2024-03-01',
    fileHash: 'sha256:cse2106projectdemohash',
    reviews: [],
  },
];

// LocalStorage Persistence Keys
const STORAGE_KEY_RESOURCES = 'peers_charity_resources_v3';
const STORAGE_KEY_SAVED_IDS = 'peers_charity_saved_ids_v3';
const STORAGE_KEY_DOWNLOADED_IDS = 'peers_charity_downloaded_ids_v3';
const STORAGE_KEY_REPORTS = 'peers_charity_reports_v3';

export function getResources(): Resource[] {
  if (typeof window === 'undefined') return INITIAL_RESOURCES;
  try {
    const data = localStorage.getItem(STORAGE_KEY_RESOURCES);
    if (data) {
      const parsed = JSON.parse(data);
      // Auto-heal empty array cache so users never see an empty screen
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse resources from localStorage', e);
  }
  // Initialize with verified initial seed resources
  try {
    localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(INITIAL_RESOURCES));
  } catch {}
  return INITIAL_RESOURCES;
}

export function saveResources(resources: Resource[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(resources));
  } catch (e) {
    console.error('Failed to save resources to localStorage', e);
  }
}

/**
 * Dynamically fetches live resources from Express/MongoDB API,
 * reconciles with localStorage, and returns live dataset.
 */
export async function fetchAndSyncResources(): Promise<Resource[]> {
  try {
    const { fetchResourcesApi, apiResourceToFrontend } = await import('./api');
    const apiItems = await fetchResourcesApi();
    if (apiItems && apiItems.length > 0) {
      const mapped = apiItems.map(apiResourceToFrontend);
      saveResources(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('[Data Sync] Could not fetch live API resources, falling back to local dataset:', err);
  }
  return getResources();
}

export function addResource(newRes: Omit<Resource, 'id' | 'createdAt' | 'qualityScore' | 'rating' | 'ratingCount' | 'downloadsCount' | 'bookmarksCount' | 'fileHash' | 'reviews'> & { fileHash?: string }): Resource {
  const current = getResources();
  const created: Resource = {
    ...newRes,
    id: `res-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    qualityScore: 95,
    rating: 5.0,
    ratingCount: 1,
    downloadsCount: 0,
    bookmarksCount: 0,
    fileHash: newRes.fileHash || `sha256:${Math.random().toString(36).substring(2)}${Date.now()}`,
    reviews: [],
  };
  const updated = [created, ...current];
  saveResources(updated);
  return created;
}

export function getSavedResourceIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY_SAVED_IDS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleSaveResource(id: string): string[] {
  const current = getSavedResourceIds();
  const updated = current.includes(id)
    ? current.filter((i) => i !== id)
    : [...current, id];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_SAVED_IDS, JSON.stringify(updated));
  }
  // Update bookmarks count in resources
  const resources = getResources();
  const resIndex = resources.findIndex((r) => r.id === id);
  if (resIndex !== -1) {
    resources[resIndex].bookmarksCount += current.includes(id) ? -1 : 1;
    saveResources(resources);
  }
  return updated;
}

export function getDownloadedResourceIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY_DOWNLOADED_IDS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function recordDownload(id: string): string[] {
  const current = getDownloadedResourceIds();
  const updated = current.includes(id) ? current : [...current, id];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_DOWNLOADED_IDS, JSON.stringify(updated));
  }
  const resources = getResources();
  const resIndex = resources.findIndex((r) => r.id === id);
  if (resIndex !== -1) {
    resources[resIndex].downloadsCount += 1;
    saveResources(resources);
  }
  return updated;
}

export function addReview(resourceId: string, review: Omit<ResourceReview, 'id' | 'createdAt'>): Resource | null {
  const resources = getResources();
  const index = resources.findIndex((r) => r.id === resourceId);
  if (index === -1) return null;

  const newReview: ResourceReview = {
    ...review,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
  };

  const target = resources[index];
  const updatedReviews = [newReview, ...target.reviews];
  
  // Calculate new average rating
  const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = Number((totalRating / updatedReviews.length).toFixed(1));

  resources[index] = {
    ...target,
    reviews: updatedReviews,
    rating: avgRating,
    ratingCount: updatedReviews.length,
  };

  saveResources(resources);
  return resources[index];
}

// Reports System
export function getReports(): ResourceReport[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY_REPORTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function reportResource(reportData: Omit<ResourceReport, 'id' | 'createdAt' | 'status'>): ResourceReport {
  const current = getReports();
  const newReport: ResourceReport = {
    ...reportData,
    id: `rep-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    status: 'PENDING',
  };
  const updated = [newReport, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
  }
  return newReport;
}

export function resolveReport(reportId: string, status: 'RESOLVED' | 'DISMISSED', removeResource?: boolean): void {
  const current = getReports();
  const updatedReports = current.map((r) => (r.id === reportId ? { ...r, status } : r));
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updatedReports));
  }

  if (removeResource) {
    const report = current.find((r) => r.id === reportId);
    if (report) {
      const resources = getResources().filter((res) => res.id !== report.resourceId);
      saveResources(resources);
    }
  }
}

export function resetAllUserData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_RESOURCES);
  localStorage.removeItem(STORAGE_KEY_SAVED_IDS);
  localStorage.removeItem(STORAGE_KEY_DOWNLOADED_IDS);
  localStorage.removeItem(STORAGE_KEY_REPORTS);
  localStorage.removeItem('peers-charity-user');
  localStorage.removeItem('peers-charity-registered-accounts');
  // Re-initialize clean state
  localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(INITIAL_RESOURCES));
}
