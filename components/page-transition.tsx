'use client';

// CSS-only fade+rise page transition, keyed on pathname so it replays per route.
// Deliberately NOT framer-motion: this wraps every route in the root layout, so
// importing framer here forced ~40-60 KB of animation JS onto pure-content pages
// (blog, now, uses, resume, project/blog detail) that ship no other animation.
// The keyframes + prefers-reduced-motion guard live in globals.css (.page-fade).
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-fade">
      {children}
    </div>
  );
}
