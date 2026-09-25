"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

export function ScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Disable automatic browser scroll restoration so our explicit scroll logic is deterministic
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const handleAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.target === "_blank"
      ) {
        return;
      }

      if (href.includes("#")) {
        const [path, hash] = href.split("#");
        if (!hash) return;

        // Determine if target path is the same as current page
        const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
        const normalizedCurrent = currentPath.replace(/^\/(?:en|es|fr|de|it|pt|ja|zh|ar)(?=\/|$)/, "") || "/";
        
        // Strip query string from path if present (e.g. /path?foo=bar)
        const pathWithoutQuery = (path || "").split("?")[0].replace(/\/$/, "") || "/";
        const normalizedPath = pathWithoutQuery.replace(/^\/(?:en|es|fr|de|it|pt|ja|zh|ar)(?=\/|$)/, "") || "/";

        const isSamePage = !path || normalizedPath === normalizedCurrent;

        if (isSamePage) {
          const el = document.getElementById(hash);
          if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            window.history.replaceState(null, "", `${window.location.pathname}#${hash}`);
          }
        }
      }
    };

    const handleHashChange = () => {
      const h = window.location.hash.replace("#", "");
      if (h) {
        const el = document.getElementById(h);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash.replace("#", "");

    if (hash) {
      // If a specific ID is in the URL, attempt to scroll to that element
      let attempts = 0;
      const maxAttempts = 15;
      const interval = setInterval(() => {
        attempts++;
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          clearInterval(interval);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          // If the element ID is not found after polling, fallback to top 0
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
      }, 40);

      return () => clearInterval(interval);
    } else {
      // No specific ID -> always scroll to 0
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      const raf = requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      });
      const timeout = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }, 50);

      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timeout);
      };
    }
  }, [pathname]);

  return null;
}
