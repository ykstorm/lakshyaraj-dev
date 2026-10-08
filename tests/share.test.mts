// Every page's share text is its own, and a page without its own card gets
// the home card instead of none.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HOME_CARD, share } from '../lib/share';

test('a page gets its own title and description on both cards', () => {
  const s = share({ title: 'Now', description: 'What I am working on right now.', path: '/now', image: HOME_CARD });
  assert.deepEqual(s.openGraph, {
    type: 'website',
    siteName: 'Lakshyaraj Singh Rao',
    title: 'Now · Lakshyaraj Singh Rao',
    description: 'What I am working on right now.',
    url: '/now',
    images: [HOME_CARD],
  });
  assert.deepEqual(s.twitter, {
    card: 'summary_large_image',
    title: 'Now · Lakshyaraj Singh Rao',
    description: 'What I am working on right now.',
  });
});

test('a route with its own card file sets no image, so the file is used', () => {
  const s = share({ title: 'Anvil', description: 'Webhooks that run once.', path: '/projects/anvil', type: 'article' });
  assert.ok(s.openGraph && !('images' in s.openGraph));
  assert.equal((s.openGraph as { type?: string }).type, 'article');
});
