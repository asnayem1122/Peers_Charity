'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';

export default function CharityBazaarPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  // Verified Sample Academic Resources Catalog
  const resources = [
    {
      id: 'res-1',
      title: 'CSE 2103: Dynamic Programming Survival Notes & Cheat Sheet',
      course: 'CSE 2103',
      type: 'Cheat Sheets',
      uploader: 'nayem@student.university.edu',
      uploaderName: 'Nayem (Level 3 / Term 2)',
      qualityScore: 98,
      rating: 4.9,
      reviewsCount: 24,
      downloadsCount: 142,
      fileSize: '4.2 MB',
      date: '2 days ago',
      tags: ['Dynamic Programming', 'Memoization', 'Knapsack'],
    },
    {
      id: 'res-2',
      title: 'CSE 3101: Operating Systems Process Scheduling & Memory Management Solved Bank',
      course: 'CSE 3101',
      type: 'Solved Questions',
      uploader: 'admin@university.edu',
      uploaderName: 'Faculty Admin',
      qualityScore: 99,
      rating: 5.0,
      reviewsCount: 38,
      downloadsCount: 215,
      fileSize: '8.1 MB',
      date: '1 week ago',
      tags: ['Operating Systems', 'Paging', 'Semaphores', 'Deadlocks'],
    },
    {
      id: 'res-3',
      title: 'CSE 3205: Artificial Intelligence Midterm & Final Solved Past Papers (2020-2025)',
      course: 'CSE 3205',
      type: 'Previous Exam Questions',
      uploader: 'sarah.k@student.university.edu',
      uploaderName: 'Sarah K. (Senior Benefactor)',
      qualityScore: 96,
      rating: 4.8,
      reviewsCount: 19,
      downloadsCount: 98,
      fileSize: '6.5 MB',
      date: '3 days ago',
      tags: ['AI Search', 'A* Algorithm', 'Minimax', 'Neural Nets'],
    },
  ];

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'ALL' || res.type === selectedType;
    return matchesSearch && matchesType;
  });

  const toggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDownload = (id: string) => {
    if (!downloadedIds.includes(id)) {
      setDownloadedIds((prev) => [...prev, id]);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-mono uppercase">
            {PRODUCT_TERMINOLOGY.discovery}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-sans">
            Discover, evaluate, and download verified academic donations shared by peer benefactors.
          </p>
        </div>

        {/* View Toggle & Donate Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-background border border-border p-1 rounded-xl font-mono">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <Link
            href="/donate"
            className="liquid-metal-btn px-4 py-2 text-xs font-bold font-mono flex items-center gap-1.5 shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Knowledge</span>
          </Link>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, course codes, or algorithms..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto font-mono">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-foreground font-bold"
          >
            <option value="ALL">All Resource Types</option>
            <option value="Lecture Notes">Lecture Notes</option>
            <option value="Solved Questions">Solved Questions</option>
            <option value="Previous Exam Questions">Previous Questions</option>
            <option value="Cheat Sheets">Cheat Sheets</option>
          </select>

          <select className="px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-foreground font-bold">
            <option value="quality">Sort: Quality Score</option>
            <option value="rating">Sort: Highest Rated</option>
            <option value="downloads">Sort: Most Downloaded</option>
          </select>
        </div>
      </div>

      {/* Catalog Resources Display */}
      {filteredResources.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredResources.map((res) => {
            const isSaved = savedIds.includes(res.id);
            const isDownloaded = downloadedIds.includes(res.id);

            return (
              <div
                key={res.id}
                className="p-6 rounded-3xl bg-card border border-border shadow-lg relative overflow-hidden flex flex-col justify-between hover:border-foreground/40 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 font-mono">
                    <span className="px-2.5 py-1 rounded-lg bg-foreground text-background font-black text-xs">
                      {res.course}
                    </span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-foreground/10 text-foreground font-bold border border-border">
                        {res.type}
                      </span>
                      <button
                        onClick={() => toggleSave(res.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isSaved
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'border-border text-muted-foreground hover:text-foreground'
                        }`}
                        title={isSaved ? 'Bookmarked' : 'Save to Vault'}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-foreground leading-snug mb-2 group-hover:text-muted-foreground transition-colors font-sans">
                    {res.title}
                  </h3>

                  <p className="text-xs text-muted-foreground mb-4">
                    Donated by <span className="font-semibold text-foreground">{res.uploaderName}</span>
                  </p>

                  <div className="flex items-center gap-3 text-xs font-mono mb-4 text-muted-foreground">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{res.rating}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-foreground font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{res.qualityScore}% Quality</span>
                    </span>
                    <span>•</span>
                    <span>{res.fileSize}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-6 font-mono text-[10px]">
                    {res.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between font-mono">
                  <span className="text-xs text-muted-foreground">
                    {res.downloadsCount} downloads
                  </span>

                  <button
                    onClick={() => handleDownload(res.id)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                      isDownloaded
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-foreground text-background hover:opacity-90'
                    }`}
                  >
                    {isDownloaded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Downloaded</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Note</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-card border border-border text-center space-y-4 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-2xl bg-foreground/10 text-foreground flex items-center justify-center">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-mono">No Matching Resources Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Try adjusting your search terms or filter selection.
          </p>
        </div>
      )}
    </div>
  );
}
