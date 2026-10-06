import type { Calendar, CalendarWeek, CiResult, CiState, DownloadsResult, Failure, NpmResult, Proof, StarsResult } from '@/lib/proof';

const CAPTION = 'Counts commits to my own repositories. It measures what I write here, not what I land upstream.';
const DAY = 86400;

const count = (n: number, one: string, many: string) => `${n.toLocaleString('en-US')} ${n === 1 ? one : many}`;
const failed = <T extends { ok: boolean }>(items: T[]) => items.filter((r): r is T & Failure => !r.ok);

const STATE_CLASS: Record<CiState, string> = {
  passing: 'state-ok',
  failing: 'state-bad',
  running: 'state-wait',
  'no checks': 'text-muted-foreground',
};

function FailedUrl({ f }: { f: Failure }) {
  return (
    <span className="break-all">
      Could not fetch{' '}
      <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-accent">
        {f.url}
      </a>{' '}
      ({f.reason}).
    </span>
  );
}

function Failures({ items }: { items: Failure[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mono mt-4 space-y-1.5 border-t border-border pt-3 text-[11.5px] leading-relaxed state-bad">
      {items.map((f) => (
        <li key={f.url}>
          <FailedUrl f={f} />
        </li>
      ))}
    </ul>
  );
}

// A count read from npm or GitHub, or "unknown" when that fetch failed (the
// failed URL is then listed under the table).
function CountCell({ text }: { text: string | null }) {
  return (
    <td className={`whitespace-nowrap py-2 pl-3 text-right tabular-nums ${text === null ? 'state-bad' : 'text-muted-foreground'}`}>
      {text ?? 'unknown'}
    </td>
  );
}

function NpmPanel({ npm, downloads }: { npm: NpmResult[]; downloads: DownloadsResult[] }) {
  const weekly = new Map(downloads.map((d) => [d.name, d]));
  return (
    <div className="panel p-5">
      <h3 className="font-display text-lg">On npm</h3>
      <p className="mt-1 text-[14px] text-muted-foreground">
        The latest published version of each package and its downloads in the last week, read from npm.
      </p>
      <table className="mono mt-4 w-full text-[12.5px]">
        <thead className="sr-only">
          <tr>
            <th>Package</th>
            <th>Latest version</th>
            <th>Downloads last week</th>
          </tr>
        </thead>
        <tbody>
          {npm.map((p) => {
            const d = weekly.get(p.name);
            return (
              <tr key={p.name} className="border-t border-border">
                <td className="py-2 pr-3">
                  <a href={p.page} target="_blank" rel="noopener noreferrer" className="break-all hover:text-accent">
                    {p.name}
                  </a>
                </td>
                <td className={`py-2 text-right tabular-nums ${p.ok ? 'text-foreground' : 'state-bad'}`}>{p.ok ? `v${p.version}` : 'unavailable'}</td>
                <CountCell text={d?.ok ? count(d.downloads, 'download', 'downloads') : null} />
              </tr>
            );
          })}
        </tbody>
      </table>
      <Failures items={[...failed(npm), ...failed(downloads)]} />
    </div>
  );
}

function GithubPanel({ ci, stars }: { ci: CiResult[]; stars: StarsResult[] }) {
  const byRepo = new Map(stars.map((s) => [s.repo, s]));
  return (
    <div className="panel p-5">
      <h3 className="font-display text-lg">On GitHub</h3>
      <p className="mt-1 text-[14px] text-muted-foreground">
        Check runs on the latest commit to each repository&apos;s main branch, then its stars and forks.
      </p>
      <table className="mono mt-4 w-full text-[12.5px]">
        <thead className="sr-only">
          <tr>
            <th>Repository</th>
            <th>CI status</th>
            <th>Commit</th>
            <th>Stars</th>
            <th>Forks</th>
          </tr>
        </thead>
        <tbody>
          {ci.map((r) => {
            const s = byRepo.get(r.repo);
            return (
              <tr key={r.repo} className="border-t border-border">
                <td className="py-2 pr-3">
                  <a href={`https://github.com/ykstorm/${r.repo}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                    {r.repo}
                  </a>
                </td>
                {r.ok ? (
                  <>
                    <td className={`py-2 pr-3 ${STATE_CLASS[r.state]}`}>
                      {r.state}
                      {r.state === 'failing' && <span className="text-muted-foreground"> ({r.failed} of {r.total})</span>}
                    </td>
                    <td className="py-2 text-right">
                      {r.sha ? (
                        <a href={r.page} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent">
                          {r.sha.slice(0, 7)}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">none</span>
                      )}
                    </td>
                  </>
                ) : (
                  <td colSpan={2} className="py-2 state-bad">unknown</td>
                )}
                <CountCell text={s?.ok ? count(s.stars, 'star', 'stars') : null} />
                <CountCell text={s?.ok ? count(s.forks, 'fork', 'forks') : null} />
              </tr>
            );
          })}
        </tbody>
      </table>
      <Failures items={[...failed(ci), ...failed(stars)]} />
    </div>
  );
}

// GitHub-style levels: quartiles of the days that had any commits.
function leveller(weeks: CalendarWeek[]): (n: number) => number {
  const counts = weeks.flatMap((w) => w.days).filter((n) => n > 0).sort((a, b) => a - b);
  const q = (p: number) => counts[Math.floor(p * (counts.length - 1))] ?? 0;
  const [q1, q2, q3] = [q(0.25), q(0.5), q(0.75)];
  return (n) => (n <= 0 ? 0 : n <= q1 ? 1 : n <= q2 ? 2 : n <= q3 ? 3 : 4);
}

const fmtDay = (sec: number) =>
  new Date(sec * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const monthOf = (sec: number) => new Date(sec * 1000).toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' });

function CommitCalendar({ calendar, fetchedAt }: { calendar: Calendar; fetchedAt: number }) {
  if (!calendar.ok) {
    return (
      <figure className="panel p-5">
        <h3 className="font-display text-lg">Commits</h3>
        <p className="mono mt-3 text-[12px] state-bad">
          <FailedUrl f={calendar} />
        </p>
        <figcaption className="mt-3 text-[14px] text-muted-foreground">{CAPTION}</figcaption>
      </figure>
    );
  }
  const level = leveller(calendar.weeks);
  const now = fetchedAt / 1000;
  const label = `${calendar.total} commits to ${calendar.repos} of my public repositories in the last 52 weeks`;

  return (
    <figure className="panel p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="font-display text-lg">Commits</h3>
        <p className="mono text-[12px] text-muted-foreground tabular-nums">
          {calendar.total} in the last 52 weeks, across {calendar.repos} repositories
        </p>
      </div>
      <div className="cal-scroll mt-4 overflow-x-auto pb-1">
        <div role="img" aria-label={label} className="inline-block">
          <div aria-hidden className="mono flex gap-[3px] pb-1.5 text-[10px] text-muted-foreground">
            {calendar.weeks.map((w, i) => {
              const show = i === 0 || monthOf(w.start) !== monthOf(calendar.weeks[i - 1].start);
              return (
                <span key={w.start} className="w-[10px] overflow-visible whitespace-nowrap">
                  {show && i < calendar.weeks.length - 2 ? monthOf(w.start) : ''}
                </span>
              );
            })}
          </div>
          <div aria-hidden className="flex gap-[3px]">
            {calendar.weeks.map((w) => (
              <div key={w.start} className="flex flex-col gap-[3px]">
                {w.days.map((n, d) => {
                  const at = w.start + d * DAY;
                  if (at > now) return null;
                  return (
                    <span
                      key={d}
                      title={`${n} ${n === 1 ? 'commit' : 'commits'} on ${fmtDay(at)}`}
                      className="h-[10px] w-[10px] rounded-[2px]"
                      style={{ backgroundColor: `var(--cal-${level(n)})` }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div aria-hidden className="mono mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
        <span>fewer</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className="h-[10px] w-[10px] rounded-[2px]" style={{ backgroundColor: `var(--cal-${l})` }} />
        ))}
        <span>more</span>
      </div>
      <figcaption className="mt-3 max-w-prose text-[14px] text-muted-foreground">{CAPTION}</figcaption>
      <Failures items={calendar.missing} />
    </figure>
  );
}

export function ProofSection({ proof }: { proof: Proof }) {
  const stamp = new Date(proof.fetchedAt).toISOString().slice(0, 16).replace('T', ' ');
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <NpmPanel npm={proof.npm} downloads={proof.downloads} />
        <GithubPanel ci={proof.ci} stars={proof.stars} />
      </div>
      <CommitCalendar calendar={proof.calendar} fetchedAt={proof.fetchedAt} />
      <p className="mono text-[11.5px] text-muted-foreground">
        Versions, downloads, checks, stars, forks and commits are read from npm and GitHub when the page builds (last at {stamp}{' '}
        UTC) and refreshed at most once an hour.
      </p>
    </div>
  );
}
