'use client';

// CSS-only fade+rise page transition, keyed on pathname so it replays per route.
// Deliberately NOT framer-motion: this wraps every route in the root layout, so
// importing framer here forced ~40-60 KB of animation JS onto pure-content pages
// (now, resume, project detail) that ship no other animation.
// The keyframes + prefers-reduced-motion guard live in globals.css (.page-fade).
//
// Only navigation within the site fades. The page a visitor lands on paints at
// full opacity: Chrome never counts an element first painted at opacity 0 as
// the Largest Contentful Paint, so a load-time fade handed LCP to whatever
// painted later (on phones, a label under the lazily loaded hero world).
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [landing] = useState(pathname);
  const [navigated, setNavigated] = useState(false);
  // Derived from the previous render, so set during render (no effect needed).
  if (!navigated && pathname !== landing) setNavigated(true);

  return (
    <div key={pathname} className={navigated ? 'page-fade' : undefined}>
      {children}
    </div>
  );
}
