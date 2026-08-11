'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, Moon, Sun, PlusCircle, Command, Sparkles } from 'lucide-react';

export default function Topbar() {
  const [isDark, setIsDark] = useState(true);
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark');
    }
  };

  return (
    <>
      <header className="h-16 border-b border-border/80 bg-card/40 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
        {/* Global Search Bar (Cmd+K trigger) */}
        <div className="flex-1 max-w-md">
          <button
            onClick={() => setIsCmdOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-background/60 border border-border/80 text-xs text-muted-foreground hover:border-accent/50 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
              <span>Search your academic treasure...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-muted border border-border text-[10px] font-mono text-muted-foreground">
              <Command className="w-3 h-3" /> K
            </kbd>
          </button>
        </div>

        {/* Topbar Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/donate"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/30 text-accent text-xs font-semibold hover:bg-accent/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Knowledge</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-border/80 bg-background/50 hover:bg-card-hover text-muted-foreground hover:text-foreground transition-all"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href="/notifications"
            className="p-2 rounded-xl border border-border/80 bg-background/50 hover:bg-card-hover text-muted-foreground hover:text-foreground transition-all relative"
            title="Charity Bells"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-accent absolute top-1.5 right-1.5 animate-pulse" />
          </Link>

          <Link href="/profile" className="flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
              NY
            </div>
          </Link>
        </div>
      </header>

      {/* Command Palette Modal */}
      {isCmdOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-sm text-foreground font-semibold">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Command Palette</span>
              </div>
              <button
                onClick={() => setIsCmdOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Esc
              </button>
            </div>
            <input
              type="text"
              autoFocus
              placeholder="Type a command or course name..."
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <div className="space-y-1 text-xs text-muted-foreground max-h-60 overflow-y-auto">
              <Link
                href="/bazaar"
                onClick={() => setIsCmdOpen(false)}
                className="block p-2 rounded-lg hover:bg-card-hover hover:text-foreground"
              >
                🔍 Search Resources in Charity Bazaar
              </Link>
              <Link
                href="/donate"
                onClick={() => setIsCmdOpen(false)}
                className="block p-2 rounded-lg hover:bg-card-hover hover:text-foreground"
              >
                ➕ Donate Knowledge (Upload Notes)
              </Link>
              <Link
                href="/exam"
                onClick={() => setIsCmdOpen(false)}
                className="block p-2 rounded-lg hover:bg-card-hover hover:text-foreground"
              >
                🔥 Open Exam Emergency Room
              </Link>
              <Link
                href="/treasure"
                onClick={() => setIsCmdOpen(false)}
                className="block p-2 rounded-lg hover:bg-card-hover hover:text-foreground"
              >
                💎 Open My Treasure Chest
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
