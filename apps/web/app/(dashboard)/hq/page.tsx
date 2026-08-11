'use client';

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
} from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';

export default function CharityHQPage() {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-card via-card to-accent/10 border border-border/80 shadow-md">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to Peer's Charity 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            "We don't sell notes. We perform academic charity."
          </p>
        </div>

        <Link
          href="/donate"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-all shadow-md shadow-accent/20 text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Donate Knowledge</span>
        </Link>
      </div>

      {/* Primary Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm relative overflow-hidden group hover:border-accent/50 transition-all">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Donations Shared</span>
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black tracking-tight">0</div>
          <div className="text-xs text-muted-foreground mt-2 font-medium">
            <span>No notes uploaded yet</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm relative overflow-hidden group hover:border-accent/50 transition-all">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Classmates Saved</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black tracking-tight">0</div>
          <div className="text-xs text-muted-foreground mt-2 font-medium">
            <span>Be the first benefactor</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm relative overflow-hidden group hover:border-accent/50 transition-all">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Charity Points</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black tracking-tight">0</div>
          <div className="text-xs text-amber-400 mt-2 font-medium">
            <span>Earn +10 pts per upload</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm relative overflow-hidden group hover:border-accent/50 transition-all">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg. Rating</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black tracking-tight">—</div>
          <div className="text-xs text-muted-foreground mt-2 font-medium">
            <span>Awaiting peer ratings</span>
          </div>
        </div>
      </div>

      {/* Main Section: Fresh Empty State */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 rounded-2xl bg-card border border-border/60 shadow-sm text-center space-y-4 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">Your Academic Pantry is Fresh & Empty</h2>
          <p className="text-xs text-muted-foreground max-w-md">
            "Give a note. Get a note. Save a semester. Start sharing lecture notes, solved question banks, or cheat sheets with your peer circle."
          </p>
          <Link
            href="/donate"
            className="px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-accent/90 transition-all shadow-md shadow-accent/20 flex items-center gap-2 mt-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Your First Note</span>
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold">Academic Pantry Health</h2>
            </div>
            <span className="text-xs font-bold text-muted-foreground px-2 py-1 rounded bg-muted">
              0% Health
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Lecture Notes</span>
                <span className="text-muted-foreground">0%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: '0%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Previous Exam Questions</span>
                <span className="text-muted-foreground">0%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Lab Materials</span>
                <span className="text-muted-foreground">0%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60">
            <Link
              href="/exam"
              className="w-full py-2.5 rounded-xl bg-card-hover text-foreground font-semibold text-xs flex items-center justify-center gap-2 hover:border hover:border-accent/40 transition-all"
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
