"use client";

/**
 * Copy text to the clipboard, with a fallback.
 *
 * `navigator.clipboard` rejects whenever the document is not focused, which
 * happens in embedded frames and some in-app browsers — exactly the contexts a
 * promotional modal gets opened in. A coupon that silently fails to copy is a
 * lost conversion, so a failed write falls back to the legacy command and, as
 * a last resort, the caller is told so it can select the code instead.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy path.
  }

  try {
    const area = document.createElement("textarea");
    area.value = text;
    // Keep it out of view and out of the tab order while it is focused.
    area.setAttribute("readonly", "");
    area.setAttribute("aria-hidden", "true");
    area.style.cssText = "position:fixed;top:0;left:-9999px;opacity:0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}
