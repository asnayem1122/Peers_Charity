'use client';

import { X, HeartHandshake, ShieldCheck, BookOpen, Sparkles, CheckCircle2, Award } from 'lucide-react';

interface AboutProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutProjectModal({ isOpen, onClose }: AboutProjectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-2xl space-y-6 text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full border border-border bg-background hover:bg-card-hover text-muted-foreground hover:text-foreground transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-lg shrink-0 font-bold">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-foreground/10 text-foreground text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Academic Protocol
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-mono uppercase tracking-tight text-foreground">
              About PEER'S CHARITY
            </h2>
            <p className="text-xs text-muted-foreground">Give a Note. Get a Note. Save a Semester.</p>
          </div>
        </div>

        {/* Problem vs Solution Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-2">
            <div className="flex items-center gap-1.5 font-bold font-mono text-red-400 uppercase text-[11px]">
              <X className="w-4 h-4" />
              The Academic Problem
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Students struggle to find organized, high-quality study materials before exams. Notes are scattered across chat groups, expire over time, have zero quality assurance, and provide no recognition for contributors.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-1.5 font-bold font-mono text-emerald-400 uppercase text-[11px]">
              <CheckCircle2 className="w-4 h-4" />
              The Charity Solution
            </div>
            <p className="text-muted-foreground leading-relaxed">
              A centralized, non-monetary academic charity hub where students discover, preview, rate, and donate verified study notes, lecture slides, and past question papers while earning reputation points.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="space-y-3 font-mono text-xs">
          <h3 className="font-bold uppercase tracking-wider text-foreground">Core Platform Pillars</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-background border border-border space-y-1">
              <div className="font-bold text-foreground flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-accent" />
                <span>Public Discovery</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-sans">
                Browse, search, and preview educational resources freely without requiring an account.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-background border border-border space-y-1">
              <div className="font-bold text-foreground flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>Anonymous Sharing</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-sans">
                Share notes anonymously to public peers while maintaining secure uploader ID for moderation.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-background border border-border space-y-1">
              <div className="font-bold text-foreground flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Charity Points</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-sans">
                Earn reputation badges and climb the Generosity Leaderboard for peer contributions.
              </p>
            </div>
          </div>
        </div>

        {/* Quote Footer */}
        <div className="p-4 rounded-2xl bg-muted/60 border border-border text-center font-mono text-xs italic text-muted-foreground">
          "We don't sell notes. We perform academic charity."
        </div>
      </div>
    </div>
  );
}
