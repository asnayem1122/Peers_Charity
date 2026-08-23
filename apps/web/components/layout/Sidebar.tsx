'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  PlusCircle,
  Bookmark,
  Flame,
  Award,
  ShieldAlert,
  User,
  HeartHandshake,
} from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showAdmin = mounted && !isLoading && user?.role === 'ADMIN';

  const navItems = [
    { href: '/hq', label: PRODUCT_TERMINOLOGY.dashboard, icon: LayoutDashboard },
    { href: '/bazaar', label: PRODUCT_TERMINOLOGY.discovery, icon: Compass },
    { href: '/pantry', label: PRODUCT_TERMINOLOGY.courseLibrary, icon: BookOpen },
    { href: '/donate', label: PRODUCT_TERMINOLOGY.upload, icon: PlusCircle, highlight: true },
    { href: '/exam', label: PRODUCT_TERMINOLOGY.examPrep, icon: Flame },
    { href: '/treasure', label: PRODUCT_TERMINOLOGY.bookmarks, icon: Bookmark },
    { href: '/leaderboard', label: PRODUCT_TERMINOLOGY.leaderboard, icon: Award },
    { href: '/profile', label: PRODUCT_TERMINOLOGY.profile, icon: User },
    ...(showAdmin ? [{ href: '/admin', label: PRODUCT_TERMINOLOGY.admin, icon: ShieldAlert }] : []),
  ];

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0 hidden md:flex shrink-0 shadow-sm z-30">
      {/* Brand Header - Clicking navigates to Home Page (/) */}
      <Link
        href="/"
        className="p-6 border-b border-border flex items-center gap-3 hover:bg-card-hover transition-all group cursor-pointer"
        title="Go to Home Landing Page"
      >
        <div className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform shrink-0">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div>
          <span className="font-mono font-black text-base tracking-tighter text-foreground group-hover:text-muted-foreground transition-colors uppercase">
            PEER'S CHARITY
          </span>
          <span className="block text-[10px] text-muted-foreground font-mono font-semibold tracking-widest uppercase">
            Academic SaaS
          </span>
        </div>
      </Link>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto font-sans">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-foreground text-background font-bold shadow-md'
                  : item.highlight
                  ? 'bg-foreground/10 text-foreground hover:bg-foreground/20 font-bold'
                  : 'text-muted-foreground hover:bg-card-hover hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Quote */}
      <div className="p-4 border-t border-border text-[11px] text-muted-foreground text-center font-mono">
        <p className="italic">"We perform academic charity."</p>
      </div>
    </aside>
  );
}
