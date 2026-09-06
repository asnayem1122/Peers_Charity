'use client';

import React, { useState } from 'react';
import { AcademicSection, ExamType, MaterialType } from '@peers-charity/shared';

export interface DonatePayload {
  section: AcademicSection;
  courseId: string;
  batch: string;
  semester?: string;
  examType?: ExamType;
  materialType?: MaterialType;
  externalLink?: string;
  labNumber?: string;
  topic?: string;
}

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: DonatePayload) => void;
}

export default function DonateModal({ isOpen, onClose, onSubmit }: DonateModalProps) {
  const [section, setSection] = useState<AcademicSection>('question');
  const [courseId, setCourseId] = useState('');
  const [batch, setBatch] = useState('');
  const [semester, setSemester] = useState('');
  const [examType, setExamType] = useState<ExamType | ''>('');
  const [materialType, setMaterialType] = useState<MaterialType | ''>('');
  const [externalLink, setExternalLink] = useState('');
  const [labNumber, setLabNumber] = useState('');
  const [topic, setTopic] = useState('');

  // Errors state for inline accessibility validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!courseId.trim()) {
      newErrors.courseId = 'Course ID is required';
    }
    if (!batch.trim()) {
      newErrors.batch = 'Batch is required';
    }

    if (section === 'question') {
      if (!semester.trim()) newErrors.semester = 'Semester is required';
      if (!examType) newErrors.examType = 'Exam Type is required';
    } else if (section === 'course_material') {
      if (!semester.trim()) newErrors.semester = 'Semester is required';
      if (!materialType) newErrors.materialType = 'Material Type is required';
      if (materialType === 'EXTERNAL_LINK' && !externalLink.trim()) {
        newErrors.externalLink = 'External URL is required';
      }
    } else if (section === 'sessional') {
      if (!labNumber.trim()) newErrors.labNumber = 'Lab Number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: DonatePayload = {
      section,
      courseId: courseId.trim(),
      batch: batch.trim(),
      ...(section !== 'sessional' && semester ? { semester: semester.trim() } : {}),
      ...(section === 'sessional' && semester ? { semester: semester.trim() } : {}),
      ...(section === 'question' && examType ? { examType } : {}),
      ...(section === 'course_material' && materialType ? { materialType } : {}),
      ...(section === 'course_material' && materialType === 'EXTERNAL_LINK' && externalLink
        ? { externalLink: externalLink.trim() }
        : {}),
      ...(section === 'sessional' ? { labNumber: labNumber.trim() } : {}),
      ...(section === 'sessional' && topic ? { topic: topic.trim() } : {}),
    };

    onSubmit(payload);
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-mono uppercase">Donate Academic Resource</h2>
          <button onClick={onClose} aria-label="Close modal" className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>

        {/* Dynamic Section Switcher */}
        <div role="radiogroup" aria-label="Academic Section" className="grid grid-cols-3 gap-2 font-mono text-xs">
          <button
            type="button"
            role="radio"
            aria-checked={section === 'question'}
            onClick={() => {
              setSection('question');
              setErrors({});
            }}
            className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
              section === 'question' ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground'
            }`}
          >
            Question Archive
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={section === 'course_material'}
            onClick={() => {
              setSection('course_material');
              setErrors({});
            }}
            className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
              section === 'course_material'
                ? 'bg-foreground text-background border-foreground'
                : 'border-border text-muted-foreground'
            }`}
          >
            Course Materials
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={section === 'sessional'}
            onClick={() => {
              setSection('sessional');
              setErrors({});
            }}
            className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
              section === 'sessional' ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground'
            }`}
          >
            Sessional / Lab
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 font-sans text-xs">
          {/* Common Fields: Course and Batch */}
          <div>
            <label htmlFor="courseId-input" className="block font-bold text-muted-foreground uppercase font-mono mb-1">
              Course ID / Code
            </label>
            <input
              id="courseId-input"
              type="text"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              placeholder="e.g. CSE 2104"
              aria-invalid={errors.courseId ? 'true' : 'false'}
              aria-describedby={errors.courseId ? 'courseId-error' : undefined}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
            />
            {errors.courseId && (
              <span id="courseId-error" className="text-rose-400 font-mono text-[11px] mt-1 block">
                {errors.courseId}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="batch-input" className="block font-bold text-muted-foreground uppercase font-mono mb-1">
              Batch
            </label>
            <input
              id="batch-input"
              type="text"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              placeholder="e.g. 11"
              aria-invalid={errors.batch ? 'true' : 'false'}
              aria-describedby={errors.batch ? 'batch-error' : undefined}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-foreground"
            />
            {errors.batch && (
              <span id="batch-error" className="text-rose-400 font-mono text-[11px] mt-1 block">
                {errors.batch}
              </span>
            )}
          </div>

          {/* Question Section Specific: Semester & Exam Type */}
          {section === 'question' && (
            <>
              <div>
                <label htmlFor="semester-input" className="block font-bold text-muted-foreground uppercase font-mono mb-1">
                  Semester
                </label>
                <input
                  id="semester-input"
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g. Level 2 / Term 1"
                  aria-invalid={errors.semester ? 'true' : 'false'}
                  aria-describedby={errors.semester ? 'semester-error' : undefined}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground"
                />
                {errors.semester && (
                  <span id="semester-error" className="text-rose-400 font-mono text-[11px] mt-1 block">
                    {errors.semester}
                  </span>
                )}
              </div>

              <div>
                <span className="block font-bold text-muted-foreground uppercase font-mono mb-1">
                  Exam Type
                </span>
                <div role="group" aria-label="Exam Type" className="grid grid-cols-3 gap-2 font-mono">
                  {(['CT', 'MID', 'FINAL'] as ExamType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setExamType(type)}
                      className={`p-2 rounded-xl border font-bold ${
                        examType === type ? 'bg-amber-500 text-black border-amber-500' : 'border-border text-muted-foreground'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {errors.examType && (
                  <span className="text-rose-400 font-mono text-[11px] mt-1 block">
                    {errors.examType}
                  </span>
                )}
              </div>
            </>
          )}

          {/* Course Material Specific: Material Type & External Link */}
          {section === 'course_material' && (
            <>
              <div>
                <label htmlFor="semester-input" className="block font-bold text-muted-foreground uppercase font-mono mb-1">
                  Semester
                </label>
                <input
                  id="semester-input"
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g. Level 2 / Term 1"
                  aria-invalid={errors.semester ? 'true' : 'false'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground"
                />
                {errors.semester && (
                  <span className="text-rose-400 font-mono text-[11px] mt-1 block">{errors.semester}</span>
                )}
              </div>

              <div>
                <label htmlFor="materialType-select" className="block font-bold text-muted-foreground uppercase font-mono mb-1">
                  Material Type
                </label>
                <select
                  id="materialType-select"
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value as MaterialType)}
                  aria-invalid={errors.materialType ? 'true' : 'false'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground"
                >
                  <option value="">Select Material Type</option>
                  <option value="HAND_NOTE">Hand Note</option>
                  <option value="SLIDES">Slides</option>
                  <option value="EXTERNAL_LINK">External Link</option>
                </select>
                {errors.materialType && (
                  <span className="text-rose-400 font-mono text-[11px] mt-1 block">{errors.materialType}</span>
                )}
              </div>

              {materialType === 'EXTERNAL_LINK' && (
                <div>
                  <label htmlFor="externalLink-input" className="block font-bold text-muted-foreground uppercase font-mono mb-1">
                    External URL
                  </label>
                  <input
                    id="externalLink-input"
                    type="url"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    placeholder="https://..."
                    aria-invalid={errors.externalLink ? 'true' : 'false'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground"
                  />
                  {errors.externalLink && (
                    <span className="text-rose-400 font-mono text-[11px] mt-1 block">{errors.externalLink}</span>
                  )}
                </div>
              )}
            </>
          )}

          {/* Sessional Specific: Lab Number & Topic (Semester is optional) */}
          {section === 'sessional' && (
            <>
              <div>
                <label htmlFor="labNumber-input" className="block font-bold text-muted-foreground uppercase font-mono mb-1">
                  Lab Number / Task
                </label>
                <input
                  id="labNumber-input"
                  type="text"
                  value={labNumber}
                  onChange={(e) => setLabNumber(e.target.value)}
                  placeholder="e.g. Lab 02"
                  aria-invalid={errors.labNumber ? 'true' : 'false'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground"
                />
                {errors.labNumber && (
                  <span className="text-rose-400 font-mono text-[11px] mt-1 block">{errors.labNumber}</span>
                )}
              </div>

              <div>
                <label htmlFor="topic-input" className="block font-bold text-muted-foreground uppercase font-mono mb-1">
                  Topic (Optional)
                </label>
                <input
                  id="topic-input"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Socket Programming"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-3 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-card-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-foreground text-background font-bold hover:opacity-90 transition-opacity"
            >
              Submit Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
