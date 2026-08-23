'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
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

interface PendingVaultItem {
  id: string;
  title: string;
  uploader: string;
  course: string;
  type: string;
  hash: string;
  date: string;
}

export default function AdminHeadquartersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'vault' | 'reports'>('reports');
  const [resources, setResources] = useState<Resource[]>([]);
  const [reports, setReports] = useState<ResourceReport[]>([]);
  const [pendingVault, setPendingVault] = useState<PendingVaultItem[]>([]);

  // Strict Auto-Redirect: If not admin, bounce immediately to HQ
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.replace('/hq');
    }
  }, [user, isLoading, router]);

  const loadAdminData = () => {
    setResources(getResources());
    setReports(getReports());
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadAdminData();
    }
  }, [user]);

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

  // Block rendering completely for non-admin / student accounts
  if (isLoading || !user || user.role !== 'ADMIN') {
    return null;
  }

  const pendingReports = reports.filter((r) => r.status === 'PENDING');

  return (
    <div className="space-y-8 font-sans">
      {/* Admin Governance Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-md space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/10 text-foreground text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Platform Governance &amp; Moderation Command</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-mono uppercase tracking-tight text-foreground">
              {PRODUCT_TERMINOLOGY.admin}
            </h1>
            <p className="text-xs text-muted-foreground font-sans">
              Oversee content moderation, investigate reported resources, inspect real uploader identities, and verify uploads.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-foreground text-background text-xs font-bold flex items-center gap-1.5 shadow-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Super Admin Lead</span>
            </span>
          </div>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 font-mono">
        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Published Resources</span>
            <FileText className="w-4 h-4 text-foreground" />
          </div>
          <span className="block text-3xl font-black text-foreground">{resources.length}</span>
          <span className="text-[11px] text-muted-foreground mt-1 block">Live in Charity Bazaar</span>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Reports</span>
            <Flag className="w-4 h-4 text-red-400" />
          </div>
          <span className="block text-3xl font-black text-red-400">{pendingReports.length}</span>
          <span className="text-[11px] text-red-400/80 mt-1 block">Requires moderation</span>
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
          <span className="block text-3xl font-black text-foreground">0</span>
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

                  <div className="p-4 rounded-2xl bg-background border border-border space-y-2">
                    <p className="text-muted-foreground">
                      <strong className="text-foreground font-sans">Report Description:</strong> "{rep.details}"
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Reporter:</span> {rep.reporterName}
                    </p>
                  </div>

                  {/* Real Uploader Tracking Section */}
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-amber-400">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Admin Audit: Real Uploader Identity</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                      <div>
                        Real Name: <strong className="text-foreground">{targetRes?.realUploaderName || 'Unknown'}</strong>
                      </div>
                      <div>
                        Email: <strong className="text-foreground">{targetRes?.realUploaderEmail || 'N/A'}</strong>
                      </div>
                      <div>
                        Public Display Mode: <span className="text-foreground font-mono">{targetRes?.displayMode || 'N/A'}</span>
                      </div>
                      <div>
                        Public Name Shown: <span className="text-foreground">{targetRes?.publicDisplayIdentity || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleResolveReportAction(rep.id, 'DISMISS')}
                      className="px-4 py-2 rounded-xl border border-border hover:bg-card-hover font-bold text-xs text-muted-foreground hover:text-foreground transition-all"
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
