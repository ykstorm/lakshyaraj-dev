import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const revalidate = 60;

export async function GET() {
  try {
    const file = await readFile(join(process.cwd(), 'data', 'now.json'), 'utf-8');
    const data = JSON.parse(file);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
