"use client";

import { useEffect } from "react";
import { enrichUrlWithAttribution } from "@/lib/analytics/attribution";

const PORTAL_HOST = "my.ckpropfirm.com";

/**
 * Appends captured ad-click IDs (gclid, fbclid, twclid, …) to every
 * my.ckpropfirm.com link at click time. Several CTAs render raw portal URLs,
 * so decorating centrally — instead of at each call site — keeps current and
 * future links carrying attribution. Links opting out can set
 * `data-no-attribution`.
 */
export function PortalLinkDecorator() {
  useEffect(() => {
    const decorate = (anchor: HTMLAnchorElement) => {
      try {
        if (anchor.hasAttribute("data-no-attribution")) return;
        const raw = anchor.getAttribute("href");
        if (!raw) return;
        const url = new URL(raw, window.location.origin);
        if (url.hostname !== PORTAL_HOST) return;
        const enriched = enrichUrlWithAttribution(url.toString());
        if (enriched !== url.toString()) anchor.setAttribute("href", enriched);
      } catch {
        // Never break navigation
      }
    };

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (anchor) decorate(anchor as HTMLAnchorElement);
    };
    // Middle-click / ctrl+click open a new tab via auxclick, not click.
    const onAuxClick = (event: MouseEvent) => {
      if (event.button !== 1) return;
      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (anchor) decorate(anchor as HTMLAnchorElement);
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onAuxClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onAuxClick, true);
    };
  }, []);

  return null;
}
