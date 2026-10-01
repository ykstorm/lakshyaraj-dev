import type { NpmVersion } from '@/lib/proof';

// A server-rendered transcript of the commands you could run to check these
// versions yourself, with the answers the npm registry gave at build time. No
// window chrome, no blinking cursor — it is a record, not a decoration. When a
// fetch failed there is no number to show, so the line links to the package page
// instead of inventing one.

export function NpmTerminal({ versions }: { versions: NpmVersion[] }) {
  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-3.5 mono text-[0.82rem] leading-relaxed overflow-x-auto">
      {versions.map((v) => (
        <div key={v.full} className="whitespace-nowrap">
          <div className="text-[var(--muted-foreground)]">
            <span className="text-[var(--field-dot)]">$</span> npm view {v.full} version
          </div>
          <div className="text-[var(--foreground)]">
            {v.version ? (
              v.version
            ) : (
              <a className="link" href={v.url} target="_blank" rel="noopener noreferrer">
                {v.url}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
