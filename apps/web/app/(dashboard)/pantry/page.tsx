'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Search, PlusCircle, ArrowRight, ShieldCheck, FileText, Flame } from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';
import { getResources, Resource } from '@/lib/resources-data';

export default function AcademicPantryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    setResources(getResources());
  }, []);

  // Derive unique courses dynamically from user uploaded resources
  const uniqueCourseCodes = Array.from(new Set(resources.map((r) => r.courseCode.toUpperCase())));

  const courses = uniqueCourseCodes.map((code) => {
    const courseRes = resources.filter((r) => r.courseCode.toUpperCase() === code);
    const sample = courseRes[0];
    const downloads = courseRes.reduce((sum, r) => sum + (r.downloadsCount || 0), 0);
    const health = Math.min(100, Math.round((courseRes.length / 5) * 100));
    return {
      id: code.toLowerCase().replace(/\s+/g, '-'),
      code: code,
      name: sample?.courseName || `${code} Course Pantry`,
      dept: sample?.department || 'Academic Department',
      instructor: 'Department Faculty',
      tags: Array.from(new Set(courseRes.flatMap((r) => r.tags))).slice(0, 4),
      health,
      donationsCount: courseRes.length,
      downloadsCount: downloads,
    };
  });

  const filtered = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2 font-mono uppercase">
            <BookOpen className="w-7 h-7 text-foreground" />
            <span>{PRODUCT_TERMINOLOGY.courseLibrary}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-sans">
            Structured course library with Pantry Health coverage metrics and verified resources.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {courses.length > 0 && (
            <div className="relative w-full sm:w-64 font-mono">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search course code or name..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-foreground font-medium"
              />
            </div>
          )}

          <Link
            href="/donate"
            className="liquid-metal-btn px-4 py-2 text-xs font-bold font-mono flex items-center gap-1.5 shadow-md shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Knowledge</span>
          </Link>
        </div>
      </div>

      {/* Course Pantry Content: Empty State vs Course Cards */}
      {courses.length === 0 ? (
        <div className="p-12 rounded-3xl bg-card border border-border shadow-sm text-center space-y-4 font-mono">
          <div className="w-16 h-16 rounded-2xl bg-foreground/10 text-foreground flex items-center justify-center mx-auto shadow-inner">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground uppercase">Academic Pantry is Empty</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto font-sans">
              No courses or study materials have been donated yet. Be the first benefactor to donate notes and establish a course pantry!
            </p>
          </div>
          <Link
            href="/donate"
            className="liquid-metal-btn inline-flex items-center gap-2 px-6 py-3 text-xs font-bold shadow-lg uppercase tracking-wider"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate First Course Note</span>
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-card border border-border shadow-sm text-center space-y-4 font-mono">
          <div className="w-16 h-16 rounded-2xl bg-foreground/10 text-muted-foreground flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground uppercase">No Courses Match Your Search</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto font-sans">
              No course pantry matches "{searchQuery}".
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <Link
              key={course.id}
              href={`/pantry/${course.id}`}
              className="p-6 rounded-3xl bg-card border border-border shadow-lg space-y-4 hover:border-foreground/40 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 font-mono">
                  <span className="px-3 py-1 rounded-xl bg-foreground text-background font-black text-xs">
                    {course.code}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      course.health > 0
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-foreground/5 text-muted-foreground border-border'
                    }`}
                  >
                    {course.health > 0 ? `${course.health}% Health` : 'Awaiting Notes'}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-foreground leading-snug group-hover:text-muted-foreground transition-colors font-mono mb-1">
                  {course.name}
                </h2>

                <p className="text-xs text-muted-foreground mb-4">
                  {course.instructor} • {course.dept}
                </p>

                {course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4 font-mono text-[10px]">
                    {course.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between font-mono text-xs text-muted-foreground">
                <span>
                  {course.donationsCount > 0
                    ? `${course.donationsCount} Notes • ${course.downloadsCount} DLs`
                    : '0 Notes • Ready for Donations'}
                </span>
                <div className="flex items-center gap-1 font-bold text-foreground group-hover:translate-x-1 transition-transform">
                  <span>Open Pantry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
