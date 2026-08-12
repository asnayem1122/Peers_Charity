'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Grid,
  List,
  PlusCircle,
  Compass,
} from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';

export default function CharityBazaarPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  // Fresh zero preloaded resources state
  const resources: any[] = [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight font-mono uppercase">
            {PRODUCT_TERMINOLOGY.discovery}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-sans">
            Discover, evaluate, and download verified academic donations.
          </p>
        </div>

        {/* View Toggle & Donate Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-card border border-border p-1 rounded-xl">
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
            className="px-4 py-2 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md"
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
            placeholder="Search your academic treasure..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-foreground font-semibold"
          >
            <option value="ALL">All Resource Types</option>
            <option value="Lecture Notes">Lecture Notes</option>
            <option value="Solved Questions">Solved Questions</option>
            <option value="Previous Exam Questions">Previous Questions</option>
            <option value="Cheat Sheets">Cheat Sheets</option>
          </select>

          <select className="px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-foreground font-semibold">
            <option value="quality">Sort: Quality Score</option>
            <option value="rating">Sort: Highest Rated</option>
            <option value="downloads">Sort: Most Downloaded</option>
            <option value="newest">Sort: Newest</option>
          </select>
        </div>
      </div>

      {/* Fresh Empty State */}
      {resources.length === 0 ? (
        <div className="p-12 rounded-2xl bg-card border border-border text-center space-y-4 flex flex-col items-center justify-center min-h-[350px]">
          <div className="w-16 h-16 rounded-2xl bg-foreground/10 text-foreground flex items-center justify-center">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-mono">The Charity Bazaar is Fresh & Empty</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            "No academic notes have been uploaded yet. Be the first benefactor to share your lecture notes or exam questions!"
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
