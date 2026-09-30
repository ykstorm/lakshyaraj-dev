import nowData from '@/data/now.json';

// The body of the "Now" update, rendered both in the home page's Now section and
// on the standalone /now page so the content lives in one place.
export function NowContent() {
  return (
    <>
      <p className="leading-relaxed">{nowData.current}</p>

      <p className="mt-6 mb-2 text-[var(--muted-foreground)] text-[0.95rem]">Recently</p>
      <ul className="space-y-1.5">
        {nowData.recent.map((item) => (
          <li key={item} className="text-[var(--muted-foreground)]">{item}</li>
        ))}
      </ul>

      <p className="mt-6">
        <span className="text-[var(--muted-foreground)]">Open to </span>
        {nowData.open_to.join(', ')}.
      </p>

      <p className="mt-3 mono text-[0.8rem] text-[var(--muted-foreground)]">
        {nowData.location} · updated {nowData.updated_at}
      </p>
    </>
  );
}
