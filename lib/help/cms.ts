/**
 * CMS-backed help centre (server-only).
 *
 * Reads the replicated FAQ articles from Strapi (`faq-article` entries with
 * a `faq-collection` relation) and maps them onto the same HelpData shapes
 * the static snapshot uses, so the renderer needs no changes.
 *
 * Anything missing or malformed in CMS falls back to the bundled static
 * snapshot per article/collection — the site never renders an empty help
 * centre while Strapi is being populated.
 */

import { cmsFetch } from "@/lib/cms";
import type { Block, HelpArticle, HelpCollection, HelpData } from "./types";
import snapshot from "./articles.json";

const SNAPSHOT = snapshot as HelpData;
const STATIC_ARTICLES = SNAPSHOT.articles;
const STATIC_COLLECTIONS = SNAPSHOT.collections;

const KNOWN_BLOCK_TYPES = new Set(["p", "h", "list", "table", "button"]);

function isRunArray(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (r) =>
        r !== null &&
        typeof r === "object" &&
        typeof (r as { t?: unknown }).t === "string"
    )
  );
}

function isBlock(value: unknown): value is Block {
  if (value === null || typeof value !== "object") return false;
  const b = value as { type?: unknown };
  if (typeof b.type !== "string" || !KNOWN_BLOCK_TYPES.has(b.type)) return false;
  if (b.type === "p" || b.type === "h") return isRunArray((b as { runs?: unknown }).runs);
  return true;
}

function asBlocks(value: unknown): Block[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  return value.every(isBlock) ? (value as Block[]) : null;
}

function asDate(value: unknown, fallback: string): string {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  return fallback;
}

/** Unwrap a Strapi v5 relation that may be an object, `{ data: … }`, or id. */
function relationSlug(rel: unknown): string | null {
  if (rel === null || rel === undefined) return null;
  if (typeof rel === "object") {
    const o = rel as { slug?: unknown; attributes?: { slug?: unknown }; data?: unknown };
    if (typeof o.slug === "string") return o.slug;
    if (o.attributes && typeof o.attributes.slug === "string") return o.attributes.slug;
    if (o.data && typeof o.data === "object") return relationSlug(o.data);
  }
  return null;
}

interface CmsCollectionRow {
  name?: unknown;
  slug?: unknown;
  description?: unknown;
  sortOrder?: unknown;
}

interface CmsArticleRow {
  title?: unknown;
  slug?: unknown;
  collection?: unknown;
  body?: unknown;
  sortOrder?: unknown;
  displayDate?: unknown;
  updatedAt?: unknown;
}

async function fetchCmsHelpData(): Promise<HelpData | null> {
  const [collectionsRes, articlesRes] = await Promise.all([
    cmsFetch<{ data?: unknown }>(`faq-collections?populate=*&pagination[pageSize]=50&sort=sortOrder:asc`),
    cmsFetch<{ data?: unknown }>(
      `faq-articles?populate=collection&pagination[pageSize]=200&sort=sortOrder:asc`
    ),
  ]);

  const collectionRows = Array.isArray(collectionsRes?.data) ? collectionsRes.data : null;
  const articleRows = Array.isArray(articlesRes?.data) ? articlesRes.data : null;
  if (!collectionRows || !articleRows || articleRows.length === 0) return null;

  const staticBySlug = new Map(STATIC_ARTICLES.map((a) => [a.slug, a]));

  const collections: HelpCollection[] = [];
  const articlesByCollection = new Map<string, string[]>();
  for (const row of collectionRows) {
    const r = (row ?? {}) as CmsCollectionRow;
    if (typeof r.slug !== "string" || typeof r.name !== "string") continue;
    collections.push({
      slug: r.slug,
      name: r.name,
      description: typeof r.description === "string" ? r.description : "",
      sections: [{ name: null, articles: [] }],
    });
    articlesByCollection.set(r.slug, []);
  }
  if (collections.length === 0) return null;

  const articles: HelpArticle[] = [];
  for (const row of articleRows) {
    const r = (row ?? {}) as CmsArticleRow;
    if (typeof r.slug !== "string" || typeof r.title !== "string") continue;
    const collSlug = relationSlug(r.collection);
    if (!collSlug || !articlesByCollection.has(collSlug)) continue;
    const blocks = asBlocks(r.body) ?? staticBySlug.get(r.slug)?.blocks ?? null;
    if (!blocks) continue;
    const fallbackUpdated = staticBySlug.get(r.slug)?.updated ?? "2026-10-10";
    articles.push({
      slug: r.slug,
      title: r.title,
      collection: collSlug,
      section: null,
      updated: asDate(r.displayDate ?? r.updatedAt, fallbackUpdated),
      blocks,
    });
    articlesByCollection.get(collSlug)?.push(r.slug);
  }
  if (articles.length === 0) return null;

  for (const c of collections) {
    c.sections = [{ name: null, articles: articlesByCollection.get(c.slug) ?? [] }];
  }
  return {
    source: "strapi-cms",
    collections: collections.filter((c) => (c.sections[0]?.articles.length ?? 0) > 0),
    articles,
  };
}

/**
 * CMS-first help data with static fallback. Cached for 5 minutes via the
 * shared `cms` tag, so the Strapi revalidate webhook refreshes it instantly.
 */
export async function loadHelpData(): Promise<{ data: HelpData; fromCms: boolean }> {
  try {
    const cms = await fetchCmsHelpData();
    if (cms) return { data: cms, fromCms: true };
  } catch {
    // Fall through to the static snapshot
  }
  return {
    data: { source: "static-snapshot", collections: STATIC_COLLECTIONS, articles: STATIC_ARTICLES },
    fromCms: false,
  };
}
