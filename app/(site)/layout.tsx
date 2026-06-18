import { ReactNode } from 'react';

// The home page (app/(site)/page.tsx) renders its own nav (with the theme
// toggle and section anchors) and footer, styled for the dark terminal brand.
// This layout is a pass-through so the chrome isn't duplicated.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
