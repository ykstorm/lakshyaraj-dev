'use client';

// GitHub contribution calendar, tinted with the site's amber ramp (not GitHub
// green) so it reads as part of the page. Data comes from /api/github-activity
// (weeks x days). Degrades to a one-line summary if the fetch fails. No entry
// animation — the brief keeps motion to the page-load fade and hover only.
import { useEffect, useState } from 'react';

type Day = { contributionCount: number; contributionLevel: string; date: string };

const LEVEL: Record<string, string> = {
  NONE: 'var(--cal-0)',
  FIRST_QUARTILE: 'var(--cal-1)',
  SECOND_QUARTILE: 'var(--cal-2)',
  THIRD_QUARTILE: 'var(--cal-3)',
  FOURTH_QUARTILE: 'var(--cal-4)',
};

export function GithubContributions() {
  const [weeks, setWeeks] = useState<Day[][]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'ok'>('loading');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/github-activity')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (cancelled) return;
        const w = Array.isArray(d.weeks) ? d.weeks : [];
        setWeeks(w);
        setTotal(typeof d.yearTotal === 'number' ? d.yearTotal : null);
        setStatus(w.length ? 'ok' : 'error');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <a
      href="https://github.com/ykstorm"
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
      aria-label="GitHub contribution graph for ykstorm"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="mono text-[0.8rem] text-[var(--muted-foreground)] group-hover:text-[var(--accent)] transition-colors">
          {total !== null ? `${total} contributions in the last year` : '@ykstorm'}
        </span>
      </div>

      {status === 'loading' ? (
        <p className="mono text-[0.8rem] text-[var(--muted-foreground)] py-4">loading…</p>
      ) : status === 'error' ? (
        <p className="mono text-[0.8rem] text-[var(--muted-foreground)] py-4">
          Couldn&apos;t load the graph — see the full history on{' '}
          <span className="text-[var(--accent)] group-hover:underline">@ykstorm</span>.
        </p>
      ) : (
        <div className="cal-grid overflow-x-auto pb-1">
          <div className="flex gap-[3px] min-w-max">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day, di) => (
                  <span
                    key={day.date || `${wi}-${di}`}
                    title={`${day.contributionCount} on ${day.date}`}
                    className="w-[10px] h-[10px] rounded-[2px]"
                    style={{ backgroundColor: LEVEL[day.contributionLevel] || 'var(--cal-0)' }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-1.5 mt-2 mono text-[0.7rem] text-[var(--muted-foreground)]">
        <span>less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className="w-[10px] h-[10px] rounded-[2px]" style={{ backgroundColor: `var(--cal-${l})` }} />
        ))}
        <span>more</span>
      </div>
    </a>
  );
}
