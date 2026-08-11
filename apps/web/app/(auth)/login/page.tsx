'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeartHandshake, ArrowRight, Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { signIn } from '@/lib/auth-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        setError(res.error.message || 'Invalid credentials or account issue');
        setLoading(false);
        return;
      }

      router.push('/hq');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#0b0f19] text-white relative overflow-hidden">
      <div className="w-full max-w-md bg-[#131b2e] border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-white mb-3 shadow-lg shadow-accent/30">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Welcome Back, Benefactor</h1>
          <p className="text-xs text-slate-400 mt-1">
            "Ready to perform some academic charity?"
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Authentication Error</p>
              <p className="opacity-90">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <Link href="#" className="text-xs text-accent hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            className="w-full py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Benefactor...</span>
              </>
            ) : (
              <>
                <span>Enter Charity HQ</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400">
          New to Peer's Charity?{' '}
          <Link href="/register" className="font-semibold text-accent hover:underline">
            Register as a Benefactor
          </Link>
        </div>
      </div>
    </div>
  );
}
