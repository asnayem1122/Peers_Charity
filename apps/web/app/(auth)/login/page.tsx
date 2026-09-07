'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeartHandshake, ArrowRight, Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to HQ
  if (user) {
    router.push('/hq');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Small delay to simulate network
    await new Promise((r) => setTimeout(r, 500));

    const result = login(email, password);

    if (!result.success) {
      setError(result.error || 'Invalid credentials');
      setLoading(false);
      return;
    }

    router.push('/hq');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background text-foreground relative overflow-hidden font-sans">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center font-bold mb-3 shadow-lg">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight font-mono uppercase">Welcome Back, Benefactor</h1>
          <p className="text-xs text-muted-foreground mt-1">
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
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 font-mono">
              University Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nayem@student.university.edu"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground font-medium transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5 font-mono">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <Link href="#" className="text-xs text-foreground hover:underline font-bold">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground font-medium transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="liquid-metal-btn w-full py-3.5 text-sm font-bold font-mono flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-50"
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

        {/* Quick Demo Access Bar */}
        <div className="mt-6 pt-6 border-t border-border/70 text-center font-mono text-xs space-y-2.5">
          <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
            ⚡ Instant Demo Login
          </p>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => {
                login('student@demo.com', 'DemoPassword123!');
                router.push('/hq');
              }}
              className="px-2 py-2 rounded-xl border border-border bg-background hover:bg-card-hover text-foreground font-medium transition-all truncate"
              title="Tanvir Hasan (Student)"
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => {
                login('top.contributor@demo.com', 'DemoPassword123!');
                router.push('/hq');
              }}
              className="px-2 py-2 rounded-xl border border-border bg-background hover:bg-card-hover text-foreground font-medium transition-all truncate"
              title="Sarah Ahmed (Top Contributor)"
            >
              ⭐ Top Peer
            </button>
            <button
              type="button"
              onClick={() => {
                login('admin@demo.com', 'DemoPassword123!');
                router.push('/hq');
              }}
              className="px-2 py-2 rounded-xl border border-border bg-background hover:bg-card-hover text-foreground font-medium transition-all truncate"
              title="System Admin"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          New to Peer's Charity?{' '}
          <Link href="/register" className="font-bold text-foreground hover:underline">
            Register as a Benefactor
          </Link>
        </div>
      </div>
    </div>
  );
}
