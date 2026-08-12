'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Sparkles, BookOpen, PlusCircle, Download, Check, ShieldCheck, FileText, Star, Eye } from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';
import { getResources, recordDownload, Resource } from '@/lib/resources-data';
import ResourceDetailModal from '@/components/ui/resource-detail-modal';
import ReportResourceModal from '@/components/ui/report-resource-modal';
import GuestAuthModal from '@/components/ui/guest-auth-modal';

export default function ExamEmergencyRoomPage() {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  // Modals
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ id: string; title: string }>({ id: '', title: '' });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authActionName, setAuthActionName] = useState('access this feature');

  const loadData = () => {
    setResources(getResources());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRequireAuth = (actionName: string) => {
    setAuthActionName(actionName);
    setIsAuthModalOpen(true);
  };

  const handleDownload = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) {
      handleRequireAuth('download high-yield exam packs');
      return;
    }
    const updated = recordDownload(id);
    setDownloadedIds(updated);
    loadData();
  };

  const examPackFilter = resources.filter((res) => {
    const matchesCourse = selectedCourse === 'ALL' || res.courseCode === selectedCourse;
    return matchesCourse;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Signature Panic Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-card to-card border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5 shadow-md">
            <Flame className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2 font-mono uppercase">
              <span>{PRODUCT_TERMINOLOGY.examPrep}</span>
            </h1>
            <p className="text-xs sm:text-sm text-amber-400 font-semibold mt-0.5 font-mono">
              "Congratulations. Panic has been detected. High-yield revision packs loaded."
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/donate"
            className="liquid-metal-btn px-5 py-3 text-xs font-bold font-mono flex items-center gap-1.5 shadow-xl"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Solved Questions</span>
          </Link>
        </div>
      </div>

      {/* Course Filter Bar */}
      <div className="flex items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['ALL', 'CSE 2103', 'CSE 3101', 'CSE 3205', 'MATH 2101', 'EEE 2101'].map((course) => (
            <button
              key={course}
              onClick={() => setSelectedCourse(course)}
              className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 ${
                selectedCourse === course
                  ? 'bg-foreground text-background shadow-md'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {course === 'ALL' ? 'All Emergency Courses' : course}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Resource List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {examPackFilter.map((pack) => {
          const isDownloaded = downloadedIds.includes(pack.id);
          return (
            <div
              key={pack.id}
              onClick={() => {
                setSelectedResource(pack);
                setIsDetailOpen(true);
              }}
              className="p-6 rounded-3xl bg-card border border-border hover:border-amber-500/40 transition-all shadow-sm flex flex-col justify-between space-y-4 cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="px-2.5 py-0.5 rounded bg-foreground text-background font-black text-[10px]">
                    {pack.courseCode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold text-[10px]">
                    🔥 High Yield ({pack.qualityScore}% Match)
                  </span>
                </div>

                <h3 className="text-base font-bold font-sans text-foreground group-hover:text-amber-400 transition-colors line-clamp-2">
                  {pack.title}
                </h3>
                <p className="text-xs text-muted-foreground font-sans line-clamp-2">{pack.description}</p>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between font-mono text-xs">
                <div className="space-y-0.5">
                  <span className="block text-[11px] font-bold text-foreground">
                    Shared by: {pack.publicDisplayIdentity}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">{pack.downloadsCount} student downloads</span>
                </div>

                <button
                  onClick={(e) => handleDownload(e, pack.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-md ${
                    isDownloaded
                      ? 'bg-emerald-500 text-white'
                      : 'liquid-metal-btn'
                  }`}
                >
                  {isDownloaded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Pack</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <ResourceDetailModal
        resource={selectedResource}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenReportModal={(id, title) => {
          setReportTarget({ id, title });
          setIsReportOpen(true);
        }}
        onRequireAuth={handleRequireAuth}
        onResourceUpdated={loadData}
      />

      <ReportResourceModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        resourceId={reportTarget.id}
        resourceTitle={reportTarget.title}
        onRequireAuth={() => handleRequireAuth('report resources')}
      />

      <GuestAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        actionName={authActionName}
      />
    </div>
  );
}
