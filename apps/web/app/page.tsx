'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  Award,
  Sun,
  Moon,
  LogOut,
  User,
  LayoutDashboard,
  PlusCircle,
  Menu,
  X,
  Compass,
  Flame,
} from 'lucide-react';
import ConstellationGrid from '@/components/ui/constellation-grid';
import HowItWorks from '@/components/ui/how-it-works';
import { useAuth } from '@/lib/auth-context';

export default function LandingPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handleLogout = () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    logout();
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

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
      <header className="border-b border-border bg-card/90 backdrop-blur-2xl sticky top-0 z-50 transition-all shadow-sm">
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

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
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

            {/* Desktop Auth Controls */}
            <div className="hidden sm:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/hq"
                    className="px-3.5 py-2 text-xs sm:text-sm font-bold bg-foreground text-background rounded-xl hover:opacity-90 transition-all shadow-md flex items-center gap-1.5 font-mono"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Enter HQ</span>
                  </Link>

                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 p-1 rounded-xl hover:bg-card-hover transition-all"
                    >
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-8 h-8 rounded-xl object-cover ring-2 ring-foreground/20"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-foreground text-background flex items-center justify-center text-xs font-bold font-mono">
                          {initials}
                        </div>
                      )}
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl glass-panel shadow-2xl z-50 overflow-hidden text-left">
                        <div className="p-3 border-b border-border">
                          <span className="block text-xs font-bold">{user.name}</span>
                          <span className="block text-[10px] text-muted-foreground truncate">{user.email}</span>
                        </div>
                        <div className="p-1.5 space-y-1 font-mono">
                          <Link
                            href="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold hover:bg-card-hover"
                          >
                            <User className="w-4 h-4" />
                            <span>My Charity Card</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 font-mono">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-xs font-bold bg-foreground text-background rounded-xl hover:opacity-90 transition-all shadow-md"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Button (Visible on Phones < md) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-border bg-card text-foreground hover:bg-card-hover transition-all"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Panel (Appears on Mobile when Hamburger is tapped) */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-2xl px-4 py-4 space-y-3 font-mono text-sm animate-in slide-in-from-top-2 duration-200 shadow-2xl">
            <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wider">
              <Link
                href="/hq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-background border border-border flex items-center gap-2 text-foreground"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>HQ</span>
              </Link>
              <Link
                href="/bazaar"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-background border border-border flex items-center gap-2 text-foreground"
              >
                <Compass className="w-4 h-4" />
                <span>Bazaar</span>
              </Link>
              <Link
                href="/pantry"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-background border border-border flex items-center gap-2 text-foreground"
              >
                <BookOpen className="w-4 h-4" />
                <span>Pantry</span>
              </Link>
              <Link
                href="/exam"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-background border border-border flex items-center gap-2 text-foreground"
              >
                <Flame className="w-4 h-4" />
                <span>Exam Room</span>
              </Link>
              <Link
                href="/leaderboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-background border border-border flex items-center gap-2 text-foreground col-span-2"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Generosity Leaderboard</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-border flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl bg-foreground text-background font-bold text-center text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>My Charity Card ({user.name})</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 font-bold text-xs hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-border text-center font-bold text-xs hover:bg-card-hover"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-foreground text-background font-bold text-center text-xs shadow-md"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 py-12 sm:py-20 relative z-10 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/90 backdrop-blur-xl text-foreground text-xs font-mono font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Non-monetary Academic Knowledge Sharing</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter max-w-4xl leading-none px-2 break-words uppercase">
          Give a Note. Get a Note.{' '}
          <span className="block sm:inline mt-2 sm:mt-0 text-muted-foreground font-mono font-normal tracking-normal text-3xl sm:text-5xl lg:text-6xl normal-case">
            Save a Semester.
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-lg text-muted-foreground max-w-2xl leading-relaxed px-2">
          Your classmates already survived the course. Discover verified academic donations, rate resources, and help your peers thrive.
        </p>

        {/* Dynamic Hero CTA Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto px-4">
          <Link
            href="/bazaar"
            className="w-full sm:w-auto px-8 py-4 bg-foreground text-background font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 group text-sm"
          >
            <span>Explore Charity Bazaar</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          {user ? (
            <Link
              href="/donate"
              className="w-full sm:w-auto px-8 py-4 glass-panel text-foreground font-bold rounded-2xl hover:bg-card-hover transition-all flex items-center justify-center gap-2 text-sm shadow-xl"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Donate Knowledge</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 glass-panel text-foreground font-bold rounded-2xl hover:bg-card-hover transition-all flex items-center justify-center gap-2 text-sm shadow-xl"
            >
              <span>Sign In to Donate</span>
            </Link>
          )}
        </div>

        {/* Value Props Cards Grid */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl text-left w-full">
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

        {/* How It Works Flow Section */}
        <div className="mt-20 w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-4xl font-black font-mono uppercase tracking-tight">
              Academic Protocol Flow
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
              How Peer's Charity protects students, verifies notes, and saves semesters step-by-step.
            </p>
          </div>
          <HowItWorks />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 sm:py-8 text-center text-xs text-muted-foreground px-4 backdrop-blur-xl bg-card relative z-10 font-mono">
        <p>© 2026 PEER'S CHARITY — "We don't sell notes. We perform academic charity."</p>
      </footer>
    </div>
  );
}
