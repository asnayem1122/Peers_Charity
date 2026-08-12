'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Grid,
  List,
  PlusCircle,
  Compass,
  Star,
  Download,
  Bookmark,
  ShieldCheck,
  Award,
  Check,
  FileText,
  FileCode,
  ExternalLink,
  Eye,
  Filter,
  UserCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';
import {
  getResources,
  getSavedResourceIds,
  toggleSaveResource,
  recordDownload,
  Resource,
  ResourceType,
} from '@/lib/resources-data';
import ResourceDetailModal from '@/components/ui/resource-detail-modal';
import ReportResourceModal from '@/components/ui/report-resource-modal';
import GuestAuthModal from '@/components/ui/guest-auth-modal';
import AboutProjectModal from '@/components/ui/about-project-modal';

export default function CharityBazaarPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'downloads' | 'rating' | 'newest'>('downloads');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  // Modals state
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ id: string; title: string }>({ id: '', title: '' });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authActionName, setAuthActionName] = useState('access this feature');
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const loadData = () => {
    const list = getResources();
    setResources(list);
    setSavedIds(getSavedResourceIds());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDetail = (res: Resource) => {
    setSelectedResource(res);
    setIsDetailOpen(true);
  };

  const handleOpenReport = (id: string, title: string) => {
    setReportTarget({ id, title });
    setIsReportOpen(true);
  };

  const handleRequireAuth = (actionName: string) => {
    setAuthActionName(actionName);
    setIsAuthModalOpen(true);
  };

  const handleToggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) {
      handleRequireAuth('bookmark resources to your Treasure Vault');
      return;
    }
    const updated = toggleSaveResource(id);
    setSavedIds(updated);
    loadData();
  };

  const handleDownload = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) {
      handleRequireAuth('download academic resources');
      return;
    }
    const updated = recordDownload(id);
    setDownloadedIds(updated);
    loadData();
  };

  // Filter & Search Logic
  const filteredResources = resources
    .filter((res) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        res.title.toLowerCase().includes(q) ||
        res.courseCode.toLowerCase().includes(q) ||
        res.courseName.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.tags.some((t) => t.toLowerCase().includes(q));

      const matchesType = selectedType === 'ALL' || res.resourceType === selectedType;
      const matchesCourse = selectedCourse === 'ALL' || res.courseCode === selectedCourse;

      return matchesSearch && matchesType && matchesCourse;
    })
    .sort((a, b) => {
      if (sortBy === 'downloads') return b.downloadsCount - a.downloadsCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

  const availableCourses = Array.from(new Set(resources.map((r) => r.courseCode)));

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-foreground/10 border border-border text-foreground text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Public Academic Catalog
            </span>
            <button
              onClick={() => setIsAboutOpen(true)}
              className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold uppercase hover:bg-accent/20 transition-all flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" />
              About Project
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight font-mono uppercase">
            {PRODUCT_TERMINOLOGY.discovery}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-sans max-w-2xl">
            Explore, preview, download, and share verified academic notes, lecture slides, solved exam papers, and educational links. No account required for public browsing!
          </p>
        </div>

        {/* View Toggle & Donate Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-background border border-border p-1 rounded-2xl font-mono">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <Link
            href="/donate"
            className="liquid-metal-btn px-5 py-2.5 text-xs font-bold font-mono flex items-center gap-2 shadow-lg"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Knowledge</span>
          </Link>
        </div>
      </div>

      {/* Search & Multi-Filter Bar */}
      <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-4 font-mono">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, course (e.g. CSE 2103), topic tags, or description..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-foreground"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <span className="text-xs text-muted-foreground font-bold uppercase">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 rounded-2xl border border-border bg-background text-foreground text-xs font-bold focus:outline-none focus:border-foreground"
            >
              <option value="downloads">Most Downloaded</option>
              <option value="rating">Top Rated ⭐</option>
              <option value="newest">Recently Added</option>
            </select>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60 text-xs">
          {/* Resource Type Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-muted-foreground font-bold uppercase mr-1">Type:</span>
            {['ALL', 'Notes', 'Slides', 'PDF', 'External Link'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  selectedType === type
                    ? 'bg-foreground text-background shadow-md'
                    : 'bg-background hover:bg-card-hover border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Course Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground font-bold uppercase">Course:</span>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-1 rounded-xl border border-border bg-background text-foreground text-xs font-bold focus:outline-none focus:border-foreground"
            >
              <option value="ALL">All Courses</option>
              {availableCourses.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Display (Grid vs List) */}
      {filteredResources.length === 0 ? (
        /* Empty State */
        <div className="p-12 rounded-3xl bg-card border border-border shadow-sm text-center space-y-4 font-mono">
          <div className="w-16 h-16 rounded-2xl bg-foreground/5 text-muted-foreground flex items-center justify-center mx-auto border border-border">
            <Compass className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground uppercase">No Academic Resources Found</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto font-sans">
              No materials match your current search query "{searchQuery}" or selected filters. Be the first student to donate knowledge for this course!
            </p>
          </div>
          <Link
            href="/donate"
            className="liquid-metal-btn inline-flex items-center gap-2 px-6 py-3 text-xs font-bold shadow-lg uppercase tracking-wider"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate First Resource</span>
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => {
            const isSaved = savedIds.includes(res.id);
            return (
              <div
                key={res.id}
                onClick={() => handleOpenDetail(res)}
                className="p-6 rounded-3xl bg-card border border-border hover:border-foreground/40 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between space-y-4 cursor-pointer group relative overflow-hidden"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 font-mono text-xs">
                    <span className="px-2.5 py-0.5 rounded-lg bg-foreground text-background font-black uppercase tracking-wider">
                      {res.courseCode}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-foreground/10 text-foreground border border-border font-bold">
                      {res.resourceType}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold font-sans text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                    {res.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2 font-sans leading-relaxed">
                    {res.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 font-mono pt-1">
                    {res.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-foreground/5 text-muted-foreground border border-border">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Metadata & Actions */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between font-mono text-xs">
                  <div className="space-y-0.5">
                    <span className="block text-[11px] font-bold text-foreground truncate max-w-[140px]" title={res.publicDisplayIdentity}>
                      {res.publicDisplayIdentity}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {res.rating.toFixed(1)}
                      </span>
                      <span>•</span>
                      <span>{res.downloadsCount} DLs</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleToggleSave(e, res.id)}
                      className={`p-2 rounded-xl border transition-all ${
                        isSaved
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border bg-background hover:bg-card-hover text-muted-foreground hover:text-foreground'
                      }`}
                      title={isSaved ? 'Bookmarked' : 'Save to Treasure Vault'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-background' : ''}`} />
                    </button>

                    <button
                      onClick={(e) => handleDownload(e, res.id)}
                      className="p-2 rounded-xl bg-foreground text-background hover:opacity-90 transition-all font-bold shadow-md"
                      title="Download Resource"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Layout */
        <div className="space-y-3">
          {filteredResources.map((res) => {
            const isSaved = savedIds.includes(res.id);
            return (
              <div
                key={res.id}
                onClick={() => handleOpenDetail(res)}
                className="p-5 rounded-3xl bg-card border border-border hover:border-foreground/40 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="space-y-1.5 flex-1 min-w-0 font-sans">
                  <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                    <span className="px-2.5 py-0.5 rounded bg-foreground text-background font-black uppercase text-[10px]">
                      {res.courseCode}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-foreground/10 text-foreground border border-border text-[10px] font-bold">
                      {res.resourceType}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Shared by <strong className="text-foreground">{res.publicDisplayIdentity}</strong>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-foreground group-hover:text-accent transition-colors truncate">
                    {res.title}
                  </h3>

                  <p className="text-xs text-muted-foreground truncate">{res.description}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-mono text-xs" onClick={(e) => e.stopPropagation()}>
                  <div className="text-right hidden sm:block">
                    <span className="flex items-center justify-end gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {res.rating.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">{res.downloadsCount} downloads</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleToggleSave(e, res.id)}
                      className={`p-2 rounded-xl border transition-all ${
                        isSaved
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border bg-background hover:bg-card-hover text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-background' : ''}`} />
                    </button>

                    <button
                      onClick={(e) => handleDownload(e, res.id)}
                      className="px-4 py-2 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <ResourceDetailModal
        resource={selectedResource}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenReportModal={handleOpenReport}
        onRequireAuth={handleRequireAuth}
        onResourceUpdated={loadData}
      />

      <ReportResourceModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        resourceId={reportTarget.id}
        resourceTitle={reportTarget.title}
        onRequireAuth={() => handleRequireAuth('report resources')}
      />

      <GuestAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        actionName={authActionName}
      />

      <AboutProjectModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
