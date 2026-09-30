import type { Metadata } from 'next';
import nowData from '@/data/now.json';

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
      <p className="mt-2 text-[var(--muted-foreground)]">A snapshot, not a feed. Updated when the work changes.</p>

      <p className="mt-8 leading-relaxed">{nowData.current}</p>

      <h2 className="mt-8 mb-2 text-[var(--muted-foreground)] text-[0.95rem]">Recently</h2>
      <ul className="space-y-1.5">
        {nowData.recent.map((item) => (
          <li key={item} className="text-[var(--muted-foreground)]">{item}</li>
        ))}
      </ul>

      <p className="mt-8">
        <span className="text-[var(--muted-foreground)]">Open to </span>
        {nowData.open_to.join(', ')}.
      </p>

      <p className="mt-3 mono text-[0.8rem] text-[var(--muted-foreground)]">
        {nowData.location} · updated {nowData.updated_at}
      </p>
    </div>
  );
}
