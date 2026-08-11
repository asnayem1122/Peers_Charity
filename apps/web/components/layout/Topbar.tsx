'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Moon, Sun, PlusCircle, Command, Sparkles, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem('peers-charity-theme');
    const prefersDark = savedTheme ? savedTheme === 'dark' : true;
    setIsDark(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('peers-charity-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('peers-charity-theme', 'light');
    }
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    router.push('/');
  };

  // Get user initials for avatar fallback
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <>
      <header className="h-16 border-b border-border/80 bg-card/40 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
        {/* Global Search Bar (Cmd+K trigger) */}
        <div className="flex-1 max-w-md">
          <button
            onClick={() => setIsCmdOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-background/60 border border-border/80 text-xs text-muted-foreground hover:border-accent/50 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
              <span>Search your academic treasure...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-muted border border-border text-[10px] font-mono text-muted-foreground">
              <Command className="w-3 h-3" /> K
            </kbd>
          </button>
        </div>

        {/* Topbar Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/donate"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/30 text-accent text-xs font-semibold hover:bg-accent/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Knowledge</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-border/80 bg-background/50 hover:bg-card-hover text-muted-foreground hover:text-foreground transition-all"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            className="p-2 rounded-xl border border-border/80 bg-background/50 hover:bg-card-hover text-muted-foreground hover:text-foreground transition-all relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-accent absolute top-1.5 right-1.5 animate-pulse" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-card-hover transition-all"
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-accent/30"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {initials}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-semibold leading-tight">{user?.name || 'Guest'}</span>
                <span className="block text-[10px] text-muted-foreground leading-tight capitalize">{user?.role?.toLowerCase() || ''}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-card border border-border shadow-2xl z-50 overflow-hidden">
                {/* User Info Header */}
                <div className="p-4 border-b border-border/60 flex items-center gap-3">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-accent/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold">
                      {initials}
                    </div>
                  )}
                  <div>
                    <span className="block text-sm font-bold">{user?.name}</span>
                    <span className="block text-[11px] text-muted-foreground truncate max-w-[140px]">{user?.email}</span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-1.5">
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card-hover transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span>My Charity Card</span>
                  </Link>
                  <Link
                    href="/treasure"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card-hover transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    <span>My Treasure</span>
                  </Link>
                </div>

                {/* Logout */}
                <div className="p-1.5 border-t border-border/60">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      {isCmdOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-sm text-foreground font-semibold">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Command Palette</span>
              </div>
              <button
                onClick={() => setIsCmdOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Esc
              </button>
            </div>
            <input
              type="text"
              autoFocus
              placeholder="Type a command or course name..."
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <div className="space-y-1 text-xs text-muted-foreground max-h-60 overflow-y-auto">
              <Link
                href="/bazaar"
                onClick={() => setIsCmdOpen(false)}
                className="block p-2 rounded-lg hover:bg-card-hover hover:text-foreground"
              >
                🔍 Search Resources in Charity Bazaar
              </Link>
              <Link
                href="/donate"
                onClick={() => setIsCmdOpen(false)}
                className="block p-2 rounded-lg hover:bg-card-hover hover:text-foreground"
              >
                ➕ Donate Knowledge (Upload Notes)
              </Link>
              <Link
                href="/exam"
                onClick={() => setIsCmdOpen(false)}
                className="block p-2 rounded-lg hover:bg-card-hover hover:text-foreground"
              >
                🔥 Open Exam Emergency Room
              </Link>
              <Link
                href="/treasure"
                onClick={() => setIsCmdOpen(false)}
                className="block p-2 rounded-lg hover:bg-card-hover hover:text-foreground"
              >
                💎 Open My Treasure Chest
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
