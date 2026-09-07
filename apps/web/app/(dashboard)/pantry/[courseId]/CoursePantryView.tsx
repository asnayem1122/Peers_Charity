'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Flame, Star, Download, Bookmark, PlusCircle, FileText, ArrowLeft } from 'lucide-react';
import { getResources, fetchAndSyncResources, Resource } from '@/lib/resources-data';
import ResourceDetailModal from '@/components/ui/resource-detail-modal';
import ReportResourceModal from '@/components/ui/report-resource-modal';
import GuestAuthModal from '@/components/ui/guest-auth-modal';

export default function CoursePantryView({ courseId }: { courseId: string }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'materials' | 'sessional' | 'all'>('overview');
  const [courseResources, setCourseResources] = useState<Resource[]>([]);

  // Modal states
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ id: string; title: string }>({ id: '', title: '' });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authActionName, setAuthActionName] = useState('access this feature');

  const formattedCode = courseId.toUpperCase().replace('-', ' ');

  const loadData = useCallback(() => {
    const all = getResources();
    const filtered = all.filter((r) => r.courseCode.toUpperCase() === formattedCode);
    setCourseResources(filtered);

    fetchAndSyncResources().then((live) => {
      if (live && live.length > 0) {
        const liveFiltered = live.filter((r) => r.courseCode.toUpperCase() === formattedCode);
        setCourseResources(liveFiltered);
      }
    });
  }, [formattedCode]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const courseMeta = {
    'CSE-2103': {
      name: 'Database Systems',
      dept: 'Computer Science & Engineering',
      instructor: 'Department Faculty',
      desc: 'Relational database design, ER modeling, normalization (1NF-BCNF), relational algebra, and complex SQL transaction processing.',
    },
    'CSE-2104': {
      name: 'Database Systems Sessional',
      dept: 'Computer Science & Engineering',
      instructor: 'Department Faculty',
      desc: 'Practical lab implementations in Oracle SQL, PL/SQL stored procedures, triggers, indexing, and end-to-end database schema modeling.',
    },
    'CSE-2105': {
      name: 'Data Structures & Algorithms',
      dept: 'Computer Science & Engineering',
      instructor: 'Department Faculty',
      desc: 'Balanced BSTs, heaps, graph traversals (BFS/DFS), shortest paths (Dijkstra, Bellman-Ford), and dynamic programming paradigms.',
    },
    'CSE-2106': {
      name: 'Data Structures & Algorithms Sessional',
      dept: 'Computer Science & Engineering',
      instructor: 'Department Faculty',
      desc: 'C++ implementations of complex data structures, algorithmic benchmark performance, and competitive coding lab challenges.',
    },
    'CSE-3101': {
      name: 'Operating Systems Architecture',
      dept: 'Computer Science & Engineering',
      instructor: 'Department Faculty',
      desc: 'Process Scheduling, Inter-process Communication, Virtual Memory, TLB Paging, Semaphores, and Deadlock Prevention.',
    },
    'CSE-3205': {
      name: 'Artificial Intelligence & Neural Nets',
      dept: 'Computer Science & Engineering',
      instructor: 'Department Faculty',
      desc: 'Heuristic Search (A*, Minimax), Alpha-Beta Pruning, Naive Bayes Classification, and Convolutional Neural Networks.',
    },
    'EEE-1201': {
      name: 'Electrical Circuit Analysis',
      dept: 'Electrical & Electronic Engineering',
      instructor: 'Department Faculty',
      desc: "Kirchhoff's Laws, Thévenin and Norton theorems, AC sinusoidal steady-state analysis, and RLC resonance circuits.",
    },
    'MATH-2101': {
      name: 'Mathematics III - Fourier & Vector Analysis',
      dept: 'Basic Science & Humanities',
      instructor: 'Department Faculty',
      desc: 'Fourier series, Fourier transforms, Laplace transforms, vector differentiation, gradient, divergence, curl, and Green’s theorem.',
    },
  }[courseId.toUpperCase()] || {
    name: `${formattedCode} Course Material`,
    dept: 'Academic Department',
    instructor: 'Department Faculty',
    desc: 'Verified academic resource collection shared by university peers.',
  };

  const totalDownloads = courseResources.reduce((acc, r) => acc + (r.downloadsCount || 0), 0);
  const avgRating = courseResources.length
    ? (courseResources.reduce((acc, r) => acc + r.rating, 0) / courseResources.length).toFixed(1)
    : '—';
  const pantryHealth = courseResources.length > 0 ? Math.min(100, Math.round((courseResources.length / 5) * 100)) : 0;

  const questionResources = courseResources.filter(
    (r) =>
      r.academicMetadata?.section === 'question' ||
      r.resourceType === 'Previous Exam Questions' ||
      r.resourceType === 'Solved Questions'
  );
  const materialResources = courseResources.filter(
    (r) =>
      r.academicMetadata?.section === 'course_material' ||
      r.resourceType === 'Notes' ||
      r.resourceType === 'Slides' ||
      r.resourceType === 'External Link'
  );
  const sessionalResources = courseResources.filter(
    (r) => r.academicMetadata?.section === 'sessional' || r.resourceType === 'Lab Reports'
  );

  const displayedResources =
    activeTab === 'questions'
      ? questionResources
      : activeTab === 'materials'
      ? materialResources
      : activeTab === 'sessional'
      ? sessionalResources
      : courseResources;

  return (
    <div className="space-y-8 font-sans">
      {/* Back Link */}
      <Link href="/pantry" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Courses</span>
      </Link>

      {/* Course Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-xl bg-foreground text-background font-black text-xs tracking-wider uppercase">
              {formattedCode}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-foreground">
              {courseMeta.name}
            </h1>
            <p className="text-xs text-muted-foreground font-sans">
              Instructor: <span className="font-semibold text-foreground">{courseMeta.instructor}</span> • {courseMeta.dept}
            </p>
          </div>

          <Link
            href="/exam"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all self-start sm:self-center"
          >
            <Flame className="w-4 h-4" />
            <span>Open Exam Emergency Room</span>
          </Link>
        </div>

        {/* Pantry Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-background p-4 rounded-2xl border border-border text-center text-xs font-mono">
          <div>
            <span className="block text-2xl font-black text-foreground">{courseResources.length}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              Donated Notes
            </span>
          </div>
          <div>
            <span className="block text-2xl font-black text-foreground">{totalDownloads}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              Total Downloads
            </span>
          </div>
          <div>
            <span className="block text-2xl font-black text-amber-400">{avgRating} {avgRating !== '—' && '⭐'}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              Course Rating
            </span>
          </div>
          <div>
            <span className={`block text-2xl font-black ${pantryHealth > 0 ? 'text-emerald-400' : 'text-muted-foreground'}`}>
              {pantryHealth > 0 ? `${pantryHealth}%` : '0%'}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              {pantryHealth > 0 ? 'Pantry Health' : 'Needs Donations'}
            </span>
          </div>
        </div>
      </div>

      {/* Course Tabs */}
      <div className="border-b border-border flex items-center justify-between text-sm font-bold font-mono overflow-x-auto pb-1">
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-all shrink-0 ${
              activeTab === 'overview' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Pantry Overview
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-3 border-b-2 transition-all shrink-0 ${
              activeTab === 'questions' ? 'border-amber-400 text-amber-400' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            📝 Questions ({questionResources.length})
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`pb-3 border-b-2 transition-all shrink-0 ${
              activeTab === 'materials' ? 'border-blue-400 text-blue-400' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            📖 Materials ({materialResources.length})
          </button>
          <button
            onClick={() => setActiveTab('sessional')}
            className={`pb-3 border-b-2 transition-all shrink-0 ${
              activeTab === 'sessional' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            🔬 Sessional ({sessionalResources.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 border-b-2 transition-all shrink-0 ${
              activeTab === 'all' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({courseResources.length})
          </button>
        </div>

        <Link
          href="/donate"
          className="liquid-metal-btn px-4 py-2 text-xs font-bold font-mono flex items-center gap-1.5 shadow-md hidden sm:inline-flex shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Donate Note for {formattedCode}</span>
        </Link>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-2">
            <h2 className="text-sm font-bold font-mono uppercase text-foreground">Course Description &amp; Syllabus</h2>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans">{courseMeta.desc}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold font-mono uppercase text-foreground">Featured Materials ({courseResources.length})</h2>
              <Link href="/bazaar" className="text-xs font-mono text-muted-foreground hover:text-foreground underline">
                View in Bazaar →
              </Link>
            </div>

            {courseResources.length === 0 ? (
              <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-3 font-mono text-xs text-muted-foreground">
                <p className="font-bold text-foreground">No Resources Uploaded Yet for {formattedCode}</p>
                <p>Be the first student to share study materials for this course!</p>
                <Link
                  href="/donate"
                  className="liquid-metal-btn inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Donate Knowledge</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseResources.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => {
                      setSelectedResource(res);
                      setIsDetailOpen(true);
                    }}
                    className="p-5 rounded-3xl bg-card border border-border hover:border-foreground/40 transition-all shadow-sm space-y-3 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2.5 py-0.5 rounded bg-foreground/10 text-foreground font-bold">
                        {res.resourceType}
                      </span>
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {res.rating.toFixed(1)}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold font-sans text-foreground group-hover:text-accent transition-colors line-clamp-1">
                      {res.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{res.description}</p>

                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-2 border-t border-border/60">
                      <span>Shared by: <strong className="text-foreground">{res.publicDisplayIdentity}</strong></span>
                      <span>{res.downloadsCount} downloads</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 2: Section / All Donations */}
      {activeTab !== 'overview' && (
        <div className="space-y-4 font-mono text-xs">
          {displayedResources.length === 0 ? (
            <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-3 font-mono text-xs text-muted-foreground">
              <p className="font-bold text-foreground">No Resources Found for this Section in {formattedCode}</p>
              <p>No study materials or lab tasks matching this category have been uploaded yet.</p>
              <Link
                href="/donate"
                className="liquid-metal-btn inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Donate First Resource</span>
              </Link>
            </div>
          ) : (
            displayedResources.map((res) => (
              <div
                key={res.id}
                onClick={() => {
                  setSelectedResource(res);
                  setIsDetailOpen(true);
                }}
                className="p-5 rounded-3xl bg-card border border-border hover:border-foreground/40 transition-all shadow-sm flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="space-y-1 font-sans flex-1 min-w-0">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span
                      className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                        res.academicMetadata?.section === 'question'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : res.academicMetadata?.section === 'course_material'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : res.academicMetadata?.section === 'sessional'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-foreground/10 text-foreground border-border'
                      }`}
                    >
                      {res.academicMetadata
                        ? res.academicMetadata.section === 'question'
                          ? `📝 ${res.academicMetadata.examType || 'Question'}`
                          : res.academicMetadata.section === 'course_material'
                          ? `📖 ${res.academicMetadata.materialType?.replace('_', ' ') || 'Material'}`
                          : `🔬 ${res.academicMetadata.labNumber || 'Sessional'}`
                        : res.resourceType}
                    </span>
                    {res.academicMetadata?.batch && (
                      <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-mono">
                        Batch {res.academicMetadata.batch}
                      </span>
                    )}
                    <span className="text-[11px] text-muted-foreground">
                      Shared by <strong className="text-foreground">{res.publicDisplayIdentity}</strong>
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-accent transition-colors truncate">
                    {res.title}
                  </h3>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-mono">
                  <div className="text-right hidden sm:block">
                    <span className="flex items-center justify-end gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {res.rating.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{res.downloadsCount} downloads</span>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-foreground text-background font-bold text-xs shadow-md">
                    View Material
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      <ResourceDetailModal
        resource={selectedResource}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenReportModal={(id, title) => {
          setReportTarget({ id, title });
          setIsReportOpen(true);
        }}
        onRequireAuth={(action) => {
          setAuthActionName(action);
          setIsAuthModalOpen(true);
        }}
        onResourceUpdated={loadData}
      />

      <ReportResourceModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        resourceId={reportTarget.id}
        resourceTitle={reportTarget.title}
        onRequireAuth={() => {
          setAuthActionName('report resources');
          setIsAuthModalOpen(true);
        }}
      />

      <GuestAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        actionName={authActionName}
      />
    </div>
  );
}
