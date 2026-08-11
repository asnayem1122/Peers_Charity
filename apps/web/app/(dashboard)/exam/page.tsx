'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Flame, Sparkles, BookOpen, PlusCircle } from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';

export default function ExamEmergencyRoomPage() {
  const [selectedCourse, setSelectedCourse] = useState('CSE 2103');
  const emergencyResources: any[] = [];

  return (
    <div className="space-y-8">
      {/* Signature Panic Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-card to-card border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Flame className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <span>{PRODUCT_TERMINOLOGY.examPrep}</span>
            </h1>
            <p className="text-xs text-amber-400 font-semibold mt-0.5">
              "Congratulations. Panic has been detected."
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/donate"
            className="px-4 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Solved Questions</span>
          </Link>
        </div>
      </div>

      {/* Fresh Empty State */}
      {emergencyResources.length === 0 ? (
        <div className="p-12 rounded-2xl bg-card border border-border/80 text-center space-y-4 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Flame className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">No Emergency Exam Resources Yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            "No solved question banks or cheat sheets have been uploaded for exam prep yet. Help your classmates survive by uploading your solved papers!"
          </p>
          <Link
            href="/donate"
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 mt-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Solved Exam Papers</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
