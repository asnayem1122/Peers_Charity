'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, PlusCircle, Award, Flame, Star, ShieldCheck, HeartHandshake } from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<'this-week' | 'this-month' | 'all-time'>('all-time');

  // Ranked Benefactors Standings
  const leaders = [
    {
      rank: 1,
      name: 'System Admin',
      email: 'admin@university.edu',
      points: 1000,
      donations: 5,
      savedCount: 42,
      badge: '🥇 Top Academic Philanthropist',
      trustScore: 5.0,
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      rank: 2,
      name: 'Nayem (Computer Science)',
      email: 'nayem@student.university.edu',
      points: 350,
      donations: 3,
      savedCount: 28,
      badge: '🥈 Senior Semester Saver',
      trustScore: 4.9,
      badgeColor: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      rank: 3,
      name: 'Sarah K. (Software Eng)',
      email: 'sarah.k@student.university.edu',
      points: 210,
      donations: 2,
      savedCount: 19,
      badge: '🥉 Class Hero',
      trustScore: 4.8,
      badgeColor: 'bg-amber-700/20 text-amber-500 border-amber-700/30',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2 font-mono uppercase">
            <Trophy className="w-7 h-7 text-amber-400" />
            <span>{PRODUCT_TERMINOLOGY.leaderboard}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-sans">
            Recognizing top academic benefactors and philanthropists saving classmate semesters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-background border border-border p-1 rounded-xl font-mono">
            <button
              onClick={() => setPeriod('this-week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === 'this-week'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setPeriod('this-month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === 'this-month'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setPeriod('all-time')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === 'all-time'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Time
            </button>
          </div>

          <Link
            href="/donate"
            className="liquid-metal-btn px-4 py-2 text-xs font-bold font-mono flex items-center gap-1.5 shadow-md shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate & Claim #1</span>
          </Link>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="space-y-4">
        {leaders.map((leader) => (
          <div
            key={leader.rank}
            className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-foreground/40"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-foreground/10 text-foreground flex items-center justify-center font-mono font-black text-lg shrink-0">
                #{leader.rank}
              </div>

              <img
                src={leader.avatarUrl}
                alt={leader.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-border shrink-0"
              />

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-foreground font-mono">{leader.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border font-mono ${leader.badgeColor}`}>
                    {leader.badge}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-sans mt-0.5">
                  {leader.donations} Verified Donations • {leader.savedCount} Classmates Helped
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 font-mono self-end sm:self-center">
              <div className="text-right">
                <span className="block text-xl font-black text-amber-400">{leader.points} pts</span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Charity Points</span>
              </div>
              <div className="text-right">
                <span className="block text-xl font-black text-emerald-400">{leader.trustScore}★</span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Trust Score</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
