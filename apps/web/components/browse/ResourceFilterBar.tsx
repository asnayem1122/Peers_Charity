'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Compass, FileQuestion, BookOpen, FlaskConical } from 'lucide-react';

export interface ResourceFilterBarProps {
  onFilterChange?: (filters: {
    section?: string;
    examType?: string;
    materialType?: string;
    batch?: string;
  }) => void;
  className?: string;
}

export default function ResourceFilterBar({ onFilterChange, className = '' }: ResourceFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read state from URL search params with fallbacks
  const currentSection = searchParams?.get('section') || 'ALL';
  const currentExamType = searchParams?.get('examType') || 'ALL';
  const currentMaterialType = searchParams?.get('materialType') || 'ALL';

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams?.toString() || '');

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'ALL') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname || '/';
    router.replace(targetUrl, { scroll: false });

    if (onFilterChange) {
      onFilterChange({
        section: params.get('section') || undefined,
        examType: params.get('examType') || undefined,
        materialType: params.get('materialType') || undefined,
        batch: params.get('batch') || undefined,
      });
    }
  };

  const handleSectionSelect = (newSection: string) => {
    if (newSection === currentSection) return;

    // Critical Requirement: When switching section, automatically clear irrelevant sub-filters
    const updates: Record<string, string | null> = {
      section: newSection === 'ALL' ? null : newSection,
      examType: null,
      materialType: null,
      batch: null,
    };

    updateFilters(updates);
  };

  const handleExamTypeSelect = (examType: string) => {
    updateFilters({ examType: examType === 'ALL' ? null : examType });
  };

  const handleMaterialTypeSelect = (materialType: string) => {
    updateFilters({ materialType: materialType === 'ALL' ? null : materialType });
  };

  return (
    <div className={`p-5 rounded-3xl bg-card border border-border shadow-sm space-y-4 font-mono ${className}`}>
      {/* Top Section Tabs */}
      <div role="tablist" aria-label="Academic Sections" className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {[
          { id: 'ALL', label: 'All Sections', icon: Compass, color: 'text-foreground' },
          { id: 'question', label: 'Question Archive', icon: FileQuestion, color: 'text-amber-400' },
          { id: 'course_material', label: 'Course Materials', icon: BookOpen, color: 'text-blue-400' },
          { id: 'sessional', label: 'Sessional / Lab', icon: FlaskConical, color: 'text-emerald-400' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = currentSection === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => handleSectionSelect(tab.id)}
              className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                isSelected
                  ? 'bg-foreground text-background font-bold shadow-md border-foreground'
                  : 'bg-background hover:bg-card-hover border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-background' : tab.color}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Filters: Question Exam Types */}
      {currentSection === 'question' && (
        <div role="region" aria-label="Exam Type Filters" className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-border/50">
          <span className="text-[11px] text-amber-400 font-bold uppercase mr-1">Exam Type:</span>
          {['ALL', 'CT', 'MID', 'FINAL'].map((exam) => (
            <button
              key={exam}
              type="button"
              onClick={() => handleExamTypeSelect(exam)}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                currentExamType === exam
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-background hover:bg-card-hover border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {exam === 'ALL' ? 'All Exam Types' : exam}
            </button>
          ))}
        </div>
      )}

      {/* Sub-Filters: Course Material Types */}
      {currentSection === 'course_material' && (
        <div role="region" aria-label="Material Type Filters" className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-border/50">
          <span className="text-[11px] text-blue-400 font-bold uppercase mr-1">Material Type:</span>
          {[
            { id: 'ALL', label: 'All Materials' },
            { id: 'HAND_NOTE', label: 'Hand Notes' },
            { id: 'SLIDES', label: 'Slides' },
            { id: 'EXTERNAL_LINK', label: 'External Links' },
          ].map((mat) => (
            <button
              key={mat.id}
              type="button"
              onClick={() => handleMaterialTypeSelect(mat.id)}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                currentMaterialType === mat.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-background hover:bg-card-hover border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {mat.label}
            </button>
          ))}
        </div>
      )}

      {/* Sessional Notice / Sub-filter Info */}
      {currentSection === 'sessional' && (
        <div role="region" aria-label="Sessional Filter Notice" className="flex items-center gap-2 text-xs pt-1 border-t border-border/50 text-emerald-400">
          <FlaskConical className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[11px] font-mono">Viewing Sessional Labs, Manuals & Reports across all courses.</span>
        </div>
      )}
    </div>
  );
}
