import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'https://github-contributions-api.deno.dev/ykstorm.json',
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return NextResponse.json({ contributions: 0 });
    const data = await res.json();

    // Sum last 30 days
    const last30 = (data.contributions || []).slice(-30);
    const total = last30.reduce((sum: number, d: { count: number }) => sum + (d.count || 0), 0);

    return NextResponse.json({ total, last30 });
  } catch {
    return NextResponse.json({ contributions: 0 });
  }
}