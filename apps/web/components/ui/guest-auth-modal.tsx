'use client';

import Link from 'next/link';
import { X, Lock, LogIn, UserPlus, ShieldCheck } from 'lucide-react';

interface GuestAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionName?: string;
}

export default function GuestAuthModal({ isOpen, onClose, actionName = 'access this feature' }: GuestAuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-2xl space-y-6 text-center font-sans">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full border border-border bg-background hover:bg-card-hover text-muted-foreground hover:text-foreground transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Authentication Required
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-mono uppercase tracking-tight text-foreground">
            Sign In to {actionName}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Resource discovery is public for all students! Signing in is only required to <span className="font-semibold text-foreground">{actionName}</span>, contribute notes, or earn Charity Points.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/login"
            onClick={onClose}
            className="liquid-metal-btn w-full py-3 text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-lg"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In Now</span>
          </Link>
          <Link
            href="/register"
            onClick={onClose}
            className="liquid-metal-btn-secondary w-full py-3 text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
