import { NextResponse } from 'next/server';

const PACKAGES = [
  '@ykstormsorg/tripwire',
  '@ykstormsorg/goldset',
  '@ykstormsorg/quickdraw',
];

async function getNpmVersion(pkg: string): Promise<string> {
  try {
    const res = await fetch(`https://registry.npmjs.org/${pkg}/latest`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return 'N/A';
    const data = await res.json();
    return data.version || 'N/A';
  } catch {
    return 'N/A';
  }
}

export async function GET() {
  const versions = await Promise.all(PACKAGES.map(async (pkg) => {
    const version = await getNpmVersion(pkg);
    return { pkg, version };
  }));
  return NextResponse.json(Object.fromEntries(versions.map(v => [v.pkg, v.version])));
}