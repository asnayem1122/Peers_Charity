import { Resource, AcademicSection, ExamType, MaterialType, ResourceType } from './resources-data';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ApiResource {
  _id: string;
  title: string;
  description?: string;
  uploaderId?: string;
  universityId?: { _id: string; name: string; code: string } | string;
  departmentId?: { _id: string; name: string; code: string } | string;
  courseId?: { _id: string; title: string; code: string } | string;
  teacherId?: { _id: string; name: string; title: string } | string;
  semester?: string;
  academicMetadata?: {
    section: AcademicSection;
    semester?: string;
    courseId?: string;
    batch: string;
    examType?: ExamType;
    materialType?: MaterialType;
    externalLink?: string;
    labNumber?: string | number;
  };
  resourceType?: string;
  topics?: string[];
  tags?: string[];
  fileUrl?: string;
  fileKey?: string;
  mimeType?: string;
  sizeBytes?: number;
  status?: string;
  qualityScore?: number;
  stats?: {
    viewsCount?: number;
    downloadsCount?: number;
    ratingsCount?: number;
    averageRating?: number;
    bookmarksCount?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Maps an Express / MongoDB backend resource into the frontend Resource model
 */
export function apiResourceToFrontend(r: ApiResource): Resource {
  const courseCode =
    typeof r.courseId === 'object' && r.courseId?.code
      ? r.courseId.code
      : typeof r.courseId === 'string'
      ? r.courseId
      : 'CSE 2103';

  const courseName =
    typeof r.courseId === 'object' && r.courseId?.title
      ? r.courseId.title
      : `${courseCode} Course Material`;

  const department =
    typeof r.departmentId === 'object' && r.departmentId?.name
      ? r.departmentId.name
      : 'Computer Science & Engineering';

  let mappedType: ResourceType = 'Notes';
  if (r.resourceType) {
    mappedType = r.resourceType as ResourceType;
  } else if (r.academicMetadata?.section === 'question') {
    mappedType = 'Previous Exam Questions';
  } else if (r.academicMetadata?.section === 'sessional') {
    mappedType = 'Lab Reports';
  } else if (r.academicMetadata?.materialType === 'SLIDES') {
    mappedType = 'Presentations';
  } else if (r.academicMetadata?.materialType === 'EXTERNAL_LINK') {
    mappedType = 'External Link';
  }

  return {
    id: r._id,
    title: r.title,
    description: r.description || 'Verified academic contribution shared with peers.',
    courseCode,
    courseName,
    department,
    semester: r.semester || r.academicMetadata?.semester || 'Level 2 / Term 1',
    resourceType: mappedType,
    academicMetadata: r.academicMetadata
      ? {
          ...r.academicMetadata,
          labNumber: r.academicMetadata.labNumber ? String(r.academicMetadata.labNumber) : undefined,
        }
      : undefined,
    contentSource:
      r.academicMetadata?.materialType === 'EXTERNAL_LINK' ? 'External link' : 'Created by me',
    fileUrl: r.fileUrl,
    fileName: r.title ? `${r.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf` : undefined,
    fileSize: r.sizeBytes ? `${(r.sizeBytes / (1024 * 1024)).toFixed(1)} MB` : undefined,
    externalUrl: r.academicMetadata?.externalLink,
    realUploaderId: r.uploaderId || 'uploader_demo',
    realUploaderEmail: 'benefactor@demo.com',
    realUploaderName: 'Academic Benefactor',
    displayMode: 'PROFILE',
    publicDisplayIdentity: 'Academic Benefactor',
    tags: r.tags && r.tags.length > 0 ? r.tags : [courseCode, r.academicMetadata?.section || 'Resource'],
    qualityScore: r.qualityScore || 85,
    rating: r.stats?.averageRating || 4.5,
    ratingCount: r.stats?.ratingsCount || 1,
    downloadsCount: r.stats?.downloadsCount || 0,
    bookmarksCount: r.stats?.bookmarksCount || 0,
    createdAt: r.createdAt
      ? new Date(r.createdAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    fileHash: r.fileKey || `sha256:${r._id}`,
    reviews: [],
  };
}

/**
 * Fetches published resources from the backend API with timeout and graceful error recovery
 */
export async function fetchResourcesApi(params?: Record<string, string>): Promise<ApiResource[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/resources`);
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val && val !== 'ALL') {
          url.searchParams.set(key, val);
        }
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[API Client] fetchResources returned HTTP ${response.status}`);
      return [];
    }

    const json = await response.json();
    if (json && json.success && Array.isArray(json.data)) {
      return json.data;
    }
    return [];
  } catch (error: any) {
    // Graceful fallback in case backend is offline, CORS blocked, or unconfigured
    console.warn('[API Client] Backend unreachable or CORS issue, serving local cache:', error?.message || error);
    return [];
  }
}

/**
 * Fetches a single resource by ID from the backend API
 */
export async function fetchResourceByIdApi(id: string): Promise<ApiResource | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/api/resources/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const json = await response.json();
    return json.data || null;
  } catch {
    return null;
  }
}

/**
 * Records a download event on the backend API telemetry
 */
export async function apiRecordDownload(resourceId: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/api/engagement/${encodeURIComponent(resourceId)}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Toggles a bookmark in the user's treasure vault on the backend API
 */
export async function apiToggleBookmark(resourceId: string): Promise<boolean | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/api/engagement/${encodeURIComponent(resourceId)}/bookmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!response.ok) return null;
    const json = await response.json();
    return json?.data?.bookmarked ?? null;
  } catch {
    return null;
  }
}

/**
 * Submits a peer review for a resource on the backend API
 */
export async function apiSubmitReview(resourceId: string, content: string): Promise<any> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/api/engagement/${encodeURIComponent(resourceId)}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
      credentials: 'include',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!response.ok) return null;
    const json = await response.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

/**
 * Submits a rating (1-5 stars) for a resource on the backend API
 */
export async function apiSubmitRating(
  resourceId: string,
  stars: number
): Promise<{ averageRating: number; qualityScore: number } | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/api/engagement/${encodeURIComponent(resourceId)}/rating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stars }),
      credentials: 'include',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!response.ok) return null;
    const json = await response.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

/**
 * Submits an academic integrity moderation report on the backend API
 */
export async function apiSubmitReport(resourceId: string, reason: string, details: string): Promise<any> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/api/engagement/${encodeURIComponent(resourceId)}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason, details }),
      credentials: 'include',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!response.ok) return null;
    const json = await response.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

