'use client';

// CSS-only fade+rise page transition, keyed on pathname so it replays per route.
// Kept as a CSS keyframe (no animation library): it wraps every route in the root
// layout, so a JS animation here would load on pure-content pages (blog, now,
// resume, project/blog detail) that ship no other motion.
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
