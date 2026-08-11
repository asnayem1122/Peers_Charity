'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeartHandshake, ArrowRight, Lock, Mail, User, GraduationCap, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { signUp } from '@/lib/auth-client';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [semester, setSemester] = useState('Level 3 / Term 1');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signUp.email({
        email,
        password,
        name,
      });

      if (res.error) {
        setError(res.error.message || 'Registration failed');
        setLoading(false);
        return;
      }

      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'Failed to complete registration');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#0b0f19] text-white relative overflow-hidden">
      <div className="w-full max-w-lg bg-[#131b2e] border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-white mb-3 shadow-lg shadow-accent/30">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Become a Benefactor</h1>
          <p className="text-xs text-slate-400 mt-1">
            "Join your peer circle and start sharing knowledge."
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Registration Warning</p>
              <p className="opacity-90">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nayem"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/40 font-medium transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              University Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nayem@student.university.edu"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/40 font-medium transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Semester / Level
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="Level 3 / Term 1"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/40 font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Student ID
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="2024-CSE-042"
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/40 font-medium transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/40 font-medium transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Benefactor Profile...</span>
              </>
            ) : (
              <>
                <span>Register & Join Charity</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already a Benefactor?{' '}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
