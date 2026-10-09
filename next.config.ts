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
  async redirects() {
    return [
      {
        source: "/portal",
        destination: "https://my.ckpropfirm.com",
        permanent: false,
      },
      {
        source: "/dashboard",
        destination: "https://my.ckpropfirm.com",
        permanent: false,
      },
      {
        source: "/signin",
        destination: "https://my.ckpropfirm.com/auth/signin",
        permanent: false,
      },
      {
        source: "/login",
        destination: "https://my.ckpropfirm.com/auth/signin",
        permanent: false,
      },
      {
        source: "/signup",
        destination: "https://my.ckpropfirm.com/auth/signup",
        permanent: false,
      },
      {
        source: "/register",
        destination: "https://my.ckpropfirm.com/auth/signup",
        permanent: false,
      },
      {
        source: "/:locale(en|es|pt|ar|de|fr|hi)/portal",
        destination: "https://my.ckpropfirm.com",
        permanent: false,
      },
      {
        source: "/:locale(en|es|pt|ar|de|fr|hi)/dashboard",
        destination: "https://my.ckpropfirm.com",
        permanent: false,
      },
      {
        source: "/:locale(en|es|pt|ar|de|fr|hi)/signin",
        destination: "https://my.ckpropfirm.com/auth/signin",
        permanent: false,
      },
      {
        source: "/:locale(en|es|pt|ar|de|fr|hi)/login",
        destination: "https://my.ckpropfirm.com/auth/signin",
        permanent: false,
      },
      {
        source: "/:locale(en|es|pt|ar|de|fr|hi)/signup",
        destination: "https://my.ckpropfirm.com/auth/signup",
        permanent: false,
      },
      {
        source: "/:locale(en|es|pt|ar|de|fr|hi)/register",
        destination: "https://my.ckpropfirm.com/auth/signup",
        permanent: false,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: cmsHostname },
    ],
  },
};

export default withNextIntl(nextConfig);
