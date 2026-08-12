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

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-01',
    title: 'SQL Normalization — Quick Notes (1NF, 2NF, 3NF & BCNF)',
    description: 'Short exam-focused notes covering SQL normal forms with step-by-step table decomposition examples, functional dependency rules, and key identification.',
    courseCode: 'CSE 2103',
    courseName: 'Database Systems',
    department: 'Computer Science & Engineering',
    semester: 'Level 2 / Term 1',
    resourceType: 'Notes',
    contentSource: 'Created by me',
    fileUrl: '/samples/sql-normalization-notes.pdf',
    fileName: 'SQL_Normalization_QuickNotes_CSE2103.pdf',
    fileSize: '2.4 MB',
    realUploaderId: 'user-nayem',
    realUploaderEmail: 'nayem@student.university.edu',
    realUploaderName: 'Nayem',
    displayMode: 'ANONYMOUS',
    publicDisplayIdentity: 'Shared Anonymously',
    tags: ['DBMS', 'SQL', 'Normalization', 'Functional Dependencies', 'Exam Prep'],
    qualityScore: 98,
    rating: 4.9,
    ratingCount: 32,
    downloadsCount: 184,
    bookmarksCount: 45,
    createdAt: '2026-08-10',
    fileHash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    previewText: `SQL Normalization Quick Reference:
1. 1NF (First Normal Form): Eliminate repeating groups; ensure all attributes are atomic.
2. 2NF (Second Normal Form): Must be in 1NF and no partial dependencies (non-prime attributes fully dependent on candidate key).
3. 3NF (Third Normal Form): Must be in 2NF and no transitive dependencies (X -> Y where neither is a superkey).
4. BCNF (Boyce-Codd Normal Form): For every non-trivial functional dependency X -> Y, X must be a superkey.`,
    reviews: [
      { id: 'rev-1', userId: 'user-2', userName: 'Rahim (CSE L2T1)', rating: 5, comment: 'Saved me during the DBMS midterm! Extremely clear BCNF examples.', createdAt: '2026-08-11' },
      { id: 'rev-2', userId: 'user-3', userName: 'Tania S.', rating: 5, comment: 'Clean diagrams and concise explanations.', createdAt: '2026-08-11' }
    ]
  },
  {
    id: 'res-02',
    title: 'CSE 3101: Operating Systems Memory Management & Paging Slides',
    description: 'Annotated lecture presentation slides on Virtual Memory, Page Fault Handling, TLB architecture, and Page Replacement Algorithms (FIFO, LRU, Optimal).',
    courseCode: 'CSE 3101',
    courseName: 'Operating Systems',
    department: 'Computer Science & Engineering',
    semester: 'Level 3 / Term 1',
    resourceType: 'Slides',
    contentSource: 'Shared with permission',
    fileUrl: '/samples/os-memory-management.pptx',
    fileName: 'OS_Lec08_Memory_Management_Paging.pptx',
    fileSize: '6.8 MB',
    realUploaderId: 'user-admin',
    realUploaderEmail: 'admin@university.edu',
    realUploaderName: 'Faculty Admin',
    displayMode: 'PROFILE',
    publicDisplayIdentity: 'Faculty Admin',
    tags: ['Operating Systems', 'Memory Management', 'Paging', 'TLB', 'LRU'],
    qualityScore: 99,
    rating: 5.0,
    ratingCount: 48,
    downloadsCount: 310,
    bookmarksCount: 78,
    createdAt: '2026-08-08',
    fileHash: 'sha256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    previewText: `Operating Systems — Lecture 08: Memory Management
- Virtual Memory & Physical Frames
- Translation Lookaside Buffer (TLB) Page Table Lookup Time = Hit Rate * (TLB + RAM) + Miss Rate * (2 * RAM)
- Page Replacement Algorithms: LRU, Optimal (Belady's Anomaly in FIFO)`,
    reviews: [
      { id: 'rev-3', userId: 'user-4', userName: 'Farhan Z.', rating: 5, comment: 'Official slides with prof notes included. Must read for finals.', createdAt: '2026-08-09' }
    ]
  },
  {
    id: 'res-03',
    title: 'Dynamic Programming Master Formula Sheet & Code Templates',
    description: 'Comprehensive DP compilation covering 0/1 Knapsack, Longest Common Subsequence (LCS), Edit Distance, Matrix Chain Multiplication with Python/C++ code.',
    courseCode: 'CSE 2103',
    courseName: 'Data Structures & Algorithms',
    department: 'Computer Science & Engineering',
    semester: 'Level 2 / Term 1',
    resourceType: 'PDF',
    contentSource: 'Created by me',
    fileUrl: '/samples/dp-master-sheet.pdf',
    fileName: 'DP_Master_CheatSheet_CSE2103.pdf',
    fileSize: '3.5 MB',
    realUploaderId: 'user-nayem',
    realUploaderEmail: 'nayem@student.university.edu',
    realUploaderName: 'Nayem',
    displayMode: 'CUSTOM',
    customDisplayName: 'AlgoMaster_Pro',
    publicDisplayIdentity: 'AlgoMaster_Pro',
    tags: ['Algorithms', 'Dynamic Programming', 'Knapsack', 'LCS', 'Memoization'],
    qualityScore: 97,
    rating: 4.8,
    ratingCount: 29,
    downloadsCount: 245,
    bookmarksCount: 62,
    createdAt: '2026-08-05',
    fileHash: 'sha256:9f8a7c6b5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b',
    previewText: `Dynamic Programming Core Patterns:
1. 0/1 Knapsack: dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w-wt[i-1]])
2. LCS: dp[i][j] = dp[i-1][j-1] + 1 if str1[i-1] == str2[j-1] else max(dp[i-1][j], dp[i][j-1])
3. Edit Distance: dp[i][j] = min(Insert, Delete, Replace) + 1`,
    reviews: []
  },
  {
    id: 'res-04',
    title: 'VisuAlgo — Interactive Algorithm & Data Structure Visualizations',
    description: 'Interactive online tool for visualizing Sorting algorithms, Graph Traversal (DFS/BFS), Shortest Paths (Dijkstra), and Binary Search Trees.',
    courseCode: 'CSE 2103',
    courseName: 'Data Structures & Algorithms',
    department: 'Computer Science & Engineering',
    semester: 'Level 2 / Term 1',
    resourceType: 'External Link',
    contentSource: 'External link',
    externalUrl: 'https://visualgo.net/en',
    realUploaderId: 'user-nayem',
    realUploaderEmail: 'nayem@student.university.edu',
    realUploaderName: 'Nayem',
    displayMode: 'PROFILE',
    publicDisplayIdentity: 'Nayem (Level 3 / Term 2)',
    tags: ['Visualization', 'Data Structures', 'Graphs', 'Sorting', 'External Resource'],
    qualityScore: 100,
    rating: 5.0,
    ratingCount: 54,
    downloadsCount: 420,
    bookmarksCount: 110,
    createdAt: '2026-08-01',
    fileHash: 'sha256:external_link_visualgo_001',
    previewText: 'VisuAlgo was conceptualised in 2011 by Dr Steven Halim to help students understand data structures and algorithms through step-by-step visual animation.',
    reviews: []
  },
  {
    id: 'res-05',
    title: 'CSE 3205: Artificial Intelligence Past Questions & Solutions (2020-2025)',
    description: 'Complete compiled collection of university exam question papers with handwritten step-by-step solutions for A* Search, Alpha-Beta Pruning, and Bayesian Networks.',
    courseCode: 'CSE 3205',
    courseName: 'Artificial Intelligence',
    department: 'Computer Science & Engineering',
    semester: 'Level 3 / Term 2',
    resourceType: 'PDF',
    contentSource: 'Shared with permission',
    fileUrl: '/samples/ai-past-questions-solved.pdf',
    fileName: 'AI_PastQuestions_2020_2025_Solved.pdf',
    fileSize: '12.4 MB',
    realUploaderId: 'user-sarah',
    realUploaderEmail: 'sarah.k@student.university.edu',
    realUploaderName: 'Sarah K.',
    displayMode: 'PROFILE',
    publicDisplayIdentity: 'Sarah K. (Senior Benefactor)',
    tags: ['Artificial Intelligence', 'Past Questions', 'A* Search', 'Alpha-Beta', 'Probability'],
    qualityScore: 96,
    rating: 4.8,
    ratingCount: 22,
    downloadsCount: 195,
    bookmarksCount: 50,
    createdAt: '2026-08-03',
    fileHash: 'sha256:7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b',
    previewText: `CSE 3205 Final Exam Solution Bank:
- Problem 1: A* Search heuristic admissibility check f(n) = g(n) + h(n).
- Problem 2: Minimax Tree Pruning step-by-step alpha (α) and beta (β) cutoff derivations.
- Problem 3: Naive Bayes Classification calculations on table data.`,
    reviews: []
  },
  {
    id: 'res-06',
    title: 'Theory of Computation (TOC): DFA & NFA State Minimization Notes',
    description: 'Handwritten scanned notes explaining Deterministic Finite Automata (DFA), Non-deterministic Finite Automata (NFA), Regular Expressions, and Myhill-Nerode Minimization.',
    courseCode: 'CSE 3103',
    courseName: 'Theory of Computation',
    department: 'Computer Science & Engineering',
    semester: 'Level 3 / Term 1',
    resourceType: 'Notes',
    contentSource: 'Created by me',
    fileUrl: '/samples/toc-dfa-nfa-minimization.pdf',
    fileName: 'TOC_DFA_NFA_Minimization_Handwritten.pdf',
    fileSize: '5.1 MB',
    realUploaderId: 'user-nayem',
    realUploaderEmail: 'nayem@student.university.edu',
    realUploaderName: 'Nayem',
    displayMode: 'ANONYMOUS',
    publicDisplayIdentity: 'Shared Anonymously',
    tags: ['TOC', 'Automata', 'DFA', 'NFA', 'Handwritten Notes'],
    qualityScore: 94,
    rating: 4.7,
    ratingCount: 18,
    downloadsCount: 128,
    bookmarksCount: 31,
    createdAt: '2026-08-02',
    fileHash: 'sha256:8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a',
    previewText: `TOC Automata Summary:
1. DFA: Q x Σ -> Q (Deterministic single transition per input symbol)
2. NFA to DFA Conversion: Subset construction method (2^Q states)
3. Equivalence Partitioning for Minimization: Distinguishable state pairs table.`,
    reviews: []
  },
  {
    id: 'res-07',
    title: 'MATH 2101: Linear Algebra Matrix Transformations & Eigenvalues',
    description: 'Clear, concise handwritten formula sheets detailing Matrix Diagonalization, Vector Spaces, Gram-Schmidt Orthogonalization, and Eigenvalue calculations.',
    courseCode: 'MATH 2101',
    courseName: 'Linear Algebra & Coordinate Geometry',
    department: 'Mathematics & Natural Sciences',
    semester: 'Level 2 / Term 1',
    resourceType: 'Notes',
    contentSource: 'Created by me',
    fileUrl: '/samples/math2101-linear-algebra.pdf',
    fileName: 'MATH2101_Linear_Algebra_Eigenvalues.pdf',
    fileSize: '3.8 MB',
    realUploaderId: 'user-student5',
    realUploaderEmail: 'tanvir@student.university.edu',
    realUploaderName: 'Tanvir A.',
    displayMode: 'PROFILE',
    publicDisplayIdentity: 'Tanvir A. (Math Scholar)',
    tags: ['Linear Algebra', 'Matrices', 'Eigenvalues', 'Gram-Schmidt', 'Vector Spaces'],
    qualityScore: 95,
    rating: 4.8,
    ratingCount: 16,
    downloadsCount: 112,
    bookmarksCount: 28,
    createdAt: '2026-07-28',
    fileHash: 'sha256:5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0f1e2d3c4b5a6f',
    previewText: `Linear Algebra Essentials:
- Characteristic Equation: det(A - λI) = 0
- Eigenvectors: (A - λI)v = 0
- Diagonalization: A = PDP^-1 where P consists of eigenvectors and D has eigenvalues on diagonal.`,
    reviews: []
  },
  {
    id: 'res-08',
    title: 'GeeksforGeeks — DBMS Interactive SQL Quiz & Practice Portal',
    description: 'Direct link to GeeksforGeeks interactive database management tutorial series, SQL query challenges, and index structure guides.',
    courseCode: 'CSE 2103',
    courseName: 'Database Systems',
    department: 'Computer Science & Engineering',
    semester: 'Level 2 / Term 1',
    resourceType: 'External Link',
    contentSource: 'External link',
    externalUrl: 'https://www.geeksforgeeks.org/dbms/',
    realUploaderId: 'user-admin',
    realUploaderEmail: 'admin@university.edu',
    realUploaderName: 'Faculty Admin',
    displayMode: 'PROFILE',
    publicDisplayIdentity: 'Faculty Admin',
    tags: ['DBMS', 'SQL', 'Practice', 'GeeksforGeeks', 'External Resource'],
    qualityScore: 99,
    rating: 4.9,
    ratingCount: 40,
    downloadsCount: 380,
    bookmarksCount: 95,
    createdAt: '2026-07-25',
    fileHash: 'sha256:external_link_gfg_dbms_002',
    previewText: 'A comprehensive collection of tutorials covering ER Diagrams, Relational Algebra, B+ Trees, Indexing, and Transaction Concurrency Control.',
    reviews: []
  },
  {
    id: 'res-09',
    title: 'EEE 2101: Electrical Circuits AC/DC Analysis & Kirchhoff Laws',
    description: 'Problem-solving guide for Node Voltage Analysis, Mesh Current Analysis, Thevenin & Norton Theorems, and Phasor AC Circuit Analysis.',
    courseCode: 'EEE 2101',
    courseName: 'Electrical Circuits I',
    department: 'Electrical & Electronic Engineering',
    semester: 'Level 1 / Term 2',
    resourceType: 'PDF',
    contentSource: 'Public resource',
    fileUrl: '/samples/eee2101-circuit-analysis.pdf',
    fileName: 'EEE2101_Circuit_Analysis_SolvedProblems.pdf',
    fileSize: '4.7 MB',
    realUploaderId: 'user-student6',
    realUploaderEmail: 'arif.h@student.university.edu',
    realUploaderName: 'Arif H.',
    displayMode: 'ANONYMOUS',
    publicDisplayIdentity: 'Shared Anonymously',
    tags: ['EEE', 'Circuits', 'Kirchhoff Laws', 'Thevenin Theorem', 'Mesh Analysis'],
    qualityScore: 93,
    rating: 4.6,
    ratingCount: 14,
    downloadsCount: 94,
    bookmarksCount: 21,
    createdAt: '2026-07-20',
    fileHash: 'sha256:4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e',
    previewText: `Circuit Analysis Quick Formulas:
- KCL: Σ I_in = Σ I_out (At any node)
- KVL: Σ V_around_loop = 0
- Thevenin Equivalent: R_th = V_oc / I_sc`,
    reviews: []
  },
  {
    id: 'res-10',
    title: 'CSE 1101: Structured Programming C Language Final Lab Manual',
    description: 'Complete C programming lab manual containing 20 exercises with code solutions: Pointers, Dynamic Memory Allocation (malloc/calloc), Structs, and File I/O.',
    courseCode: 'CSE 1101',
    courseName: 'Structured Programming Language',
    department: 'Computer Science & Engineering',
    semester: 'Level 1 / Term 1',
    resourceType: 'Slides',
    contentSource: 'Shared with permission',
    fileUrl: '/samples/c-programming-lab-manual.pptx',
    fileName: 'CSE1101_C_Programming_Lab_Manual.pptx',
    fileSize: '7.2 MB',
    realUploaderId: 'user-admin',
    realUploaderEmail: 'admin@university.edu',
    realUploaderName: 'Faculty Admin',
    displayMode: 'PROFILE',
    publicDisplayIdentity: 'Faculty Admin',
    tags: ['C Programming', 'Lab Manual', 'Pointers', 'Structures', 'File I/O'],
    qualityScore: 98,
    rating: 4.9,
    ratingCount: 36,
    downloadsCount: 260,
    bookmarksCount: 70,
    createdAt: '2026-07-15',
    fileHash: 'sha256:3a4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f',
    previewText: `C Programming Lab Manual Exercises:
- Ex 1: Pointer Arithmetic & Array Indexing
- Ex 2: Dynamic Memory Allocation using malloc() and free()
- Ex 3: File Pointer operations (fopen, fprintf, fscanf, fclose)`,
    reviews: []
  }
];

// LocalStorage Persistence Keys
const STORAGE_KEY_RESOURCES = 'peers_charity_resources_v2';
const STORAGE_KEY_SAVED_IDS = 'peers_charity_saved_ids_v2';
const STORAGE_KEY_DOWNLOADED_IDS = 'peers_charity_downloaded_ids_v2';
const STORAGE_KEY_REPORTS = 'peers_charity_reports_v2';

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
  // Initialize with seed data
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
    return data ? JSON.parse(data) : [
      {
        id: 'rep-1',
        resourceId: 'res-06',
        resourceTitle: 'Theory of Computation (TOC): DFA & NFA State Minimization Notes',
        reporterId: 'user-peer1',
        reporterName: 'Anonymous Student',
        reason: 'Copyright/ownership concern',
        details: 'Scanned pages closely resemble university lecture slides copyrighted by the course coordinator.',
        createdAt: '2026-08-11',
        status: 'PENDING'
      }
    ];
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
  // Re-initialize default seed catalog
  localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(INITIAL_RESOURCES));
}
