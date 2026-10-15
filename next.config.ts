import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const cmsHostname = (() => {
  try {
    return new URL(process.env.STRAPI_BASE_URL ?? "https://cms.fundedproptraders.com").hostname;
  } catch {
    return "cms.fundedproptraders.com";
  }
})();

// Security headers applied to every response.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // The proxy advertises HTTP/3 (`alt-svc: h3=":443"; ma=2592000`). On
  // networks where UDP/QUIC is blocked, browsers stall 3–4s per connection
  // before falling back to TCP — that was the black hero and the slow page
  // load (every subresource paid the penalty). `clear` (RFC 7838 §3) tells
  // browsers to drop the HTTP/3 hint for this origin.
  { key: "Alt-Svc", value: "clear" },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "192.168.254.112",
    "192.168.*",
    "*.local",
  ],
  // Standalone output is for the Docker/Coolify deployment; Vercel builds its own bundle.
  output: process.env.VERCEL ? undefined : "standalone",
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  // NOTE: portal/auth redirects live in middleware.ts (not here) so that
  // captured ad-click IDs from ck_* cookies can be forwarded to
  // my.ckpropfirm.com. next.config redirects take precedence over middleware
  // and would bypass that forwarding.
  images: {
    // WebP only: the AVIF encoder stalls indefinitely on the self-hosted
    // (Coolify) image optimizer for some image/width combos — e.g.
    // whats-new-promo-70-v2.jpeg @ w=750 hangs forever, leaving the What's
    // New slide black on phones. WebP encodes the same variants in ~1s.
    formats: ["image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: cmsHostname },
    ],
  },
};

export default withNextIntl(nextConfig);
