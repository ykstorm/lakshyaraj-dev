import type { NextConfig } from "next";

// Pragmatic CSP: next-themes injects an inline <script> to set the theme class
// before paint, and Next/Framer inject inline styles — both need 'unsafe-inline'
// (a nonce-based policy would require middleware, overkill for a static portfolio).
// Vercel Analytics/Speed-Insights load same-origin (/_vercel/*); va.vercel-scripts.com
// is the legacy beacon fallback. Everything else is locked to 'self'.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // Trace runtime-read content into the serverless bundle. lib/content.ts reads
  // content/*.mdx via fs.readdirSync(process.cwd()/...), which Next's tracer
  // can't detect statically — so MDX routes prerender then 404 at runtime
  // without this include.
  outputFileTracingIncludes: {
    "/projects/[slug]": ["./content/**/*"],
    "/blog/[slug]": ["./content/**/*"],
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
