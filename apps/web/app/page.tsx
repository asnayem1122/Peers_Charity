'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck, HeartHandshake, Sparkles, ArrowRight, Award, Sun, Moon } from 'lucide-react';
import ConstellationGrid from '@/components/ui/constellation-grid';

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);

  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem('peers-charity-theme');
    const prefersDark = savedTheme ? savedTheme === 'dark' : true;
    setIsDark(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('peers-charity-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('peers-charity-theme', 'light');
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background font-sans">
      {/* Interactive Constellation Grid Canvas Layer */}
      <div className="fixed inset-0 z-0 opacity-85 dark:opacity-85 pointer-events-auto">
        <ConstellationGrid />
      </div>

      {/* Ambient Monochrome Background Glow Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-foreground/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-foreground/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Header Navigation */}
      <header className="border-b border-border bg-card/80 backdrop-blur-2xl sticky top-0 z-50 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-foreground text-background flex items-center justify-center font-bold shadow-md shrink-0">
              <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="font-mono font-black text-base sm:text-lg tracking-tighter text-foreground block truncate uppercase">
                PEER'S CHARITY
              </span>
              <span className="block text-[9px] sm:text-[10px] text-muted-foreground font-mono font-semibold tracking-widest uppercase truncate">
                Academic Protocol
              </span>
            </div>
          </div>

          {/* Public Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            <Link href="/hq" className="hover:text-foreground transition-colors">HQ</Link>
            <Link href="/bazaar" className="hover:text-foreground transition-colors">Bazaar</Link>
            <Link href="/pantry" className="hover:text-foreground transition-colors">Pantry</Link>
            <Link href="/exam" className="hover:text-foreground transition-colors">Exam Room</Link>
            <Link href="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-border bg-background hover:bg-card-hover text-muted-foreground hover:text-foreground transition-all"
              title="Toggle Light / Dark Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-foreground" />}
            </button>

            <Link
              href="/login"
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold bg-foreground text-background rounded-xl hover:opacity-90 transition-all shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 py-12 sm:py-24 relative z-10 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/90 backdrop-blur-xl text-foreground text-xs font-mono font-semibold mb-6 shadow-sm pointer-events-auto">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Non-monetary Academic Knowledge Sharing</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter max-w-4xl leading-none px-2 break-words pointer-events-auto uppercase">
          Give a Note. Get a Note.{' '}
          <span className="block sm:inline mt-2 sm:mt-0 text-muted-foreground font-mono font-normal tracking-normal text-3xl sm:text-5xl lg:text-6xl normal-case">
            Save a Semester.
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-lg text-muted-foreground max-w-2xl leading-relaxed px-2 pointer-events-auto">
          Your classmates already survived the course. Discover verified academic donations, rate resources, and help your peers thrive.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto px-4 pointer-events-auto">
          <Link
            href="/bazaar"
            className="w-full sm:w-auto px-8 py-4 bg-foreground text-background font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 group text-sm"
          >
            <span>Explore Charity Bazaar</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 glass-panel text-foreground font-bold rounded-2xl hover:bg-card-hover transition-all flex items-center justify-center gap-2 text-sm shadow-xl"
          >
            <span>Sign In to Donate</span>
          </Link>
        </div>

        {/* Value Props Cards Grid */}
        <div className="mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl text-left w-full pointer-events-auto">
          <Link href="/pantry" className="p-6 sm:p-7 rounded-3xl glass-panel glass-card-hover group">
            <div className="w-12 h-12 rounded-2xl bg-foreground/10 text-foreground flex items-center justify-center mb-5 shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold mb-2 group-hover:text-muted-foreground transition-colors">Academic Pantry</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Courses structured by university, department, and term with real pantry coverage metrics.
            </p>
          </Link>

          <Link href="/bazaar" className="p-6 sm:p-7 rounded-3xl glass-panel glass-card-hover group">
            <div className="w-12 h-12 rounded-2xl bg-foreground/10 text-foreground flex items-center justify-center mb-5 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold mb-2 group-hover:text-muted-foreground transition-colors">Verified Quality Score</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Bayesian confidence ratings and cryptographic hash deduplication protect against duplicate spam.
            </p>
          </Link>

          <Link href="/leaderboard" className="p-6 sm:p-7 rounded-3xl glass-panel glass-card-hover group">
            <div className="w-12 h-12 rounded-2xl bg-foreground/10 text-foreground flex items-center justify-center mb-5 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold mb-2 group-hover:text-muted-foreground transition-colors">Generosity Olympics</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Earn Charity Points, badges, and recognition as a top benefactor saving peer semesters.
            </p>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 sm:py-8 text-center text-xs text-muted-foreground px-4 backdrop-blur-xl bg-card relative z-10 font-mono">
        <p>© 2026 PEER'S CHARITY — "We don't sell notes. We perform academic charity."</p>
      </footer>
    </div>
  );
}
