'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, PlusCircle, Award, Flame, Star, ShieldCheck, HeartHandshake, Users } from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';
import { getResources, Resource } from '@/lib/resources-data';

interface LeaderEntry {
  rank: number;
  name: string;
  email: string;
  points: number;
  donations: number;
  savedCount: number;
  badge: string;
  trustScore: number;
  badgeColor: string;
  avatarUrl: string;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<'this-week' | 'this-month' | 'all-time'>('all-time');
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    setResources(getResources());
  }, []);

  // Compute dynamic benefactors from actual donations
  const uploaderMap = new Map<
    string,
    { name: string; email: string; donations: number; downloads: number; ratingTotal: number; ratingCount: number }
  >();

  resources.forEach((res) => {
    const key = res.realUploaderEmail || res.realUploaderName || 'Anonymous';
    const existing = uploaderMap.get(key) || {
      name: res.publicDisplayIdentity || res.realUploaderName || 'Benefactor',
      email: res.realUploaderEmail || '',
      donations: 0,
      downloads: 0,
      ratingTotal: 0,
      ratingCount: 0,
    };
    existing.donations += 1;
    existing.downloads += res.downloadsCount || 0;
    existing.ratingTotal += res.rating || 5;
    existing.ratingCount += res.ratingCount || 1;
    uploaderMap.set(key, existing);
  });

  const leaders: LeaderEntry[] = Array.from(uploaderMap.values())
    .map((u, idx) => {
      const avgRating = u.ratingCount > 0 ? Number((u.ratingTotal / u.ratingCount).toFixed(1)) : 5.0;
      return {
        rank: idx + 1,
        name: u.name,
        email: u.email,
        points: u.donations * 10,
        donations: u.donations,
        savedCount: u.downloads,
        badge:
          idx === 0
            ? '🥇 Top Academic Philanthropist'
            : idx === 1
            ? '🥈 Senior Semester Saver'
            : '🥉 Class Hero',
        trustScore: avgRating,
        badgeColor:
          idx === 0
            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            : idx === 1
            ? 'bg-slate-400/20 text-slate-300 border-slate-400/30'
            : 'bg-amber-700/20 text-amber-500 border-amber-700/30',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.name)}`,
      };
    })
    .sort((a, b) => b.points - a.points)
    .map((leader, index) => ({ ...leader, rank: index + 1 }));

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

      {/* Leaderboard Table / Cards or Clean Empty State */}
      {leaders.length === 0 ? (
        <div className="p-12 rounded-3xl bg-card border border-border shadow-sm text-center space-y-4 font-mono">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground uppercase">No Benefactors on the Leaderboard Yet</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto font-sans">
              Be the first student to donate academic notes, slides, or study materials to earn Charity Points and claim the #1 spot!
            </p>
          </div>
          <Link
            href="/donate"
            className="liquid-metal-btn inline-flex items-center gap-2 px-6 py-3 text-xs font-bold shadow-lg uppercase tracking-wider"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Knowledge & Rank #1</span>
          </Link>
        </div>
      ) : (
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
                    {leader.donations} Verified {leader.donations === 1 ? 'Donation' : 'Donations'} • {leader.savedCount} Classmates Helped
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
      )}
    </div>
  );
}
