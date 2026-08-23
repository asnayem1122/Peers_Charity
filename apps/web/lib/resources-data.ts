'use client';

export type ResourceType = 'Notes' | 'Slides' | 'PDF' | 'External Link';

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

// Clean Initial Resources (No mock contributions)
export const INITIAL_RESOURCES: Resource[] = [];

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
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse resources from localStorage', e);
  }
  // Initialize with clean state
  localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(INITIAL_RESOURCES));
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
