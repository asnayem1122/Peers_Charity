'use client';

export type {
  ResourceType,
  AcademicSection,
  ExamType,
  MaterialType,
  AcademicMetadata,
  DisplayMode,
  ContentSource,
  ResourceReview,
  ResourceReport,
  Resource,
} from './initial-resources';

import {
  Resource,
  INITIAL_RESOURCES,
  ResourceReview,
  ResourceReport,
} from './initial-resources';
export { INITIAL_RESOURCES };

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? window.location.origin
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:5000');


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
