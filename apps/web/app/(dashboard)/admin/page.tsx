'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  LogIn,
  UserCheck,
  Award,
  FileText,
  Users,
} from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';

export default function AdminHeadquartersPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'vault' | 'police' | 'analytics'>('vault');

  // Role Guard: Block guests and non-admin users
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 sm:p-10 rounded-3xl bg-card border border-border shadow-2xl text-center space-y-6 relative overflow-hidden font-sans">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto shadow-lg">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
            Admin Governance Guard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-mono uppercase tracking-tight text-foreground">
            System Admin Access Required
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            This dashboard is restricted to System Overseers and Moderation Admins. Sign in with administrative credentials to access the Donation Vault review queue and content moderation.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-muted border border-border text-xs font-mono text-left space-y-1">
          <p className="font-bold text-foreground">Admin Credentials:</p>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Email:</span> admin@university.edu
          </p>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Password:</span> password123
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/login"
            className="liquid-metal-btn w-full sm:w-auto px-7 py-3.5 text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-xl"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In as Admin</span>
          </Link>

          <Link
            href="/hq"
            className="liquid-metal-btn-secondary w-full sm:w-auto px-7 py-3.5 text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Return to HQ</span>
          </Link>
        </div>
      </div>
    );
  }

  const pendingVault = [
    {
      id: 'v-101',
      title: 'CSE 3101: Operating Systems Final Review Question Bank',
      uploader: 'nayem@student.university.edu',
      course: 'CSE 3101',
      type: 'Solved Questions',
      hash: 'sha256:9f8a7c6b5e4d3c2b1a',
      date: 'Just now',
    },
    {
      id: 'v-102',
      title: 'CSE 2103: Dynamic Programming Master Formula Sheet',
      uploader: 'sarah.k@student.university.edu',
      course: 'CSE 2103',
      type: 'Cheat Sheets',
      hash: 'sha256:1a2b3c4d5e6f7a8b9c',
      date: '2 hours ago',
    },
  ];

  const policeFlags = [
    {
      id: 'f-201',
      title: 'Suspicious Duplicate PDF Upload',
      reporter: 'anonymous_peer',
      resource: 'CSE 3205 Artificial Intelligence Lecture 4 Slides',
      reason: 'Cryptographic hash similarity threshold > 95%',
      date: 'Yesterday',
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/10 border border-border text-foreground text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authenticated System Overseer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2 font-mono uppercase">
            <ShieldAlert className="w-6 h-6 text-foreground" />
            <span>{PRODUCT_TERMINOLOGY.admin}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-sans">
            Platform governance, Donation Vault review queue, and Charity Police content moderation.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-foreground text-background font-bold shadow-md">
            Admin Status: Active
          </span>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-mono">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Benefactors</span>
            <Users className="w-4 h-4 text-foreground" />
          </div>
          <span className="block text-3xl font-black">42</span>
          <span className="text-[11px] text-muted-foreground mt-1 block">Active students</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Published Notes</span>
            <FileText className="w-4 h-4 text-foreground" />
          </div>
          <span className="block text-3xl font-black text-foreground">18</span>
          <span className="text-[11px] text-muted-foreground mt-1 block">Verified materials</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Vault Review Queue</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <span className="block text-3xl font-black text-amber-400">{pendingVault.length}</span>
          <span className="text-[11px] text-amber-400/80 mt-1 block">Pending approval</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Charity Police Flags</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <span className="block text-3xl font-black text-red-400">{policeFlags.length}</span>
          <span className="text-[11px] text-red-400/80 mt-1 block">Flagged items</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="border-b border-border flex items-center gap-6 text-sm font-bold font-mono">
        <button
          onClick={() => setActiveTab('vault')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'vault' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>{PRODUCT_TERMINOLOGY.resourceVault} Review Queue</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30">
            {pendingVault.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('police')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'police' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>{PRODUCT_TERMINOLOGY.moderation} Flags</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-400 border border-red-500/30">
            {policeFlags.length}
          </span>
        </button>
      </div>

      {/* Tab Content: Vault Queue */}
      {activeTab === 'vault' && (
        <div className="space-y-4">
          {pendingVault.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-foreground/10 text-foreground font-bold text-[10px]">
                    {item.course}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[10px]">
                    {item.type}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground font-sans">{item.title}</h3>
                <p className="text-[11px] text-muted-foreground">
                  Uploader: <span className="text-foreground">{item.uploader}</span> • Hash: {item.hash}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button className="px-4 py-2 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve & Publish</span>
                </button>
                <button className="px-3 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold text-xs transition-all flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Quarantine</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Moderation Flags */}
      {activeTab === 'police' && (
        <div className="space-y-4">
          {policeFlags.map((flag) => (
            <div
              key={flag.id}
              className="p-5 rounded-2xl bg-card border border-red-500/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs"
            >
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold text-[10px]">
                  High Priority Flag
                </span>
                <h3 className="text-sm font-bold text-foreground font-sans">{flag.title}</h3>
                <p className="text-[11px] text-muted-foreground">
                  Resource: <span className="text-foreground">{flag.resource}</span>
                </p>
                <p className="text-[11px] text-red-400 font-semibold">Reason: {flag.reason}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-all shadow-md">
                  Delete & Issue Warning
                </button>
                <button className="px-3 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground font-bold text-xs transition-all">
                  Dismiss Flag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
