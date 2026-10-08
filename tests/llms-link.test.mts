// The llms.txt file in public/ is found from two places: robots.txt names the
// path, and every page's head carries a rel="alternate" link to it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import robots from '../app/robots';
import { LLMS_PATH, alternatesFor } from '../lib/alternates';

test('the file the links point at exists in public/', () => {
  assert.equal(LLMS_PATH, '/llms.txt');
  assert.ok(statSync(join('public', LLMS_PATH)).isFile());
});

test('robots.txt allows everything, still names the sitemap, and lists /llms.txt', () => {
  const r = robots();
  const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules;
  const allow = ([] as string[]).concat(rule.allow ?? []);
  assert.equal(rule.userAgent, '*');
  assert.ok(allow.includes('/'), `allow is ${JSON.stringify(allow)}`);
  assert.ok(allow.includes(LLMS_PATH), `allow is ${JSON.stringify(allow)}`);
  assert.equal(r.sitemap, 'https://lakshyaraj-dev.vercel.app/sitemap.xml');
});

test('a page head gets its canonical and a text/plain alternate for /llms.txt', () => {
  assert.deepEqual(alternatesFor('/now'), {
    canonical: '/now',
    types: { 'text/plain': [{ url: '/llms.txt', title: 'llms.txt' }] },
  });
});

test('every canonical in app/ is built by alternatesFor, so no page drops the llms link', () => {
  // Next merges metadata one top-level key at a time: a page that sets its own
  // `alternates` replaces the root's, link included.
  const hits: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.tsx?$/.test(name)) {
        readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
          if (/\balternates\s*:/.test(line)) hits.push(`${p}:${i + 1}:${line.trim()}`);
        });
      }
    }
  };
  walk('app');
  assert.ok(hits.length >= 4, `expected the root, /now, /resume and project pages, found ${hits.length}`);
  for (const h of hits) assert.match(h, /alternates:\s*alternatesFor\(/, h);
});
