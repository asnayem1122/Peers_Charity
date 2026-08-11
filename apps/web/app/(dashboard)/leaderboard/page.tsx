'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, PlusCircle } from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<'this-week' | 'this-month' | 'all-time'>('all-time');
  const leaders: any[] = [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>{PRODUCT_TERMINOLOGY.leaderboard}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Recognizing top academic philanthropists saving classmate semesters.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-card border border-border p-1 rounded-xl self-start">
          <button
            onClick={() => setPeriod('this-week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              period === 'this-week' ? 'bg-accent text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod('this-month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              period === 'this-month' ? 'bg-accent text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod('all-time')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              period === 'all-time' ? 'bg-accent text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {leaders.length === 0 ? (
        <div className="p-12 rounded-2xl bg-card border border-border/80 text-center space-y-4 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">No Ranked Benefactors Yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            "The Generosity Olympics is waiting for its first leader. Upload your lecture notes or solved questions to claim the #1 spot!"
          </p>
          <Link
            href="/donate"
            className="px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-accent/90 transition-all shadow-md shadow-accent/20 flex items-center gap-2 mt-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Knowledge & Claim #1 Spot</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
