'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Compass, PlusCircle, Flame, User } from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';

const items = [
  { href: '/hq', label: 'HQ', icon: LayoutDashboard },
  { href: '/bazaar', label: 'Bazaar', icon: Compass },
  { href: '/donate', label: 'Donate', icon: PlusCircle, isMain: true },
  { href: '/exam', label: 'Exam', icon: Flame },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-t border-border/80 flex items-center justify-around z-40 px-2">
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        if (item.isMain) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center -mt-5"
            >
              <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/40 border-4 border-background">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-semibold text-accent mt-0.5">{item.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              isActive ? 'text-accent font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
