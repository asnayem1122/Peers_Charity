'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Moon,
  Sun,
  PlusCircle,
  Command,
  Sparkles,
  LogOut,
  User,
  Settings,
  ChevronDown,
  CheckCheck,
  Trophy,
  ShieldCheck,
  FileText,
  X,
  LogIn,
  HeartHandshake,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { resetAllUserData } from '@/lib/resources-data';

export default function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Notifications dynamically bound to active user and level/term events
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
    } else {
      const levelTermLabel = user.levelTerm || 'Level 3 / Term 2';
      setNotifications([
        {
          id: 1,
          title: `Donation Appreciated! 🌟`,
          message: `3 classmates from ${levelTermLabel} found your notes helpful.`,
          time: '10m ago',
          read: false,
          icon: FileText,
          color: 'text-foreground bg-foreground/10 border-border',
        },
        {
          id: 2,
          title: `Level & Term Update 📚`,
          message: `New CSE 2103 notes uploaded for ${levelTermLabel} Pantry.`,
          time: '45m ago',
          read: false,
          icon: ShieldCheck,
          color: 'text-foreground bg-foreground/10 border-border',
        },
        {
          id: 3,
          title: `Badge Unlocked! 🏆`,
          message: `You earned the "First Benefactor" achievement (+10 pts).`,
          time: '2h ago',
          read: false,
          icon: Trophy,
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        },
      ]);
      setUnreadCount(3);
    }
  }, [user]);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
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

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleClearNotif = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <>
      <header className="h-16 border-b border-border bg-card/90 backdrop-blur-2xl px-3 sm:px-8 flex items-center justify-between sticky top-0 z-40 gap-2">
        {/* Mobile Brand Logo (Visible only on mobile devices where sidebar is hidden) */}
        <Link href="/" className="md:hidden flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-foreground text-background flex items-center justify-center font-bold shadow-md">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <span className="font-mono font-black text-xs tracking-tighter text-foreground uppercase hidden sm:inline">
            PEER'S
          </span>
        </Link>

        {/* Global Search Bar (Cmd+K trigger) */}
        <div className="flex-1 max-w-md min-w-0">
          <button
            onClick={() => setIsCmdOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 sm:py-2 rounded-xl bg-background border border-border text-xs text-muted-foreground hover:border-foreground/50 transition-all group font-mono"
          >
            <div className="flex items-center gap-2 min-w-0 truncate">
              <Search className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              <span className="truncate">Search notes...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-muted border border-border text-[10px] font-mono text-muted-foreground">
              <Command className="w-3 h-3" /> K
            </kbd>
          </button>
        </div>

        {/* Topbar Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href={user ? '/donate' : '/login'}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-all shadow-md font-mono"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Knowledge</span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-border bg-background hover:bg-card-hover text-muted-foreground hover:text-foreground transition-all"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-foreground" />}
          </button>

          {/* Reset Demo State Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset website state to fresh clean installation?')) {
                resetAllUserData();
                window.location.reload();
              }
            }}
            className="p-2 rounded-xl border border-border bg-background hover:bg-card-hover text-muted-foreground hover:text-foreground transition-all"
            title="Reset Website State to Fresh Installation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl border border-border bg-background hover:bg-card-hover text-muted-foreground hover:text-foreground transition-all relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-foreground text-background absolute -top-1 -right-1 text-[9px] font-extrabold flex items-center justify-center shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {isNotifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl glass-panel shadow-2xl z-50 overflow-hidden text-left font-sans">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono">
                    <Bell className="w-4 h-4 text-foreground" />
                    <span className="font-bold text-sm uppercase">Charity Bells</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-foreground/10 text-foreground border border-border">
                        {unreadCount} New
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-bold text-foreground hover:underline flex items-center gap-1 font-mono"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-border/40 p-1">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted-foreground font-mono">
                      No new notifications.
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const IconComponent = notif.icon;
                      return (
                        <div
                          key={notif.id}
                          className={`p-3.5 rounded-xl transition-all flex items-start gap-3 relative group ${
                            notif.read ? 'opacity-70 bg-transparent' : 'bg-foreground/5'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${notif.color}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="font-bold text-xs truncate font-mono">{notif.title}</span>
                              <span className="text-[9px] text-muted-foreground shrink-0 font-mono">{notif.time}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-snug">{notif.message}</p>
                          </div>

                          <button
                            onClick={() => handleClearNotif(notif.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2 p-1 text-muted-foreground hover:text-foreground"
                            title="Dismiss notification"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-2.5 border-t border-border bg-muted/30 text-center font-mono">
                  <Link
                    href="/hq"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-xs font-bold text-foreground hover:underline block"
                  >
                    View All Academic Activity
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Profile / Sign In Dropdown */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-1.5 pr-1 py-1 rounded-xl hover:bg-card-hover transition-all"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-foreground text-background flex items-center justify-center text-xs font-bold font-mono shadow-md">
                    {initials}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <span className="block text-xs font-bold leading-tight font-mono">{user.name}</span>
                  <span className="block text-[10px] text-muted-foreground leading-tight uppercase font-mono">{user.role}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl glass-panel shadow-2xl z-50 overflow-hidden font-sans">
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center text-sm font-bold font-mono">
                        {initials}
                      </div>
                    )}
                    <div>
                      <span className="block text-sm font-bold">{user.name}</span>
                      <span className="block text-[11px] text-muted-foreground truncate max-w-[140px]">{user.email}</span>
                    </div>
                  </div>

                  <div className="p-1.5 space-y-1 font-mono">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-card-hover transition-all"
                    >
                      <User className="w-4 h-4" />
                      <span>My Charity Card</span>
                    </Link>
                    <Link
                      href="/treasure"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-card-hover transition-all"
                    >
                      <Settings className="w-4 h-4" />
                      <span>My Treasure</span>
                    </Link>
                  </div>

                  <div className="p-1.5 border-t border-border">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all font-mono"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="liquid-metal-btn px-4 py-2 text-xs font-bold font-mono flex items-center gap-1.5 shadow-md"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </header>

      {/* Command Palette Modal */}
      {isCmdOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-sm text-foreground font-bold font-mono">
                <Sparkles className="w-4 h-4 text-foreground" />
                <span>Command Palette</span>
              </div>
              <button
                onClick={() => setIsCmdOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground font-mono"
              >
                Esc
              </button>
            </div>
            <input
              type="text"
              autoFocus
              placeholder="Type a command or course name..."
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-foreground"
            />
            <div className="space-y-1 text-xs text-muted-foreground max-h-60 overflow-y-auto font-mono">
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
