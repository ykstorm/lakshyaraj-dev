import { ReactNode } from 'react';

// The shared nav and footer live in the root layout (app/layout.tsx), so this
// route-group layout is a simple pass-through.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
