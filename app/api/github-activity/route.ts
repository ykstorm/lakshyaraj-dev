import { NextResponse } from 'next/server';

export const revalidate = 21600;

export async function GET() {
  try {
    const res = await fetch(
      'https://github-contributions-api.deno.dev/ykstorm.json',
      { next: { revalidate: 21600 } }
    );
    if (!res.ok) return NextResponse.json({ error: 'Failed to fetch' }, { status: 502 });
    const data = await res.json();
    const total = data.contributions?.reduce((sum: number, d: { count: number }) => sum + d.count, 0) ?? 0;
    return NextResponse.json({ total, contributions: data.contributions?.slice(-30) ?? [] });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}
