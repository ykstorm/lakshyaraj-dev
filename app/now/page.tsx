import type { Metadata } from 'next';
import { NowContent } from '@/components/now-content';

export const metadata: Metadata = {
  title: 'Now — Lakshyaraj Singh Rao',
  description: 'What I am working on right now.',
  alternates: { canonical: '/now' },
  openGraph: { title: 'Now — Lakshyaraj Singh Rao', description: 'What I am working on right now.', url: '/now' },
};

export default function NowPage() {
  return (
    <div className="col py-12">
      <h1 className="text-[clamp(1.8rem,5vw,2.4rem)] font-bold tracking-tight">Now</h1>
      <p className="mt-2 mb-8 text-[var(--muted-foreground)]">A snapshot, not a feed. Updated when the work changes.</p>
      <NowContent />
    </div>
  );
}
