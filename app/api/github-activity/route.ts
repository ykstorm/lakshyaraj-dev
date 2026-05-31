import { NextResponse } from 'next/server';

export const revalidate = 21600;

export async function GET() {
  try {
    const res = await fetch(
      'https://github-contributions-api.deno.dev/ykstorm.json'
    );
    if (!res.ok) return NextResponse.json({ error: 'Failed to fetch' }, { status: 502 });
    const data = await res.json();
    // API returns { contributions: [[week1_day1, ...], [week2_day1, ...]], totalContributions: N }
    const flat = (data.contributions as unknown[][]).flat() as { date: string; contributionCount: number }[];
    const last30 = flat.slice(-30);
    return NextResponse.json({ total: data.totalContributions ?? 0, contributions: last30 });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}
