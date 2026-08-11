import Link from 'next/link';
import { BookOpen, ShieldCheck, HeartHandshake, Sparkles, ArrowRight, Award } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Navigation */}
      <header className="border-b border-border/60 bg-card/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-rose-500 via-foreground to-foreground bg-clip-text text-transparent">
                PEER'S CHARITY
              </span>
              <span className="block text-[10px] text-accent font-semibold tracking-wider uppercase">
                Academic Sharing Protocol
              </span>
            </div>
          </div>

          {/* Public Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/hq" className="hover:text-foreground transition-colors">HQ</Link>
            <Link href="/bazaar" className="hover:text-foreground transition-colors">Bazaar</Link>
            <Link href="/pantry" className="hover:text-foreground transition-colors">Pantry</Link>
            <Link href="/exam" className="hover:text-foreground transition-colors">Exam Room</Link>
            <Link href="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-all shadow-md shadow-accent/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-medium mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Non-monetary Academic Knowledge Sharing</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.15]">
          Give a Note. Get a Note.{' '}
          <span className="bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
            Save a Semester.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Your classmates already survived the course. They probably left notes.
          Discover verified academic donations, rate resources, and help your peers thrive.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/bazaar"
            className="w-full sm:w-auto px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/25 flex items-center justify-center gap-2 group"
          >
            Explore Charity Bazaar
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 bg-card border border-border/80 text-foreground font-semibold rounded-xl hover:bg-card-hover transition-all flex items-center justify-center gap-2"
          >
            Sign In to Donate
          </Link>
        </div>

        {/* Value Props Cards Grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl text-left">
          <Link href="/pantry" className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm hover:border-accent/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">Academic Pantry</h3>
            <p className="text-sm text-muted-foreground">
              Courses structured by university, department, and term with real pantry coverage metrics.
            </p>
          </Link>

          <Link href="/bazaar" className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm hover:border-accent/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">Verified Quality Score</h3>
            <p className="text-sm text-muted-foreground">
              Bayesian confidence ratings and cryptographic hash deduplication protect against duplicate spam.
            </p>
          </Link>

          <Link href="/leaderboard" className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm hover:border-accent/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">Generosity Olympics</h3>
            <p className="text-sm text-muted-foreground">
              Earn Charity Points, badges, and recognition as a top benefactor saving peer semesters.
            </p>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        <p>© 2026 PEER'S CHARITY — "We don't sell notes. We perform academic charity."</p>
      </footer>
    </div>
  );
}
