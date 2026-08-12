'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Flame, Sparkles, BookOpen, PlusCircle, Download, Check, ShieldCheck, FileText } from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';

export default function ExamEmergencyRoomPage() {
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  const emergencyResources = [
    {
      id: 'e-1',
      title: 'CSE 2103: Dynamic Programming & Graph Algorithms Exam Cheat Sheet',
      course: 'CSE 2103',
      type: 'Cheat Sheets',
      yieldScore: '99% Exam Frequency',
      downloadCount: 184,
      fileSize: '3.8 MB',
      date: 'Final Exam Pack',
    },
    {
      id: 'e-2',
      title: 'CSE 3101: Operating Systems Past 5 Years Solved Question Papers',
      course: 'CSE 3101',
      type: 'Solved Questions',
      yieldScore: '97% Exam Frequency',
      downloadCount: 260,
      fileSize: '7.4 MB',
      date: 'Midterm & Final',
    },
    {
      id: 'e-3',
      title: 'CSE 3205: Artificial Intelligence Machine Learning Formulas & Proofs',
      course: 'CSE 3205',
      type: 'Cheat Sheets',
      yieldScore: '95% Exam Frequency',
      downloadCount: 112,
      fileSize: '5.1 MB',
      date: 'High Yield',
    },
  ];

  const handleDownload = (id: string) => {
    if (!downloadedIds.includes(id)) {
      setDownloadedIds((prev) => [...prev, id]);
    }
  };

  const filtered = emergencyResources.filter(
    (res) => selectedCourse === 'ALL' || res.course === selectedCourse
  );

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
          {['ALL', 'CSE 2103', 'CSE 3101', 'CSE 3205'].map((course) => (
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

      {/* Emergency Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((res) => {
          const isDownloaded = downloadedIds.includes(res.id);

          return (
            <div
              key={res.id}
              className="p-6 rounded-3xl bg-card border border-amber-500/30 shadow-xl relative overflow-hidden flex flex-col justify-between hover:border-amber-500/60 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 font-black text-xs border border-amber-500/30">
                    🔥 {res.course}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    {res.yieldScore}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground leading-snug mb-2 font-sans">
                  {res.title}
                </h3>

                <p className="text-xs text-muted-foreground font-mono mb-4">
                  Type: <span className="text-foreground font-semibold">{res.type}</span> • {res.fileSize}
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between font-mono">
                <span className="text-xs text-muted-foreground">
                  {res.downloadCount} downloads
                </span>

                <button
                  onClick={() => handleDownload(res.id)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                    isDownloaded
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
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
    </div>
  );
}
