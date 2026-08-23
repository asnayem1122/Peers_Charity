'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Award,
  Users,
  Star,
  Sparkles,
  Flame,
  PlusCircle,
  FileText,
  HeartHandshake,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';
import { getResources, Resource } from '@/lib/resources-data';

export default function CharityHQPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    setResources(getResources());
  }, []);

  const userResources = resources.filter(
    (r) =>
      r.realUploaderId === user?.id ||
      (user?.email && r.realUploaderEmail?.toLowerCase() === user.email.toLowerCase())
  );

  const donationsCount = userResources.length;
  const studentsHelped = userResources.reduce((sum, r) => sum + (r.downloadsCount || 0), 0);
  const charityPoints = donationsCount * 10;
  const avgRating =
    userResources.length > 0
      ? (userResources.reduce((sum, r) => sum + r.rating, 0) / userResources.length).toFixed(1) + '★'
      : '—';

  const notesCount = resources.filter((r) => r.resourceType === 'Notes').length;
  const pdfCount = resources.filter((r) => r.resourceType === 'PDF').length;
  const slidesCount = resources.filter((r) => r.resourceType === 'Slides' || r.resourceType === 'External Link').length;

  const notesCoverage = Math.min(100, Math.round((notesCount / 5) * 100));
  const pdfCoverage = Math.min(100, Math.round((pdfCount / 5) * 100));
  const slidesCoverage = Math.min(100, Math.round((slidesCount / 5) * 100));
  const totalCoverage = Math.min(100, Math.round(((notesCount + pdfCount + slidesCount) / 15) * 100));

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-3xl bg-card border border-border shadow-md">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/10 border border-border text-foreground text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Benefactor Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-mono uppercase">
            Welcome to Peer's Charity, {user ? user.name : 'Benefactor'} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-sans">
            "We don't sell notes. We perform academic charity."
          </p>
        </div>

        <Link
          href="/donate"
          className="liquid-metal-btn px-5 py-3 text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-xl shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Donate Knowledge</span>
        </Link>
      </div>

      {/* Primary Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm relative overflow-hidden group hover:border-foreground/50 transition-all">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Donations Shared</span>
            <div className="w-9 h-9 rounded-2xl bg-foreground/10 text-foreground flex items-center justify-center shadow-sm">
              <FileText className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-black tracking-tight font-mono">{donationsCount}</div>
          <div className="text-xs text-muted-foreground mt-2 font-medium">
            <span>{donationsCount > 0 ? `${donationsCount} notes uploaded` : 'No notes uploaded yet'}</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm relative overflow-hidden group hover:border-foreground/50 transition-all">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Classmates Saved</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center shadow-sm">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-black tracking-tight font-mono">{studentsHelped}</div>
          <div className="text-xs text-muted-foreground mt-2 font-medium">
            <span>{studentsHelped > 0 ? `${studentsHelped} peers benefited` : 'Be the first benefactor'}</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm relative overflow-hidden group hover:border-foreground/50 transition-all">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Charity Points</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shadow-sm">
              <Award className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-black tracking-tight font-mono text-amber-400">{charityPoints}</div>
          <div className="text-xs text-amber-400 mt-2 font-medium font-mono">
            <span>Earn +10 pts per upload</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm relative overflow-hidden group hover:border-foreground/50 transition-all">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Avg. Rating</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shadow-sm">
              <Star className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-black tracking-tight font-mono text-emerald-400">{avgRating}</div>
          <div className="text-xs text-muted-foreground mt-2 font-medium">
            <span>Verified peer reviews</span>
          </div>
        </div>
      </div>

      {/* Main Section: Quick Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 rounded-3xl bg-card border border-border shadow-lg text-center space-y-4 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-2xl bg-foreground/10 text-foreground flex items-center justify-center shadow-md">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-mono">Give a Note. Get a Note. Save a Semester.</h2>
          <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
            Discover verified lecture notes in the Charity Bazaar or upload solved question banks to support your academic circle.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2 font-mono">
            <Link
              href="/bazaar"
              className="px-6 py-3 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-all shadow-md flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Bazaar Catalog</span>
            </Link>

            <Link
              href="/donate"
              className="liquid-metal-btn-secondary px-6 py-3 text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Donate Lecture Notes</span>
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-card border border-border shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-foreground" />
              <h2 className="text-base font-bold font-mono">Pantry Coverage</h2>
            </div>
            <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono">
              {totalCoverage}% Covered
            </span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Lecture Notes</span>
                <span className="text-foreground font-bold">{notesCoverage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-foreground rounded-full" style={{ width: `${notesCoverage}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Exam Solved Papers</span>
                <span className="text-foreground font-bold">{pdfCoverage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-foreground rounded-full" style={{ width: `${pdfCoverage}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Cheat Sheets & Slides</span>
                <span className="text-amber-400 font-bold">{slidesCoverage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${slidesCoverage}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <Link
              href="/exam"
              className="w-full py-3 rounded-xl bg-amber-500/10 text-amber-400 font-bold text-xs flex items-center justify-center gap-2 border border-amber-500/30 hover:bg-amber-500/20 transition-all font-mono shadow-sm"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Open Exam Emergency Room</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
