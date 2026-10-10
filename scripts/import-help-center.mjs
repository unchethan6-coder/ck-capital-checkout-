/**
 * Imports the Intercom help centre into lib/help/articles.json.
 *
 *   node scripts/import-help-center.mjs
 *
 * The /faq pages render from that file, so the site keeps serving the help
 * centre without calling Intercom at runtime. Re-run this after editing
 * articles in Intercom, then commit the regenerated JSON.
 *
 * Article text is copied as written. The only changes are structural: inline
 * HTML becomes typed runs (so nothing is injected as raw HTML), and links
 * between help articles are pointed at their /faq equivalents.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "https://intercom.help/ck-capital/en/";
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../lib/help/articles.json");

async function pageProps(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  const html = await res.text();
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
  if (!m) throw new Error(`No page data in ${url}`);
  return { html, props: JSON.parse(m[1]).props.pageProps };
}

/** "https://…/articles/13585985-what-is-ck-prop-firm" → "what-is-ck-prop-firm" */
const slugOf = (url) => url.replace(/[?#].*$/, "").replace(/\/$/, "").split("/").pop().replace(/^\d+-/, "");

const ENTITIES = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&nbsp;": " " };
const decode = (s) => s.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (e) => ENTITIES[e]).replace(/​/g, "");

/** Inline HTML (b, i, a, br) → runs of { t, b?, i?, href?, br? }. */
function inline(html) {
  const runs = [];
  const state = { b: 0, i: 0, href: null };
  const push = (text) => {
    const t = decode(text);
    if (!t) return;
    const run = { t };
    if (state.b) run.b = true;
    if (state.i) run.i = true;
    if (state.href) run.href = state.href;
    runs.push(run);
  };
  let last = 0;
  for (const m of html.matchAll(/<(\/?)(\w+)([^>]*)>/g)) {
    push(html.slice(last, m.index));
    last = m.index + m[0].length;
    const [, close, tag, attrs] = m;
    if (tag === "br") runs.push({ t: "", br: true });
    else if (tag === "b" || tag === "strong") state.b += close ? -1 : 1;
    else if (tag === "i" || tag === "em") state.i += close ? -1 : 1;
    else if (tag === "a") {
      if (close) state.href = null;
      else {
        const href = decode((attrs.match(/href="([^"]*)"/) ?? [])[1] ?? "");
        state.href = href.includes("intercom.help/ck-capital") && href.includes("/articles/")
          ? `/faq/${slugOf(href)}`
          : href;
      }
    } else throw new Error(`Unhandled inline tag <${tag}>`);
  }
  push(html.slice(last));
  // Intercom pads paragraphs with trailing <br>; they carry no content.
  while (runs.length && runs.at(-1).br) runs.pop();
  while (runs.length && runs[0].br) runs.shift();
  if (runs.length) {
    runs[0].t = runs[0].t.replace(/^\s+/, "");
    runs.at(-1).t = runs.at(-1).t.replace(/\s+$/, "");
  }
  return runs.filter((r) => r.br || r.t);
}

function blocks(list) {
  const out = [];
  for (const b of list) {
    switch (b.type) {
      case "paragraph": {
        const runs = inline(b.text);
        if (runs.length) out.push({ type: "p", runs });
        break;
      }
      case "heading":
      case "subheading":
      case "subheading4":
        out.push({ type: "h", level: b.type === "heading" ? 2 : b.type === "subheading" ? 3 : 4, runs: inline(b.text) });
        break;
      case "unorderedNestedList":
      case "orderedNestedList":
        out.push({
          type: "list",
          ordered: b.type === "orderedNestedList",
          items: b.items.map((item) => blocks(item.content)),
        });
        break;
      case "table":
        out.push({ type: "table", rows: b.rows.map((row) => row.cells.map((cell) => blocks(cell.content))) });
        break;
      case "button":
        out.push({
          type: "button",
          text: decode(b.text),
          href: b.linkUrl.includes("/articles/") ? `/faq/${slugOf(b.linkUrl)}` : b.linkUrl,
        });
        break;
      default:
        throw new Error(`Unhandled block type "${b.type}"`);
    }
  }
  return out;
}

const home = await pageProps(BASE);
const collectionUrls = [...new Set(home.html.match(/https:\/\/intercom\.help\/ck-capital\/en\/collections\/[^"]+/g))];

const collections = [];
const queue = [];
for (const url of collectionUrls) {
  const c = (await pageProps(url)).props.collection;
  const sections = [];
  const add = (name, summaries) => {
    if (!summaries.length) return;
    sections.push({ name, articles: summaries.map((a) => slugOf(a.url)) });
    for (const a of summaries) queue.push({ url: a.url, collection: c.slug, section: name });
  };
  add(null, c.articleSummaries);
  for (const sub of c.subcollections) add(sub.name, sub.articleSummaries);
  collections.push({ slug: c.slug, name: c.name, description: c.description, sections });
}

const articles = [];
for (const { url, collection, section } of queue) {
  const a = (await pageProps(url)).props.articleContent;
  articles.push({
    slug: slugOf(url),
    title: a.title,
    collection,
    section,
    updated: a.lastUpdatedDate,
    blocks: blocks(a.blocks),
  });
}

const slugs = articles.map((a) => a.slug);
const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (dupes.length) throw new Error(`Duplicate slugs: ${dupes.join(", ")}`);

// A link to an article that was not imported would 404.
const known = new Set(slugs);
const dangling = JSON.stringify(articles).match(/"\/faq\/[^"]+"/g)?.filter((h) => !known.has(JSON.parse(h).slice(5))) ?? [];
if (dangling.length) throw new Error(`Links to missing articles: ${dangling.join(", ")}`);

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify({ source: BASE, collections, articles }, null, 1) + "\n");
console.log(`Imported ${articles.length} articles in ${collections.length} collections → ${OUT}`);
