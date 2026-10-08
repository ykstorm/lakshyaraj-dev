import type { Metadata } from 'next';
import nowData from '@/data/now.json';
import { Subpage, formatDate } from '@/components/subpage';
import { HOME_CARD, share } from '@/lib/share';
import { alternatesFor } from '@/lib/alternates';

const DESCRIPTION = 'What I am working on right now.';

export const metadata: Metadata = {
  title: 'Now',
  description: DESCRIPTION,
  alternates: alternatesFor('/now'),
  ...share({ title: 'Now', description: DESCRIPTION, path: '/now', image: HOME_CARD }),
};

const ROWS: { label: string; value: string }[] = [
  { label: 'Building', value: nowData.building },
  { label: 'Studying', value: nowData.studying },
  { label: 'Based in', value: nowData.location },
  { label: 'Open to', value: nowData.open_to },
];

export default function NowPage() {
  const updated = formatDate(nowData.updated_at);
  return (
    <Subpage crumbs={[{ label: 'now' }]}>
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Now</h1>
      <p className="mt-3 max-w-prose text-muted-foreground">A snapshot of what I am doing, updated when it changes.</p>

      <dl className="mt-10 divide-y divide-border border-y border-border">
        {ROWS.map((r) => (
          <div key={r.label} className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
            <dt className="mono text-[13px] text-accent">{r.label}</dt>
            <dd className="max-w-prose leading-relaxed">{r.value}</dd>
          </div>
        ))}
      </dl>

      {updated && (
        <p className="mono mt-6 text-xs text-muted-foreground">
          Last updated <time dateTime={nowData.updated_at}>{updated}</time>
        </p>
      )}
    </Subpage>
  );
}
