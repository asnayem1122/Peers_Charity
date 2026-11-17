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
 * reconciles with localStorage without overwriting locally added items,
 * and returns the unified live dataset.
 */
export async function fetchAndSyncResources(): Promise<Resource[]> {
  try {
    const { fetchResourcesApi, apiResourceToFrontend } = await import('./api');
    const apiItems = await fetchResourcesApi();
    const currentLocal = getResources();

    if (apiItems && apiItems.length > 0) {
      const mappedApi = apiItems.map(apiResourceToFrontend);

      // Preserve any locally added resources that are not on the API server
      const apiIds = new Set(mappedApi.map((item) => item.id));
      const apiHashes = new Set(mappedApi.map((item) => item.fileHash).filter(Boolean));
      const apiTitles = new Set(
        mappedApi.map((item) => `${item.title.toLowerCase()}::${item.courseCode.toLowerCase()}`)
      );

      const localOnly = currentLocal.filter((localItem) => {
        if (apiIds.has(localItem.id)) return false;
        if (localItem.fileHash && apiHashes.has(localItem.fileHash)) return false;
        if (apiTitles.has(`${localItem.title.toLowerCase()}::${localItem.courseCode.toLowerCase()}`)) return false;
        return true;
      });

      // Combined dataset: local additions at the top, followed by canonical API items with metadata preservation
      const mergedApi = mappedApi.map((apiItem) => {
        const matchingLocal = currentLocal.find(
          (l) => l.id === apiItem.id || (l.title.toLowerCase() === apiItem.title.toLowerCase() && l.courseCode.toLowerCase() === apiItem.courseCode.toLowerCase())
        );
        if (matchingLocal) {
          return {
            ...apiItem,
            fileName: apiItem.fileName || matchingLocal.fileName,
            fileSize: apiItem.fileSize || matchingLocal.fileSize,
            realUploaderId: apiItem.realUploaderId && apiItem.realUploaderId !== 'uploader_demo' ? apiItem.realUploaderId : matchingLocal.realUploaderId,
            realUploaderEmail: apiItem.realUploaderEmail && apiItem.realUploaderEmail !== 'benefactor@demo.com' ? apiItem.realUploaderEmail : matchingLocal.realUploaderEmail,
            realUploaderName: apiItem.realUploaderName && apiItem.realUploaderName !== 'Academic Benefactor' ? apiItem.realUploaderName : matchingLocal.realUploaderName,
          };
        }
        return apiItem;
      });

      const combined = [...localOnly, ...mergedApi];
      saveResources(combined);
      return combined;
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

export function updateResource(id: string, updates: Partial<Resource>): Resource | null {
  const current = getResources();
  const index = current.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const target = current[index];
  const updated: Resource = {
    ...target,
    ...updates,
    id: target.id,
    academicMetadata: updates.academicMetadata
      ? { ...target.academicMetadata, ...updates.academicMetadata }
      : target.academicMetadata,
  };

  current[index] = updated;
  saveResources(current);
  return updated;
}

export function deleteResource(id: string): boolean {
  const current = getResources();
  const filtered = current.filter((r) => r.id !== id);
  if (filtered.length === current.length) return false;

  saveResources(filtered);
  return true;
}

function getStorageKeyForUser(userId?: string): string {
  if (userId) {
    return `${STORAGE_KEY_SAVED_IDS}_${userId}`;
  }
  return STORAGE_KEY_SAVED_IDS;
}

export function getSavedResourceIds(userId?: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = getStorageKeyForUser(userId);
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);

    // Fallback to legacy global key if user-specific key is not set yet
    if (userId) {
      const legacy = localStorage.getItem(STORAGE_KEY_SAVED_IDS);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        localStorage.setItem(key, legacy);
        return parsed;
      }
    }
    return [];
  } catch {
    return [];
  }
}

export function isResourceSaved(id: string, userId?: string): boolean {
  return getSavedResourceIds(userId).includes(id);
}

export function toggleSaveResource(id: string, userId?: string): string[] {
  const current = getSavedResourceIds(userId);
  const updated = current.includes(id)
    ? current.filter((i) => i !== id)
    : [...current, id];
  if (typeof window !== 'undefined') {
    const key = getStorageKeyForUser(userId);
    localStorage.setItem(key, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEY_SAVED_IDS, JSON.stringify(updated));
  }
  // Update bookmarks count in resources
  const resources = getResources();
  const resIndex = resources.findIndex((r) => r.id === id);
  if (resIndex !== -1) {
    const delta = current.includes(id) ? -1 : 1;
    resources[resIndex].bookmarksCount = Math.max(0, (resources[resIndex].bookmarksCount || 0) + delta);
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
    resources[resIndex].downloadsCount = (resources[resIndex].downloadsCount || 0) + 1;
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
