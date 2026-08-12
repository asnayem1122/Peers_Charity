'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Search, PlusCircle } from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';

export default function AcademicPantryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const courses: any[] = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 font-mono uppercase">
            <BookOpen className="w-6 h-6 text-foreground" />
            <span>{PRODUCT_TERMINOLOGY.courseLibrary}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-sans">
            Structured course library with Pantry Health coverage metrics and verified resources.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course code..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-foreground"
            />
          </div>

          <Link
            href="/donate"
            className="px-4 py-2 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Knowledge</span>
          </Link>
        </div>
      </div>

      {/* Fresh Empty State */}
      {courses.length === 0 ? (
        <div className="p-12 rounded-2xl bg-card border border-border text-center space-y-4 flex flex-col items-center justify-center min-h-[350px]">
          <div className="w-16 h-16 rounded-2xl bg-foreground/10 text-foreground flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-mono">The Academic Pantry is Fresh & Empty</h3>
          <p className="text-xs text-muted-foreground max-w-sm font-sans">
            "No course pantries created yet. Start by donating knowledge to build your university's course library!"
          </p>
          <Link
            href="/donate"
            className="px-6 py-2.5 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-all shadow-md flex items-center gap-2 mt-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Knowledge Now</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
