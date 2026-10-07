import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CK Capital — Prop Trading Firm",
    short_name: "CK Capital",
    description:
      "Funded accounts up to $1.2M with an 80% profit split. Trade Forex, Crypto, and Commodities with no restrictions.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0a07",
    theme_color: "#0b0a07",
    lang: "en",
    icons: [
      { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
