'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Flame } from 'lucide-react';

export default function CoursePantryView({ courseId }: { courseId: string }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'donations' | 'topics'>('overview');

  return (
    <div className="space-y-8">
      {/* Course Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-card via-card to-accent/10 border border-border/80 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-lg bg-accent text-white font-extrabold text-xs tracking-wider uppercase">
              {courseId.toUpperCase()}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Data Structures & Algorithms II
            </h1>
            <p className="text-xs text-muted-foreground">
              Instructor: <span className="font-semibold text-foreground">Dr. Alan Turing</span> • Department of Computer Science
            </p>
          </div>

          <Link
            href="/exam"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold hover:bg-amber-500/20 transition-all self-start sm:self-center"
          >
            <Flame className="w-4 h-4" />
            <span>Open Exam Emergency Room</span>
          </Link>
        </div>

        {/* Pantry Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-background/60 backdrop-blur-md p-4 rounded-xl border border-border/60 text-center text-xs">
          <div>
            <span className="block text-2xl font-black text-accent">0</span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              Donations
            </span>
          </div>
          <div>
            <span className="block text-2xl font-black text-purple-400">0</span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              Downloads
            </span>
          </div>
          <div>
            <span className="block text-2xl font-black text-amber-400">—</span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              Avg Rating
            </span>
          </div>
          <div>
            <span className="block text-2xl font-black text-emerald-400">0%</span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              Pantry Health
            </span>
          </div>
        </div>
      </div>

      {/* Course Tabs */}
      <div className="border-b border-border/60 flex items-center gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'overview' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Pantry Overview & Health
        </button>
        <button
          onClick={() => setActiveTab('donations')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'donations' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          All Donations (0)
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-4">
              <h2 className="text-base font-bold">Course Description</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Advanced graph algorithms (Shortest Path, Minimum Spanning Tree, Network Flow), dynamic programming recurrence formulations, NP-completeness reductions, greedy algorithms, and amortized complexity analysis.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-4">
              <h2 className="text-base font-bold">Featured High-Yield Donations</h2>
              <p className="text-xs text-muted-foreground">No notes uploaded for this course yet. Be the first to share notes!</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-4">
            <h2 className="text-base font-bold">Resource Coverage Breakdown</h2>

            <div className="space-y-3 text-xs">
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
                  <span>Previous Questions</span>
                  <span className="text-muted-foreground">0%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Lab Materials</span>
                  <span className="text-muted-foreground">0%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'donations' && (
        <div className="p-8 bg-card border border-border/60 rounded-2xl text-center space-y-2 text-xs text-muted-foreground">
          <p className="font-bold text-foreground">No notes available for this course</p>
          <p>Click "Donate Knowledge" to upload the first set of lecture notes!</p>
        </div>
      )}
    </div>
  );
}
