// Single source for site-wide constants shared by the layout, footer, sitemap,
// and robots so a URL or handle is only ever written once.
export const SITE = 'https://lakshyaraj-dev.vercel.app';

export const EMAIL = 'raolakshyaraj@gmail.com';

export const SOCIAL = [
  { label: 'GitHub', href: 'https://github.com/ykstorm' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/lakshyaraj-singh-rao-840273152' },
  { label: 'npm', href: 'https://npmjs.com/~ykstormsorg' },
  { label: 'Email', href: `mailto:${EMAIL}` },
] as const;
