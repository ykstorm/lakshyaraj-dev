import { NextResponse } from 'next/server';

type Day = { contributionCount: number; contributionLevel: string; date: string };

// Proxies the public contributions calendar (weeks × days) and derives a correct
// 30-day total. The upstream returns `contributions` as an array of weeks, each a
// 7-element array of { contributionCount, contributionLevel, date }.
export async function GET() {
  try {
    const res = await fetch('https://github-contributions-api.deno.dev/ykstorm.json', {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return NextResponse.json({ total: 0, weeks: [], last30: 0 });

    const data = await res.json();
    const weeks: Day[][] = Array.isArray(data.contributions) ? data.contributions : [];
    const days: Day[] = weeks.flat();

    const last30 = days
      .slice(-30)
      .reduce((sum, d) => sum + (d.contributionCount || 0), 0);

    return NextResponse.json({
      total: last30,                       // back-compat: telemetry reads `total` as 30d
      last30,
      yearTotal: data.totalContributions || days.reduce((s, d) => s + (d.contributionCount || 0), 0),
      weeks,
    });
  } catch {
    return NextResponse.json({ total: 0, weeks: [], last30: 0 });
  }
}
