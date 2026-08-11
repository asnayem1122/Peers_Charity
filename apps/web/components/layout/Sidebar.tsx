'use client';

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

const navItems = [
  { href: '/hq', label: PRODUCT_TERMINOLOGY.dashboard, icon: LayoutDashboard },
  { href: '/bazaar', label: PRODUCT_TERMINOLOGY.discovery, icon: Compass },
  { href: '/pantry', label: PRODUCT_TERMINOLOGY.courseLibrary, icon: BookOpen },
  { href: '/donate', label: PRODUCT_TERMINOLOGY.upload, icon: PlusCircle, highlight: true },
  { href: '/exam', label: PRODUCT_TERMINOLOGY.examPrep, icon: Flame },
  { href: '/treasure', label: PRODUCT_TERMINOLOGY.bookmarks, icon: Bookmark },
  { href: '/leaderboard', label: PRODUCT_TERMINOLOGY.leaderboard, icon: Award },
  { href: '/profile', label: PRODUCT_TERMINOLOGY.profile, icon: User },
  { href: '/admin', label: PRODUCT_TERMINOLOGY.admin, icon: ShieldAlert },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border/80 bg-card/60 backdrop-blur-xl flex flex-col h-screen sticky top-0 hidden md:flex shrink-0">
      {/* Brand Header - Clicking navigates to Home Page (/) */}
      <Link
        href="/"
        className="p-6 border-b border-border/60 flex items-center gap-3 hover:bg-card-hover/80 transition-all group cursor-pointer"
        title="Go to Home Landing Page"
      >
        <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white shadow-md shadow-accent/20 group-hover:scale-105 transition-transform">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-base tracking-tight text-foreground group-hover:text-accent transition-colors">
            PEER'S CHARITY
          </span>
          <span className="block text-[10px] text-accent font-semibold tracking-wider uppercase">
            Academic SaaS
          </span>
        </div>
      </Link>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-accent text-accent-foreground font-semibold shadow-md shadow-accent/20'
                  : item.highlight
                  ? 'bg-accent/10 text-accent hover:bg-accent/20 font-semibold'
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
      <div className="p-4 border-t border-border/60 text-[11px] text-muted-foreground text-center">
        <p className="italic">"We perform academic charity."</p>
      </div>
    </aside>
  );
}
