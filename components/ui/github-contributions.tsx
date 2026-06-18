'use client';

// GitHub contribution calendar, brand-tinted (phosphor emerald in dark, teal ink
// in light) instead of GitHub green so it reads as part of the site, not an
// embedded widget. Data comes from /api/github-activity (weeks × days). Squares
// stagger in on first viewport. Degrades to a one-line summary if the fetch fails.
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

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
  const reduce = useReducedMotion();

  useEffect(() => {
    fetch('/api/github-activity')
      .then((r) => r.json())
      .then((d) => {
        setWeeks(Array.isArray(d.weeks) ? d.weeks : []);
        setTotal(typeof d.yearTotal === 'number' ? d.yearTotal : null);
      })
      .catch(() => {});
  }, []);

  return (
    <a
      href="https://github.com/ykstorm"
      target="_blank"
      rel="noopener"
      className="block group"
      aria-label="GitHub contribution graph for ykstorm"
    >
      <div className="telemetry-card overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="section-label text-[10px]">Contribution graph</span>
          <span className="mono text-[10.5px] text-zinc-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            {total !== null ? `${total} in the last year ↗` : '@ykstorm ↗'}
          </span>
        </div>

        {weeks.length === 0 ? (
          <div className="mono text-[11px] text-zinc-500 py-6 text-center">
            loading contribution data…
          </div>
        ) : (
          <div className="cal-grid overflow-x-auto pb-1">
            <div className="flex gap-[3px] min-w-max">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => (
                    <motion.span
                      key={day.date || `${wi}-${di}`}
                      title={`${day.contributionCount} on ${day.date}`}
                      className="w-[10px] h-[10px] rounded-[2px]"
                      style={{ backgroundColor: LEVEL[day.contributionLevel] || 'var(--cal-0)' }}
                      initial={reduce ? false : { opacity: 0, scale: 0.4 }}
                      whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(0.6, wi * 0.012), duration: 0.25 }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-1.5 mt-3 mono text-[9.5px] text-zinc-500">
          <span>less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className="w-[10px] h-[10px] rounded-[2px]" style={{ backgroundColor: `var(--cal-${l})` }} />
          ))}
          <span>more</span>
        </div>
      </div>
    </a>
  );
}
