'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  LogIn,
  Award,
  FileText,
  Users,
  Flag,
  Trash2,
  Eye,
  Check,
} from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';
import { getResources, getReports, resolveReport, Resource, ResourceReport } from '@/lib/resources-data';

export default function AdminHeadquartersPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'vault' | 'reports'>('reports');
  const [resources, setResources] = useState<Resource[]>([]);
  const [reports, setReports] = useState<ResourceReport[]>([]);

  const loadAdminData = () => {
    setResources(getResources());
    setReports(getReports());
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const [pendingVault, setPendingVault] = useState([
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
  ]);

  const handleApproveVault = (id: string) => {
    setPendingVault((prev) => prev.filter((i) => i.id !== id));
  };

  const handleQuarantineVault = (id: string) => {
    setPendingVault((prev) => prev.filter((i) => i.id !== id));
  };

  const handleResolveReportAction = (reportId: string, action: 'DELETE' | 'DISMISS') => {
    resolveReport(reportId, action === 'DELETE' ? 'RESOLVED' : 'DISMISSED', action === 'DELETE');
    loadAdminData();
  };

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
            This dashboard is restricted to System Overseers and Moderation Admins. Sign in with administrative credentials to access moderation reports and real uploader identities.
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

  const pendingReports = reports.filter((r) => r.status === 'PENDING');

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/10 border border-border text-foreground text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Authenticated System Overseer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2 font-mono uppercase">
            <ShieldAlert className="w-6 h-6 text-foreground" />
            <span>{PRODUCT_TERMINOLOGY.admin}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-sans">
            Platform governance, resource reports moderation, and real uploader identity tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-4 py-2 rounded-xl bg-foreground text-background font-bold shadow-md">
            Admin Status: Active
          </span>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-mono">
        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Resources</span>
            <FileText className="w-4 h-4 text-foreground" />
          </div>
          <span className="block text-3xl font-black">{resources.length}</span>
          <span className="text-[11px] text-muted-foreground mt-1 block">Catalog items</span>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Reports</span>
            <Flag className="w-4 h-4 text-red-400" />
          </div>
          <span className="block text-3xl font-black text-red-400">{pendingReports.length}</span>
          <span className="text-[11px] text-red-400/80 mt-1 block">Moderation flags</span>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Vault Review Queue</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <span className="block text-3xl font-black text-amber-400">{pendingVault.length}</span>
          <span className="text-[11px] text-amber-400/80 mt-1 block">Pending approval</span>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Students</span>
            <Users className="w-4 h-4 text-foreground" />
          </div>
          <span className="block text-3xl font-black text-foreground">42</span>
          <span className="text-[11px] text-muted-foreground mt-1 block">Registered benefactors</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="border-b border-border flex items-center gap-6 text-sm font-bold font-mono">
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'reports' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>Resource Reports ({pendingReports.length})</span>
          {pendingReports.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-red-500/10 text-red-400 border border-red-500/30">
              {pendingReports.length} High Priority
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'vault' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>Donation Vault Review Queue ({pendingVault.length})</span>
        </button>
      </div>

      {/* Tab Content 1: Resource Reports Moderation */}
      {activeTab === 'reports' && (
        <div className="space-y-4 font-mono text-xs">
          {pendingReports.length === 0 ? (
            <div className="p-10 bg-card border border-border rounded-3xl text-center space-y-2 text-muted-foreground">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-bold text-foreground">No Pending Reports</p>
              <p className="font-sans">All resource reports have been reviewed and resolved by System Overseers.</p>
            </div>
          ) : (
            pendingReports.map((rep) => {
              const targetRes = resources.find((r) => r.id === rep.resourceId);
              return (
                <div
                  key={rep.id}
                  className="p-6 rounded-3xl bg-card border border-red-500/30 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded bg-red-500/10 text-red-400 font-bold text-[10px]">
                        Reason: {rep.reason}
                      </span>
                      <h3 className="text-sm font-bold text-foreground font-sans pt-1">{rep.resourceTitle}</h3>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{rep.createdAt}</span>
                  </div>

                  {/* Real Uploader Tracking (Anonymous to public ≠ Anonymous to Admin) */}
                  <div className="p-3.5 rounded-2xl bg-muted/60 border border-border space-y-1 font-sans">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-muted-foreground">
                        Public Display Identity:{' '}
                        <strong className="text-foreground">{targetRes?.publicDisplayIdentity || 'Shared Anonymously'}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold">
                        Uploader Verified: {targetRes?.realUploaderEmail || 'nayem@student.university.edu'}
                      </span>
                    </div>
                    <p className="text-xs text-foreground italic pt-1">
                      Report Details: "{rep.details}" — Reported by {rep.reporterName}
                    </p>
                  </div>

                  {/* Moderation Actions */}
                  <div className="flex items-center justify-end gap-3 pt-1">
                    <button
                      onClick={() => handleResolveReportAction(rep.id, 'DISMISS')}
                      className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground font-bold transition-all"
                    >
                      Dismiss Report
                    </button>

                    <button
                      onClick={() => handleResolveReportAction(rep.id, 'DELETE')}
                      className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Resource &amp; Issue Warning</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab Content 2: Vault Review Queue */}
      {activeTab === 'vault' && (
        <div className="space-y-4">
          {pendingVault.length === 0 ? (
            <div className="p-8 bg-card border border-border rounded-3xl text-center space-y-2 text-xs text-muted-foreground font-mono">
              <p className="font-bold text-foreground">Donation Vault Queue is Empty</p>
              <p>All pending notes have been reviewed and published!</p>
            </div>
          ) : (
            pendingVault.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-foreground/10 text-foreground font-bold text-[10px]">
                      {item.course}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px]">
                      {item.type}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground font-sans">{item.title}</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Uploader: <span className="text-foreground">{item.uploader}</span> • Hash: {item.hash}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApproveVault(item.id)}
                    className="px-4 py-2 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve &amp; Publish</span>
                  </button>
                  <button
                    onClick={() => handleQuarantineVault(item.id)}
                    className="px-3.5 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold text-xs transition-all flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Quarantine</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
