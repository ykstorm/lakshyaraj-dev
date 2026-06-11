import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Trace runtime-read content into the serverless bundle. lib/content.ts reads
  // content/*.mdx via fs.readdirSync(process.cwd()/...), which Next's tracer
  // can't detect statically — so MDX routes prerender then 404 at runtime
  // without this include.
  outputFileTracingIncludes: {
    "/projects/[slug]": ["./content/**/*"],
    "/blog/[slug]": ["./content/**/*"],
  },
};

export default nextConfig;
