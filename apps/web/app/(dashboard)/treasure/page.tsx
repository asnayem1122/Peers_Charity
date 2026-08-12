'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bookmark, Compass, Eye, Trash2 } from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';

const mockTreasures = [
  {
    id: 'demo-1',
    title: 'Dynamic Programming Survival Notes',
    courseCode: 'CSE 2103',
    rating: 4.82,
    collection: 'Exam',
    savedAt: 'Yesterday',
  },
  {
    id: 'demo-2',
    title: 'SQL Normalization & BCNF Solved Bank',
    courseCode: 'CSE 3101',
    rating: 4.9,
    collection: 'General',
    savedAt: '3 days ago',
  },
];

export default function MyTreasurePage() {
  const [items, setItems] = useState(mockTreasures);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight font-mono uppercase">
            {PRODUCT_TERMINOLOGY.bookmarks}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your personal vault of bookmarked academic notes and saved study materials.
          </p>
        </div>

        <Link
          href="/bazaar"
          className="px-4 py-2 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-all flex items-center gap-2 self-start shadow-md"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Bazaar</span>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="p-12 rounded-2xl bg-card border border-border text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-foreground/10 text-foreground flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold font-mono">Your treasure chest is empty.</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            "Time to visit the Charity Bazaar and save your first academic donation."
          </p>
          <Link
            href="/bazaar"
            className="inline-block px-6 py-2.5 bg-foreground text-background font-bold text-xs rounded-xl hover:opacity-90 transition-all shadow-md"
          >
            Visit Charity Bazaar
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-foreground/10 text-foreground border border-border">
                  {item.collection}
                </span>
                <h3 className="font-bold text-base font-mono">{item.title}</h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {item.courseCode} • ⭐ {item.rating} • Saved {item.savedAt}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/bazaar"
                  className="p-2 rounded-lg bg-foreground/10 text-foreground hover:bg-foreground/20 text-xs font-semibold"
                  title="View in Bazaar"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 rounded-lg border border-border hover:bg-red-500/10 text-muted-foreground hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
