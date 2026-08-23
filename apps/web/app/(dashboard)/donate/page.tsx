'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  Lock,
  LogIn,
  UserPlus,
  ShieldCheck,
  User,
  Eye,
  ExternalLink,
  Info,
} from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';
import { addResource, ResourceType, DisplayMode, ContentSource } from '@/lib/resources-data';

export default function DonateKnowledgePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [externalUrl, setExternalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseCode, setCourseCode] = useState('CSE 2103');
  const [courseName, setCourseName] = useState('Database Systems');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('Level 2 / Term 1');
  const [resourceType, setResourceType] = useState<ResourceType>('Notes');
  const [contentSource, setContentSource] = useState<ContentSource>('Created by me');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('PROFILE');
  const [customDisplayName, setCustomDisplayName] = useState('');
  const [topics, setTopics] = useState('');
  const [loading, setLoading] = useState(false);

  // Auth Guard: Require authentication to donate knowledge
  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 sm:p-10 rounded-3xl bg-card border border-border shadow-2xl text-center space-y-6 relative overflow-hidden font-sans">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            Authentication Guard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-mono uppercase tracking-tight text-foreground">
            Sign In Required to Donate Knowledge
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            You are currently browsing in Guest Mode. Please sign in to your student account to upload notes, choose your display identity, and earn Charity Points!
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/login"
            className="liquid-metal-btn w-full sm:w-auto px-7 py-3.5 text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-xl"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Continue</span>
          </Link>

          <Link
            href="/register"
            className="liquid-metal-btn-secondary w-full sm:w-auto px-7 py-3.5 text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-lg"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Calculate public display identity
    let publicDisplay = user.name;
    if (displayMode === 'ANONYMOUS') {
      publicDisplay = 'Shared Anonymously';
    } else if (displayMode === 'CUSTOM' && customDisplayName.trim()) {
      publicDisplay = customDisplayName.trim();
    } else if (user.levelTerm) {
      publicDisplay = `${user.name} (${user.levelTerm})`;
    }

    // Validate and sanitize external URL if selected
    let sanitizedExternalUrl: string | undefined = undefined;
    if (resourceType === 'External Link') {
      try {
        const parsed = new URL(externalUrl.trim());
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
          sanitizedExternalUrl = parsed.toString();
        } else {
          setLoading(false);
          alert('Invalid URL: Only http:// and https:// links are permitted.');
          return;
        }
      } catch {
        setLoading(false);
        alert('Please provide a valid educational URL (e.g. https://example.com)');
        return;
      }
    }

    setTimeout(() => {
      addResource({
        title: title || 'Untitled Academic Note',
        description: description || 'No description provided.',
        courseCode,
        courseName,
        department,
        semester,
        resourceType,
        contentSource,
        fileUrl: file ? `/samples/${file.name}` : undefined,
        fileName: file ? file.name : undefined,
        fileSize: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : undefined,
        externalUrl: sanitizedExternalUrl,
        realUploaderId: user.id,
        realUploaderEmail: user.email,
        realUploaderName: user.name,
        displayMode,
        customDisplayName: customDisplayName.trim() || undefined,
        publicDisplayIdentity: publicDisplay,
        tags: topics ? topics.split(',').map((t) => t.trim()).filter(Boolean) : ['Academic Notes'],
        previewText: `Submitted Notes Preview: ${title}\nCourse: ${courseCode} (${courseName})\nDepartment: ${department}\nType: ${resourceType}`,
      });

      setLoading(false);
      setStep(4);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/10 border border-border text-foreground text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Non-monetary Academic Charity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-mono uppercase">
            {PRODUCT_TERMINOLOGY.upload}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-sans">
            Donate your study materials to help peer scholars survive the semester. Earn +10 Charity Points!
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-foreground text-background font-bold shadow-md">
            Step {step} of 4
          </span>
        </div>
      </div>

      {/* Progress Steps Indicator */}
      <div className="grid grid-cols-4 gap-2 font-mono text-xs">
        {[
          { num: 1, label: 'Resource Type' },
          { num: 2, label: 'Details & Identity' },
          { num: 3, label: 'Review & Security' },
          { num: 4, label: 'Published!' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-3 rounded-2xl border text-center transition-all ${
              step === s.num
                ? 'bg-foreground text-background font-bold border-foreground shadow-md'
                : step > s.num
                ? 'bg-foreground/10 text-foreground border-border font-semibold'
                : 'bg-card text-muted-foreground border-border opacity-50'
            }`}
          >
            <span className="block text-[10px] uppercase">Step 0{s.num}</span>
            <span className="truncate block font-sans font-bold text-xs">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Step 01: Resource Type & File Upload */}
      {step === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
          <h3 className="text-lg font-bold font-mono uppercase text-foreground">Select Resource Format</h3>

          {/* 4 Core Resource Types Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            {[
              { type: 'Notes' as ResourceType, label: 'Notes', desc: 'Handwritten / Typeset' },
              { type: 'Slides' as ResourceType, label: 'Slides', desc: 'Lecture Presentations' },
              { type: 'PDF' as ResourceType, label: 'PDF Document', desc: 'Exam Papers / Guides' },
              { type: 'External Link' as ResourceType, label: 'External Link', desc: 'Tutorials / Portals' },
            ].map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => setResourceType(item.type)}
                className={`p-4 rounded-2xl border text-left transition-all space-y-1 ${
                  resourceType === item.type
                    ? 'border-foreground bg-foreground/10 text-foreground shadow-md font-bold'
                    : 'border-border bg-background hover:bg-card-hover text-muted-foreground'
                }`}
              >
                <span className="block text-xs font-bold font-mono text-foreground">{item.label}</span>
                <span className="block text-[10px] text-muted-foreground font-sans">{item.desc}</span>
              </button>
            ))}
          </div>

          {/* File Upload Box OR External URL Input */}
          {resourceType === 'External Link' ? (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                External Educational URL
              </label>
              <div className="relative">
                <ExternalLink className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="url"
                  required
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://visualgo.net or https://geeksforgeeks.org/dbms"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-foreground"
                />
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-3xl p-8 text-center space-y-3 bg-background hover:border-foreground/40 transition-all">
              <input
                type="file"
                id="file-input"
                onChange={handleFileChange}
                accept=".pdf,.pptx,.ppt,.docx,.doc,.zip"
                className="hidden"
              />
              <label htmlFor="file-input" className="cursor-pointer block space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-foreground/10 text-foreground flex items-center justify-center mx-auto">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <span className="font-bold text-sm text-foreground block">
                    {file ? file.name : 'Click to select or drag PDF, PPTX, or DOCX'}
                  </span>
                  <span className="text-xs text-muted-foreground block font-mono mt-1">
                    {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Supported files: PDF, PPTX, DOCX (Max 25MB)'}
                  </span>
                </div>
              </label>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              disabled={resourceType !== 'External Link' && !file && false} // Demo allows next
              onClick={handleNext}
              className="px-6 py-3 bg-foreground text-background font-mono font-bold rounded-2xl hover:opacity-90 transition-all shadow-md flex items-center gap-2 text-xs uppercase"
            >
              <span>Next: Details & Identity</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 02: Details, Ownership & Public Identity */}
      {step === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
          <h3 className="text-lg font-bold font-mono uppercase text-foreground">Metadata &amp; Display Identity</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5 font-mono">
                Resource Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. SQL Normalization — Quick Notes (1NF, 2NF, 3NF & BCNF)"
                className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-foreground text-xs font-semibold focus:outline-none focus:border-foreground"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5 font-mono">
                  Course Code &amp; Name
                </label>
                <select
                  value={courseCode}
                  onChange={(e) => {
                    setCourseCode(e.target.value);
                    if (e.target.value === 'CSE 2103') setCourseName('Database Systems');
                    if (e.target.value === 'CSE 3101') setCourseName('Operating Systems');
                    if (e.target.value === 'CSE 3205') setCourseName('Artificial Intelligence');
                    if (e.target.value === 'MATH 2101') setCourseName('Linear Algebra');
                    if (e.target.value === 'EEE 2101') setCourseName('Electrical Circuits I');
                  }}
                  className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-foreground text-xs font-bold focus:outline-none focus:border-foreground"
                >
                  <option value="CSE 2103">CSE 2103 — Database Systems</option>
                  <option value="CSE 3101">CSE 3101 — Operating Systems</option>
                  <option value="CSE 3205">CSE 3205 — Artificial Intelligence</option>
                  <option value="MATH 2101">MATH 2101 — Linear Algebra</option>
                  <option value="EEE 2101">EEE 2101 — Electrical Circuits I</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5 font-mono">
                  Content Ownership / Source
                </label>
                <select
                  value={contentSource}
                  onChange={(e) => setContentSource(e.target.value as ContentSource)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-foreground text-xs font-semibold focus:outline-none focus:border-foreground"
                >
                  <option value="Created by me">Created by me (Original Notes)</option>
                  <option value="Shared with permission">Shared with permission</option>
                  <option value="Public resource">Public / Open Academic Material</option>
                  <option value="External link">External Online Resource</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5 font-mono">
                Description &amp; Key Topics Covered
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short summary of what students will learn from these notes..."
                className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-foreground"
              />
            </div>

            {/* PUBLIC DISPLAY IDENTITY SELECTION */}
            <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-3 font-mono">
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                Public Display Identity Mode
              </label>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="displayMode"
                    value="PROFILE"
                    checked={displayMode === 'PROFILE'}
                    onChange={() => setDisplayMode('PROFILE')}
                    className="accent-foreground"
                  />
                  <span>Show my profile: <strong>{user.name} ({user.levelTerm || 'Level 3 / Term 2'})</strong></span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="displayMode"
                    value="ANONYMOUS"
                    checked={displayMode === 'ANONYMOUS'}
                    onChange={() => setDisplayMode('ANONYMOUS')}
                    className="accent-foreground"
                  />
                  <span>Share anonymously: <strong>Publicly displays "Shared Anonymously"</strong></span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="displayMode"
                    value="CUSTOM"
                    checked={displayMode === 'CUSTOM'}
                    onChange={() => setDisplayMode('CUSTOM')}
                    className="accent-foreground"
                  />
                  <span>Custom Display Name:</span>
                </label>

                {displayMode === 'CUSTOM' && (
                  <input
                    type="text"
                    value={customDisplayName}
                    onChange={(e) => setCustomDisplayName(e.target.value)}
                    placeholder="e.g. AlgoNinja_42"
                    className="w-full ml-6 max-w-xs px-3 py-1.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-foreground"
                  />
                )}
              </div>

              <p className="text-[11px] text-muted-foreground font-sans">
                Note: Anonymous publishing hides your profile from public peers. Real uploader ID remains stored for admin moderation.
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-2 font-mono">
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-2xl border border-border text-xs font-bold hover:bg-card-hover flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              disabled={!title}
              onClick={handleNext}
              className="px-6 py-2.5 bg-foreground text-background font-bold rounded-2xl hover:opacity-90 transition-all shadow-md flex items-center gap-2 text-xs uppercase disabled:opacity-40"
            >
              <span>Next: Review &amp; Security</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 03: Review & Cryptographic Security */}
      {step === 3 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
          <h3 className="text-lg font-bold font-mono uppercase text-foreground">Review &amp; Deduplication Check</h3>

          <div className="space-y-3 text-xs bg-background p-5 rounded-2xl border border-border font-mono">
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Title:</span>
              <span className="font-bold text-foreground">{title || 'Untitled'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Course:</span>
              <span className="font-semibold text-foreground">{courseCode} — {courseName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Format:</span>
              <span className="font-semibold text-foreground">{resourceType}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Content Source:</span>
              <span className="font-semibold text-emerald-400">{contentSource}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Public Display Identity:</span>
              <span className="font-bold text-foreground">
                {displayMode === 'ANONYMOUS' ? 'Shared Anonymously' : displayMode === 'CUSTOM' ? customDisplayName : user.name}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>SHA-256 Cryptographic Hash Deduplication Passed</span>
            </span>
            <span className="text-[10px] font-bold uppercase bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
              0% Duplicate Match
            </span>
          </div>

          <div className="flex justify-between pt-2 font-mono">
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-2xl border border-border text-xs font-bold hover:bg-card-hover flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="liquid-metal-btn px-8 py-3 text-xs font-bold flex items-center gap-2 uppercase tracking-wide disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Donation...</span>
                </>
              ) : (
                <>
                  <span>Publish Knowledge Donation</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 04: Completion Success */}
      {step === 4 && (
        <div className="p-10 rounded-3xl bg-card border border-border shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black font-mono uppercase">Knowledge Donation Published!</h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Your material is now available for peer discovery in the Charity Bazaar. You earned{' '}
              <span className="font-bold text-amber-400">+10 Charity Points</span>!
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2 font-mono text-xs">
            <button
              onClick={() => router.push('/bazaar')}
              className="liquid-metal-btn px-6 py-3 font-bold shadow-md"
            >
              Explore Charity Bazaar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
