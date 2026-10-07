import { CARD_SIZE, renderCard } from '@/lib/og-card';

// Default (Node.js) runtime: the card is deterministic, so it is generated once
// at build time instead of on every request.
export const alt = 'Lakshyaraj Singh Rao, backend-focused full-stack developer';
export const size = CARD_SIZE;
export const contentType = 'image/png';

export default function OpengraphImage() {
  return renderCard({
    prompt: 'lakshyaraj@portfolio:~$ whoami',
    title: 'Lakshyaraj Singh Rao',
    line: 'I build backend systems that fail safely.',
    note: 'Webhooks that never run twice. Retrieval that admits when it has nothing. Streams that stop themselves.',
  });
}
