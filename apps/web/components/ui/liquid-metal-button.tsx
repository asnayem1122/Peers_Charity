'use client';

import React from 'react';
import Link from 'next/link';

interface LiquidMetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'icon';
  className?: string;
}

export default function LiquidMetalButton({
  children,
  href,
  variant = 'primary',
  className = '',
  ...props
}: LiquidMetalButtonProps) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-bold font-mono transition-all duration-300 rounded-full cursor-pointer select-none active:scale-95';

  const variants = {
    primary: 'liquid-metal-btn px-6 py-3 text-xs sm:text-sm tracking-wide uppercase shadow-xl',
    secondary: 'liquid-metal-btn-secondary px-6 py-3 text-xs sm:text-sm tracking-wide uppercase shadow-lg',
    icon: 'liquid-metal-btn w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0 shadow-xl shrink-0',
  };

  const combinedClass = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClass}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClass} {...props}>
      {children}
    </button>
  );
}
