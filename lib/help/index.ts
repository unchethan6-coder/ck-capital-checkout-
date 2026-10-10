/**
 * The help centre, as imported from Intercom.
 *
 * Server-side entry point. The search box loads articles.json itself, lazily,
 * so nothing here should be imported from a client component.
 */

import raw from "./articles.json";
import type { Block, HelpArticle, HelpCollection, HelpData } from "./types";

const data = raw as HelpData;

export const HELP_COLLECTIONS: HelpCollection[] = data.collections;
export const HELP_ARTICLES: HelpArticle[] = data.articles;

const bySlug = new Map(HELP_ARTICLES.map((a) => [a.slug, a]));

export function getHelpArticle(slug: string): HelpArticle | undefined {
  return bySlug.get(slug);
}

export function getHelpCollection(slug: string): HelpCollection | undefined {
  return HELP_COLLECTIONS.find((c) => c.slug === slug);
}

/** Flattens blocks to plain text — for meta descriptions and JSON-LD. */
export function blocksToText(blocks: Block[]): string {
  const parts: string[] = [];
  for (const b of blocks) {
    if (b.type === "p" || b.type === "h") parts.push(b.runs.map((r) => (r.br ? " " : r.t)).join(""));
    else if (b.type === "list") parts.push(b.items.map(blocksToText).join(" "));
    else if (b.type === "table") parts.push(b.rows.map((row) => row.map(blocksToText).join(" — ")).join(". "));
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

export function excerpt(text: string, max = 160): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}
