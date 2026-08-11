'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  FileCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';

export default function DonateKnowledgePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resourceType, setResourceType] = useState('Lecture Notes');
  const [courseCode, setCourseCode] = useState('CSE 2103');
  const [semester, setSemester] = useState('Level 3 / Term 2');
  const [topics, setTopics] = useState('Dynamic Programming, Graphs, Trees');
  const [loading, setLoading] = useState(false);

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleNext = () => {
    if (step === 1 && !file) return;
    if (step === 2 && !title) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Title & Tagline */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Earn +10 Charity Points Per Donation</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          {PRODUCT_TERMINOLOGY.upload}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          "Share what you know. Help a classmate survive the semester."
        </p>
      </div>

      {/* Multi-Step Wizard Indicator */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { num: 1, label: '01 File' },
          { num: 2, label: '02 Details' },
          { num: 3, label: '03 Review' },
          { num: 4, label: '04 Done' },
        ].map((item) => (
          <div
            key={item.num}
            className={`p-3 rounded-xl border text-center transition-all ${
              step === item.num
                ? 'bg-accent text-white border-accent font-bold shadow-md shadow-accent/20'
                : step > item.num
                ? 'bg-accent/10 text-accent border-accent/30 font-semibold'
                : 'bg-card border-border/60 text-muted-foreground'
            }`}
          >
            <span className="text-xs">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Step 01: File Selection */}
      {step === 1 && (
        <div className="p-8 rounded-2xl bg-card border border-border/80 shadow-sm space-y-6 text-center">
          <div className="border-2 border-dashed border-border/80 hover:border-accent/60 rounded-2xl p-10 transition-all cursor-pointer bg-background/50 relative">
            <input
              type="file"
              onChange={handleFileDrop}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold">
                {file ? file.name : 'Drag and drop your academic file here'}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Supported formats: PDF, DOC, DOCX, PPT, PPTX, PNG, JPG (Max 50MB)
              </p>
            </div>
          </div>

          {file && (
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 text-xs text-accent flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <FileCheck className="w-4 h-4" />
                <span>{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-accent text-white">
                Ready
              </span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              disabled={!file}
              onClick={handleNext}
              className="px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-all shadow-md shadow-accent/20 flex items-center gap-2 text-sm disabled:opacity-40"
            >
              <span>Next: Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 02: Metadata Tagging */}
      {step === 2 && (
        <div className="p-8 rounded-2xl bg-card border border-border/80 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
              Resource Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dynamic Programming Survival Notes"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                Course Code
              </label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                Resource Type
              </label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="Lecture Notes">Lecture Notes</option>
                <option value="Class Notes">Class Notes</option>
                <option value="Previous Exam Questions">Previous Questions</option>
                <option value="Solved Questions">Solved Questions</option>
                <option value="Cheat Sheets">Cheat Sheets</option>
                <option value="Lab Reports">Lab Reports</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
              Topics / Tags (comma separated)
            </label>
            <input
              type="text"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="Dynamic Programming, Graphs, Memoization"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl border border-border hover:bg-card-hover text-sm font-semibold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              disabled={!title}
              onClick={handleNext}
              className="px-6 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-all shadow-md shadow-accent/20 flex items-center gap-2 text-sm disabled:opacity-40"
            >
              <span>Next: Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 03: Review & Hash Duplicate Check */}
      {step === 3 && (
        <div className="p-8 rounded-2xl bg-card border border-border/80 shadow-sm space-y-6">
          <h3 className="text-lg font-bold">Review Your Donation</h3>

          <div className="space-y-3 text-xs bg-background/50 p-4 rounded-xl border border-border">
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Title:</span>
              <span className="font-bold">{title}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Course:</span>
              <span className="font-semibold">{courseCode}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-semibold">{resourceType}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">File:</span>
              <span className="font-mono text-accent">{file?.name}</span>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl border border-border hover:bg-card-hover text-sm font-semibold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/25 flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Donation...</span>
                </>
              ) : (
                <>
                  <span>Donate Knowledge</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 04: Completion Success */}
      {step === 4 && (
        <div className="p-10 rounded-2xl bg-card border border-border/80 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-extrabold">Donation Published!</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your notes have been published to the Charity Bazaar. You just earned{' '}
            <span className="font-bold text-amber-400">+10 Charity Points</span>!
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => router.push('/hq')}
              className="px-6 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-all shadow-md shadow-accent/20 text-sm"
            >
              Back to Charity HQ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
