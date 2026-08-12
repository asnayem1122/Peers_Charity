'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Search, PlusCircle, ArrowRight, ShieldCheck, FileText, Flame } from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';

export default function AcademicPantryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const courses = [
    {
      id: 'cse-2103',
      code: 'CSE 2103',
      name: 'Data Structures & Algorithms II',
      dept: 'Computer Science & Engineering',
      instructor: 'Dr. Alan Turing',
      health: 92,
      donationsCount: 14,
      downloadsCount: 310,
      tags: ['Dynamic Programming', 'Graphs', 'Trees', 'NP-Hard'],
    },
    {
      id: 'cse-3101',
      code: 'CSE 3101',
      name: 'Operating Systems Architecture',
      dept: 'Computer Science & Engineering',
      instructor: 'Prof. Linus Torvalds',
      health: 88,
      donationsCount: 18,
      downloadsCount: 420,
      tags: ['Process Scheduling', 'Semaphores', 'Virtual Memory', 'Paging'],
    },
    {
      id: 'cse-3205',
      code: 'CSE 3205',
      name: 'Artificial Intelligence & Neural Nets',
      dept: 'Computer Science & Engineering',
      instructor: 'Dr. Geoffrey Hinton',
      health: 85,
      donationsCount: 11,
      downloadsCount: 195,
      tags: ['A* Search', 'Neural Networks', 'Minimax', 'Computer Vision'],
    },
  ];

  const filtered = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2 font-mono uppercase">
            <BookOpen className="w-7 h-7 text-foreground" />
            <span>{PRODUCT_TERMINOLOGY.courseLibrary}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-sans">
            Structured course library with Pantry Health coverage metrics and verified resources.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64 font-mono">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course code or name..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-foreground font-medium"
            />
          </div>

          <Link
            href="/donate"
            className="liquid-metal-btn px-4 py-2 text-xs font-bold font-mono flex items-center gap-1.5 shadow-md shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Knowledge</span>
          </Link>
        </div>
      </div>

      {/* Course Pantry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((course) => (
          <Link
            key={course.id}
            href={`/pantry/${course.id}`}
            className="p-6 rounded-3xl bg-card border border-border shadow-lg space-y-4 hover:border-foreground/40 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3 font-mono">
                <span className="px-3 py-1 rounded-xl bg-foreground text-background font-black text-xs">
                  {course.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {course.health}% Health
                </span>
              </div>

              <h2 className="text-lg font-bold text-foreground leading-snug group-hover:text-muted-foreground transition-colors font-mono mb-1">
                {course.name}
              </h2>

              <p className="text-xs text-muted-foreground mb-4">
                {course.instructor} • {course.dept}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4 font-mono text-[10px]">
                {course.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between font-mono text-xs text-muted-foreground">
              <span>{course.donationsCount} Notes • {course.downloadsCount} DLs</span>
              <div className="flex items-center gap-1 font-bold text-foreground group-hover:translate-x-1 transition-transform">
                <span>Open Pantry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
