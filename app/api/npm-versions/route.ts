import { NextResponse } from 'next/server';

export const revalidate = 3600;

export async function GET() {
  const packages = [
    '@ykstormsorg/goldset',
    '@ykstormsorg/quickdraw',
    '@ykstormsorg/tripwire',
  ];

  const versions: Record<string, string> = {};

  await Promise.all(
    packages.map(async (pkg) => {
      try {
        const res = await fetch(`https://registry.npmjs.org/${pkg}`, {
          next: { revalidate: 3600 },
        });
        if (res.ok) {
          const data = await res.json();
          versions[pkg.replace('@ykstormsorg/', '')] = data['dist-tags']?.latest ?? 'unknown';
        }
      } catch {
        versions[pkg.replace('@ykstormsorg/', '')] = 'unknown';
      }
    })
  );

  return NextResponse.json(versions);
}
