#!/usr/bin/env node
/**
 * Seed the CMS-driven help centre.
 *
 * Prerequisites (done once in Strapi admin — see docs/strapi-faq-articles.md):
 *   1. `faq-collection` collection type: name (Text, required), slug (UID,
 *      required, unique), description (Text), sortOrder (Number).
 *   2. `faq-article` collection type: title (Text, required), slug (UID,
 *      required, unique), collection (Relation many-to-one → faq-collection,
 *      required), body (JSON, required), sortOrder (Number),
 *      displayDate (Date).
 *   3. Token permission: find/create/update/publish on both types.
 *
 * Reads the replicated article set from lib/help/articles.json and upserts
 * all 6 collections + 68 articles by slug, then publishes them.
 *
 * Usage: node scripts/seed-faq-articles.mjs [--dry-run]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const envPath = path.join(ROOT, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.+)$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim();
  }
}

const BASE_URL = (process.env.STRAPI_BASE_URL ?? "https://cms.fundedproptraders.com").replace(/\/$/, "");
const TOKEN = process.env.STRAPI_API_TOKEN ?? "";
const DRY_RUN = process.argv.includes("--dry-run");

if (!TOKEN) {
  console.error("❌ No STRAPI_API_TOKEN found.");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(endpoint, { method = "GET", body } = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* non-JSON */
  }
  return { status: res.status, json };
}

async function findBySlug(type, slug) {
  const { status, json } = await api(
    `/api/${type}?filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[pageSize]=1`
  );
  if (status !== 200 || !Array.isArray(json?.data)) return null;
  return json.data[0] ?? null;
}

async function publish(type, documentId) {
  // Strapi v5 publish action; older setups accept publishedAt via PUT.
  const { status } = await api(`/api/${type}/${documentId}/actions/publish`, { method: "POST", body: {} });
  if (status === 200 || status === 201) return true;
  const put = await api(`/api/${type}/${documentId}`, {
    method: "PUT",
    body: { data: { publishedAt: new Date().toISOString() } },
  });
  return put.status === 200;
}

async function upsert(type, slug, data) {
  const existing = await findBySlug(type, slug);
  if (existing) {
    const id = existing.documentId ?? existing.id;
    if (DRY_RUN) {
      console.log(`  [dry-run] would UPDATE ${type}/${slug}`);
      return id;
    }
    const { status } = await api(`/api/${type}/${id}`, { method: "PUT", body: { data } });
    if (status !== 200) throw new Error(`PUT ${type}/${slug} → ${status}`);
    console.log(`  updated ${type}/${slug}`);
    return id;
  }
  if (DRY_RUN) {
    console.log(`  [dry-run] would CREATE ${type}/${slug}`);
    return `dry-run-${slug}`;
  }
  const { status, json } = await api(`/api/${type}`, { method: "POST", body: { data } });
  if (status !== 200 && status !== 201) {
    throw new Error(`POST ${type}/${slug} → ${status}: ${JSON.stringify(json)?.slice(0, 200)}`);
  }
  const id = json?.data?.documentId ?? json?.data?.id;
  console.log(`  created ${type}/${slug}`);
  return id;
}

const data = JSON.parse(fs.readFileSync(path.join(ROOT, "lib", "help", "articles.json"), "utf-8"));
const collections = data.collections ?? [];
const articles = data.articles ?? [];
console.log(`Collections: ${collections.length}, articles: ${articles.length}${DRY_RUN ? " (dry run)" : ""}`);

const collectionIds = {};
for (const [i, c] of collections.entries()) {
  const id = await upsert("faq-collections", c.slug, {
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
    sortOrder: i,
  });
  collectionIds[c.slug] = id;
  await sleep(150);
}

let done = 0;
for (const c of collections) {
  const list = c.sections.flatMap((s) => s.articles);
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  for (const [i, slug] of list.entries()) {
    const a = bySlug.get(slug);
    if (!a) {
      console.warn(`  ⚠ collection ${c.slug} references unknown article ${slug}, skipping`);
      continue;
    }
    const id = await upsert("faq-articles", slug, {
      title: a.title,
      slug: a.slug,
      collection: collectionIds[c.slug],
      body: a.blocks,
      sortOrder: i,
      displayDate: a.updated ?? null,
    });
    if (!DRY_RUN && id && !String(id).startsWith("dry-run")) {
      const ok = await publish("faq-articles", id);
      if (!ok) console.warn(`  ⚠ could not publish ${slug} — publish it manually in Strapi admin`);
    }
    done++;
    await sleep(150);
  }
}

// Publish collections too (harmless if draft/publish is off).
if (!DRY_RUN) {
  for (const c of collections) {
    await publish("faq-collections", collectionIds[c.slug]).catch(() => false);
  }
}

console.log(`✅ Done — ${done} articles upserted${DRY_RUN ? " (dry run, nothing written)" : " and published"}.`);
