import { NextResponse } from 'next/server';

// Contribution calendar for the homepage graph. The previous source
// (github-contributions-api.deno.dev) was permanently sunset with Deno Deploy
// Classic and now 404s — that's why the graph stopped loading. This proxies the
// maintained jogruber API and reshapes its flat day array into the weeks × days
// grid + level strings the <GithubContributions> widget expects.
type Day = { contributionCount: number; contributionLevel: string; date: string };
type RawDay = { date: string; count: number; level: number };

const LEVELS = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'];
const EMPTY: Day = { contributionCount: 0, contributionLevel: 'NONE', date: '' };

function toDays(raw: RawDay[]): Day[] {
  return raw.map((d) => ({
    contributionCount: d.count || 0,
    contributionLevel: LEVELS[Math.max(0, Math.min(4, d.level || 0))],
    date: d.date,
  }));
}

function toWeeks(days: Day[]): Day[][] {
  // Pad the front so column 0 starts on Sunday, keeping weekday rows aligned.
  const lead = days.length ? new Date(days[0].date + 'T00:00:00Z').getUTCDay() : 0;
  const padded: Day[] = [...Array.from({ length: lead }, () => EMPTY), ...days];
  const weeks: Day[][] = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));
  return weeks;
}

export async function GET() {
  try {
    const res = await fetch('https://github-contributions-api.jogruber.de/v4/ykstorm?y=last', {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return NextResponse.json({ weeks: [], yearTotal: 0 });

    const data = await res.json();
    const raw: RawDay[] = Array.isArray(data.contributions) ? data.contributions : [];
    const days = toDays(raw);
    const yearTotal = data.total?.lastYear ?? days.reduce((s, d) => s + d.contributionCount, 0);

    return NextResponse.json({ weeks: toWeeks(days), yearTotal });
  } catch {
    return NextResponse.json({ weeks: [], yearTotal: 0 });
  }
}
