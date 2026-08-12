'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Compass, PlusCircle, Flame, User, LogIn } from 'lucide-react';
import { PRODUCT_TERMINOLOGY } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const items = [
    { href: '/hq', label: 'HQ', icon: LayoutDashboard },
    { href: '/bazaar', label: 'Bazaar', icon: Compass },
    { href: user ? '/donate' : '/login', label: 'Donate', icon: PlusCircle, isMain: true },
    { href: '/exam', label: 'Exam', icon: Flame },
    {
      href: user ? '/profile' : '/login',
      label: user ? 'Profile' : 'Sign In',
      icon: user ? User : LogIn,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/90 backdrop-blur-2xl border-t border-border flex items-center justify-around z-40 px-2 font-mono">
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
              <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg border-4 border-background font-bold">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-foreground mt-0.5">{item.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              isActive ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
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
