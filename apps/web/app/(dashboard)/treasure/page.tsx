'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, Compass, Eye, Trash2, Star, Download } from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';
import { getResources, getSavedResourceIds, toggleSaveResource, Resource } from '@/lib/resources-data';
import ResourceDetailModal from '@/components/ui/resource-detail-modal';
import ReportResourceModal from '@/components/ui/report-resource-modal';
import GuestAuthModal from '@/components/ui/guest-auth-modal';

export default function MyTreasurePage() {
  const [savedResources, setSavedResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ id: string; title: string }>({ id: '', title: '' });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const loadData = () => {
    const all = getResources();
    const savedIds = getSavedResourceIds();
    const filtered = all.filter((r) => savedIds.includes(r.id));
    setSavedResources(filtered);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleSaveResource(id);
    loadData();
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-black tracking-tight font-mono uppercase">
            {PRODUCT_TERMINOLOGY.bookmarks} ({savedResources.length})
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-sans">
            Your personal vault of bookmarked academic notes and saved study materials.
          </p>
        </div>

        <Link
          href="/bazaar"
          className="liquid-metal-btn px-5 py-2.5 rounded-2xl text-xs font-bold font-mono flex items-center gap-2 self-start shadow-md"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Bazaar</span>
        </Link>
      </div>

      {savedResources.length === 0 ? (
        <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-4 font-mono">
          <div className="w-16 h-16 rounded-2xl bg-foreground/10 text-foreground flex items-center justify-center mx-auto shadow-inner">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">Your Treasure Chest is Empty</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto font-sans">
              "Time to visit the Charity Bazaar and save your first academic donation."
            </p>
          </div>
          <Link
            href="/bazaar"
            className="liquid-metal-btn inline-block px-6 py-3 text-xs font-bold uppercase shadow-lg"
          >
            Visit Charity Bazaar
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
          {savedResources.map((res) => (
            <div
              key={res.id}
              onClick={() => {
                setSelectedResource(res);
                setIsDetailOpen(true);
              }}
              className="p-5 rounded-3xl bg-card border border-border hover:border-foreground/40 transition-all shadow-sm flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="space-y-1 flex-1 min-w-0 font-sans">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-0.5 rounded bg-foreground text-background font-black text-[10px]">
                    {res.courseCode}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-foreground/10 text-foreground border border-border text-[10px] font-bold">
                    {res.resourceType}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-accent transition-colors truncate">
                  {res.title}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  ⭐ {res.rating.toFixed(1)} • Shared by {res.publicDisplayIdentity}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => handleRemove(e, res.id)}
                  className="p-2.5 rounded-xl border border-border hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
                  title="Remove from Treasure Vault"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <ResourceDetailModal
        resource={selectedResource}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenReportModal={(id, title) => {
          setReportTarget({ id, title });
          setIsReportOpen(true);
        }}
        onRequireAuth={() => setIsAuthModalOpen(true)}
        onResourceUpdated={loadData}
      />

      <ReportResourceModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        resourceId={reportTarget.id}
        resourceTitle={reportTarget.title}
        onRequireAuth={() => setIsAuthModalOpen(true)}
      />

      <GuestAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        actionName="manage your treasure vault"
      />
    </div>
  );
}
