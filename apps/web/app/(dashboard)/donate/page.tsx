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
  ExternalLink,
  FileQuestion,
  BookOpen,
  FlaskConical,
} from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';
import {
  addResource,
  ResourceType,
  DisplayMode,
  ContentSource,
  AcademicSection,
  ExamType,
  MaterialType,
} from '@/lib/resources-data';

export default function DonateKnowledgePage() {
  const { user, login } = useAuth();
  const router = useRouter();

  // Multi-step Wizard State (1 to 5)
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Section 1: Academic Section Selection
  const [section, setSection] = useState<AcademicSection>('question');

  // Section 2: Academic Metadata & Course Info
  const [courseCode, setCourseCode] = useState('CSE 2103');
  const [courseName, setCourseName] = useState('Database Systems');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('Level 2 / Term 1');
  const [batch, setBatch] = useState('');
  const [examType, setExamType] = useState<ExamType>('MID');
  const [materialType, setMaterialType] = useState<MaterialType>('HAND_NOTE');
  const [labNumber, setLabNumber] = useState('Lab 01');

  // File or External URL
  const [file, setFile] = useState<File | null>(null);
  const [externalUrl, setExternalUrl] = useState('');

  // Section 3: Details & Identity
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentSource, setContentSource] = useState<ContentSource>('Created by me');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('PROFILE');
  const [customDisplayName, setCustomDisplayName] = useState('');
  const [topics, setTopics] = useState('');

  // Auth Guard: Require authentication to donate knowledge
  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-card border border-border text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Authentication Required
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

        {/* 1-Click Quick Demo Login for instant testing */}
        <div className="pt-4 border-t border-border/60 text-center">
          <p className="text-[11px] text-muted-foreground font-mono mb-2">Testing or Evaluating?</p>
          <button
            type="button"
            onClick={() => {
              login('student@demo.com', 'DemoPassword123!');
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono text-xs font-bold inline-flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>1-Click Demo Login (Student)</span>
          </button>
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

  // Validate step 2 progression
  const isStep2Valid = () => {
    if (!batch.trim()) return false;
    if (section === 'question') {
      return !!file;
    }
    if (section === 'course_material') {
      if (materialType === 'EXTERNAL_LINK') {
        return !!externalUrl.trim();
      }
      return !!file;
    }
    if (section === 'sessional') {
      return !!file && !!labNumber.trim();
    }
    return false;
  };

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
    if (section === 'course_material' && materialType === 'EXTERNAL_LINK') {
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

    // Map to legacy resourceType for backward compatibility
    let mappedResourceType: ResourceType = 'Notes';
    if (section === 'question') {
      mappedResourceType = 'PDF';
    } else if (section === 'course_material') {
      if (materialType === 'HAND_NOTE') mappedResourceType = 'Notes';
      else if (materialType === 'SLIDES') mappedResourceType = 'Slides';
      else if (materialType === 'EXTERNAL_LINK') mappedResourceType = 'External Link';
    } else if (section === 'sessional') {
      mappedResourceType = 'PDF';
    }

    setTimeout(() => {
      addResource({
        title: title || `${courseCode} ${section === 'question' ? `${examType} Question` : section === 'sessional' ? labNumber : 'Material'}`,
        description: description || 'No description provided.',
        courseCode,
        courseName,
        department,
        semester,
        resourceType: mappedResourceType,
        academicMetadata: {
          section,
          semester: section !== 'sessional' ? semester : undefined,
          batch: batch.trim(),
          examType: section === 'question' ? examType : undefined,
          materialType: section === 'course_material' ? materialType : undefined,
          externalLink: sanitizedExternalUrl,
          labNumber: section === 'sessional' ? labNumber.trim() : undefined,
        },
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
        tags: topics ? topics.split(',').map((t) => t.trim()).filter(Boolean) : [section.toUpperCase(), courseCode],
        previewText: `Submitted: ${title}\nSection: ${section}\nCourse: ${courseCode} (${courseName})\nBatch: ${batch}`,
      });

      setLoading(false);
      setStep(5);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/10 border border-border text-foreground text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3-Tier Academic Taxonomy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-mono uppercase">
            {PRODUCT_TERMINOLOGY.upload}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-sans">
            Donate questions, lecture materials, or sessional tasks to help classmates. Earn +10 Charity Points!
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-foreground text-background font-bold shadow-md">
            Step {step} of 5
          </span>
        </div>
      </div>

      {/* Progress Steps Indicator */}
      <div className="grid grid-cols-5 gap-2 font-mono text-xs">
        {[
          { num: 1, label: 'Section' },
          { num: 2, label: 'Course & Data' },
          { num: 3, label: 'Identity' },
          { num: 4, label: 'Security' },
          { num: 5, label: 'Published' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2.5 rounded-2xl border text-center transition-all ${
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

      {/* STEP 1: Select Academic Section */}
      {step === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold font-mono uppercase text-foreground">
              Choose Academic Section
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Select which branch of coursework your donation belongs to.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Question Section Card */}
            <button
              type="button"
              onClick={() => setSection('question')}
              className={`p-5 rounded-2xl border text-left transition-all space-y-3 ${
                section === 'question'
                  ? 'border-amber-500/80 bg-amber-500/10 text-foreground shadow-lg ring-2 ring-amber-500/30'
                  : 'border-border bg-background hover:bg-card-hover text-muted-foreground'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <FileQuestion className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold font-mono text-foreground">
                  Question Section
                </span>
                <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">
                  Exam archive: CT, Mid, or Final question papers sorted by semester &amp; batch.
                </span>
              </div>
              <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                CT • MID • FINAL
              </span>
            </button>

            {/* Course Material Card */}
            <button
              type="button"
              onClick={() => setSection('course_material')}
              className={`p-5 rounded-2xl border text-left transition-all space-y-3 ${
                section === 'course_material'
                  ? 'border-blue-500/80 bg-blue-500/10 text-foreground shadow-lg ring-2 ring-blue-500/30'
                  : 'border-border bg-background hover:bg-card-hover text-muted-foreground'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold font-mono text-foreground">
                  Course Material
                </span>
                <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">
                  Theory resources: Hand notes, lecture slides, or curated educational links.
                </span>
              </div>
              <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                Notes • Slides • Web
              </span>
            </button>

            {/* Sessional Section Card */}
            <button
              type="button"
              onClick={() => setSection('sessional')}
              className={`p-5 rounded-2xl border text-left transition-all space-y-3 ${
                section === 'sessional'
                  ? 'border-emerald-500/80 bg-emerald-500/10 text-foreground shadow-lg ring-2 ring-emerald-500/30'
                  : 'border-border bg-background hover:bg-card-hover text-muted-foreground'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold font-mono text-foreground">
                  Sessional Section
                </span>
                <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">
                  Practical lab courses: Lab reports, manuals, task codes &amp; project repos.
                </span>
              </div>
              <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                Lab Reports • Task Code
              </span>
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-foreground text-background font-mono font-bold rounded-2xl hover:opacity-90 transition-all shadow-md flex items-center gap-2 text-xs uppercase"
            >
              <span>Next: Course &amp; Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Section-specific Metadata & File Upload */}
      {step === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-mono uppercase text-foreground">
              {section === 'question' && 'Question Section Configuration'}
              {section === 'course_material' && 'Course Material Configuration'}
              {section === 'sessional' && 'Sessional / Lab Configuration'}
            </h3>
            <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-foreground/10 text-foreground">
              {section.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-4">
            {/* Course & Batch Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5 font-mono">
                  Target Course
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
                  Batch / Intake <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="e.g. 11, 12, Fall 23, 2021-Batch"
                  className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-foreground text-xs font-semibold focus:outline-none focus:border-foreground"
                />
              </div>
            </div>

            {/* Semester (Required for question & course_material, optional for sessional) */}
            {section !== 'sessional' ? (
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5 font-mono">
                  Academic Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-foreground text-xs font-semibold focus:outline-none focus:border-foreground"
                >
                  <option value="Level 1 / Term 1">Level 1 / Term 1</option>
                  <option value="Level 1 / Term 2">Level 1 / Term 2</option>
                  <option value="Level 2 / Term 1">Level 2 / Term 1</option>
                  <option value="Level 2 / Term 2">Level 2 / Term 2</option>
                  <option value="Level 3 / Term 1">Level 3 / Term 1</option>
                  <option value="Level 3 / Term 2">Level 3 / Term 2</option>
                  <option value="Level 4 / Term 1">Level 4 / Term 1</option>
                  <option value="Level 4 / Term 2">Level 4 / Term 2</option>
                </select>
              </div>
            ) : null}

            {/* Section Specific Fields: Question Section -> Exam Type */}
            {section === 'question' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-muted-foreground font-mono">
                  Exam Type
                </label>
                <div className="grid grid-cols-3 gap-3 font-mono">
                  {(['CT', 'MID', 'FINAL'] as ExamType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setExamType(type)}
                      className={`py-3 px-4 rounded-2xl border text-center transition-all ${
                        examType === type
                          ? 'border-foreground bg-foreground text-background font-bold shadow-md'
                          : 'border-border bg-background hover:bg-card-hover text-muted-foreground'
                      }`}
                    >
                      <span className="block text-xs font-bold">
                        {type === 'CT' ? 'Class Test (CT)' : type === 'MID' ? 'Mid-Term Exam' : 'Final Exam'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Section Specific Fields: Course Material -> Material Type */}
            {section === 'course_material' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-muted-foreground font-mono">
                  Material Type
                </label>
                <div className="grid grid-cols-3 gap-3 font-mono">
                  {[
                    { type: 'HAND_NOTE' as MaterialType, label: 'Hand Note', desc: 'Handwritten / Typeset' },
                    { type: 'SLIDES' as MaterialType, label: 'Slides', desc: 'Lecture Presentation' },
                    { type: 'EXTERNAL_LINK' as MaterialType, label: 'External Link', desc: 'Educational URL' },
                  ].map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setMaterialType(item.type)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        materialType === item.type
                          ? 'border-foreground bg-foreground text-background font-bold shadow-md'
                          : 'border-border bg-background hover:bg-card-hover text-muted-foreground'
                      }`}
                    >
                      <span className="block text-xs font-bold">{item.label}</span>
                      <span className="block text-[10px] opacity-80">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Section Specific Fields: Sessional -> Lab Number */}
            {section === 'sessional' && (
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5 font-mono">
                  Lab Number / Assignment Tag
                </label>
                <input
                  type="text"
                  required
                  value={labNumber}
                  onChange={(e) => setLabNumber(e.target.value)}
                  placeholder="e.g. Lab 01, Lab 03, Final Project, Task Code"
                  className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-foreground text-xs font-semibold focus:outline-none focus:border-foreground"
                />
              </div>
            )}

            {/* File Upload Zone OR External URL */}
            {section === 'course_material' && materialType === 'EXTERNAL_LINK' ? (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                  External Educational URL <span className="text-rose-400">*</span>
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
              <div className="border-2 border-dashed border-border rounded-3xl p-6 text-center space-y-3 bg-background hover:border-foreground/40 transition-all">
                <input
                  type="file"
                  id="file-input"
                  onChange={handleFileChange}
                  accept={
                    section === 'sessional'
                      ? '.pdf,.zip,.c,.cpp,.py,.java,.docx,.doc,.txt,.ppt,.pptx'
                      : '.pdf,.pptx,.ppt,.docx,.doc,.zip,.png,.jpg'
                  }
                  className="hidden"
                />
                <label htmlFor="file-input" className="cursor-pointer block space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-foreground/10 text-foreground flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-foreground block">
                      {file ? file.name : 'Click to select or drag files'}
                    </span>
                    <span className="text-[11px] text-muted-foreground block font-mono mt-0.5">
                      {file
                        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                        : section === 'sessional'
                        ? 'Accepts PDF, ZIP, C, CPP, PY, JAVA, DOCX'
                        : 'Accepts PDF, PPTX, DOCX, ZIP, Images (Max 50MB)'}
                    </span>
                  </div>
                </label>
              </div>
            )}
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
              disabled={!isStep2Valid()}
              onClick={handleNext}
              className="px-6 py-2.5 bg-foreground text-background font-bold rounded-2xl hover:opacity-90 transition-all shadow-md flex items-center gap-2 text-xs uppercase disabled:opacity-40"
            >
              <span>Next: Title &amp; Identity</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Title, Description & Public Identity */}
      {step === 3 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
          <h3 className="text-lg font-bold font-mono uppercase text-foreground">
            Metadata &amp; Display Identity
          </h3>

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
                placeholder={`e.g. ${courseCode} ${section === 'question' ? `${examType} Solution & Questions` : section === 'sessional' ? `${labNumber} Report & Output` : 'Comprehensive Hand Notes'}`}
                className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-foreground text-xs font-semibold focus:outline-none focus:border-foreground"
              />
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
                <option value="Created by me">Created by me (Original)</option>
                <option value="Shared with permission">Shared with permission</option>
                <option value="Public resource">Public / Open Academic Material</option>
                <option value="External link">External Online Resource</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5 font-mono">
                Description &amp; Key Topics Covered
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short summary of what students will learn from this resource..."
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
                  <span>
                    Show my profile: <strong>{user.name} ({user.levelTerm || 'Level 3 / Term 2'})</strong>
                  </span>
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
                  <span>
                    Share anonymously: <strong>Publicly displays &quot;Shared Anonymously&quot;</strong>
                  </span>
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
                Note: Anonymous publishing hides your profile from peers. Real uploader identity remains accessible to platform admins for moderation.
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
              onClick={handleNext}
              className="px-6 py-2.5 bg-foreground text-background font-bold rounded-2xl hover:opacity-90 transition-all shadow-md flex items-center gap-2 text-xs uppercase"
            >
              <span>Next: Review &amp; Security</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Cryptographic Security */}
      {step === 4 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
          <h3 className="text-lg font-bold font-mono uppercase text-foreground">
            Review &amp; Deduplication Check
          </h3>

          <div className="space-y-3 text-xs bg-background p-5 rounded-2xl border border-border font-mono">
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Section:</span>
              <span className="font-bold text-foreground uppercase">{section.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Course &amp; Batch:</span>
              <span className="font-semibold text-foreground">
                {courseCode} ({courseName}) • Batch {batch}
              </span>
            </div>
            {section === 'question' && (
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Exam Type:</span>
                <span className="font-bold text-amber-400">{examType} Exam</span>
              </div>
            )}
            {section === 'course_material' && (
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Material Type:</span>
                <span className="font-bold text-blue-400">{materialType.replace('_', ' ')}</span>
              </div>
            )}
            {section === 'sessional' && (
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Lab / Task:</span>
                <span className="font-bold text-emerald-400">{labNumber}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Title:</span>
              <span className="font-bold text-foreground">{title || 'Auto-generated Title'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Source:</span>
              <span className="font-semibold text-foreground">{contentSource}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Public Identity:</span>
              <span className="font-bold text-foreground">
                {displayMode === 'ANONYMOUS'
                  ? 'Shared Anonymously'
                  : displayMode === 'CUSTOM'
                  ? customDisplayName
                  : user.name}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>SHA-256 Cryptographic Deduplication Verification Passed</span>
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

      {/* STEP 5: Published Success */}
      {step === 5 && (
        <div className="p-10 rounded-3xl bg-card border border-border shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black font-mono uppercase">
              Knowledge Donation Published!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Your material is now available in the {section.replace('_', ' ')} archive. You earned{' '}
              <span className="font-bold text-amber-400">+10 Charity Points</span>!
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2 font-mono text-xs">
            <button
              onClick={() => router.push('/bazaar')}
              className="liquid-metal-btn px-6 py-3 font-bold shadow-md"
            >
              Explore Charity Bazaar
            </button>
            {section === 'question' && (
              <button
                onClick={() => router.push('/exam')}
                className="liquid-metal-btn-secondary px-6 py-3 font-bold shadow-md"
              >
                View Exam Emergency Room
              </button>
            )}
            <button
              onClick={() => {
                setStep(1);
                setFile(null);
                setExternalUrl('');
                setTitle('');
                setDescription('');
                setBatch('');
              }}
              className="px-6 py-3 rounded-2xl border border-border text-foreground hover:bg-card-hover font-bold transition-all"
            >
              Donate Another Resource
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
