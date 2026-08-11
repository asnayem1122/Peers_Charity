'use client';

import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';

export default function AdminHeadquartersPage() {
  const [activeTab, setActiveTab] = useState<'vault' | 'police' | 'analytics'>('vault');

  const pendingVault: any[] = [];
  const policeFlags: any[] = [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-card via-card to-purple-500/10 border border-border/80 shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-purple-400" />
            <span>{PRODUCT_TERMINOLOGY.admin}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Platform governance, Donation Vault review queue, and Charity Police moderation.
          </p>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-4 rounded-xl bg-card border border-border/60">
          <span className="text-xs font-semibold text-muted-foreground uppercase">
            Total Benefactors
          </span>
          <span className="block text-2xl font-black mt-1">0</span>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/60">
          <span className="text-xs font-semibold text-muted-foreground uppercase">
            Published Donations
          </span>
          <span className="block text-2xl font-black text-accent mt-1">0</span>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/60">
          <span className="text-xs font-semibold text-amber-400 uppercase">
            Vault Pending Queue
          </span>
          <span className="block text-2xl font-black text-amber-400 mt-1">0</span>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/60">
          <span className="text-xs font-semibold text-danger uppercase">
            Charity Police Flags
          </span>
          <span className="block text-2xl font-black text-danger mt-1">0</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="border-b border-border/60 flex items-center gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('vault')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'vault' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {PRODUCT_TERMINOLOGY.resourceVault} Queue (0)
        </button>
        <button
          onClick={() => setActiveTab('police')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'police' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {PRODUCT_TERMINOLOGY.moderation} Reports (0)
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'vault' && (
        <div className="p-8 bg-card border border-border/60 rounded-2xl text-center space-y-2 text-xs text-muted-foreground">
          <p className="font-bold text-foreground">Donation Vault Queue is Empty</p>
          <p>No new uploads pending admin review.</p>
        </div>
      )}

      {activeTab === 'police' && (
        <div className="p-8 bg-card border border-border/60 rounded-2xl text-center space-y-2 text-xs text-muted-foreground">
          <p className="font-bold text-foreground">No Moderation Reports</p>
          <p>Charity Police has zero suspicious donation flags.</p>
        </div>
      )}
    </div>
  );
}
