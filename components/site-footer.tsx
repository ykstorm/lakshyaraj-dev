import { FooterWordmark } from '@/components/footer/footer-wordmark';

// The footer shell. The wordmark, the mono line and the links live in the
// client FooterWordmark (it animates the name in on scroll); this server
// component holds the border and the copyright line below it.
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--border)] mt-24">
      <div className="col py-12">
        <FooterWordmark />
        <p className="mt-8 text-[0.8rem] text-[var(--muted-foreground)]">
          © {year} Lakshyaraj Singh Rao · Mumbai / Bangalore, India
        </p>
      </div>
    </footer>
  );
}
