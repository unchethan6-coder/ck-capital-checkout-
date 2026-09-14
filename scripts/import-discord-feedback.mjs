#!/usr/bin/env node
/**
 * Import CK Propfirm Discord Feedback into Strapi CMS (Dedicated `feedbacks` collection).
 *
 * Source: /Users/kimjoshuadr/Downloads/Feedback - Payout - CK (28 screenshots)
 * Structured Ledger: scripts/seed-data/discord-feedback.json
 *
 * Requirements:
 *   - Collection Type `Feedback` (API name: `feedback` / `feedbacks`) created in Strapi
 *   - STRAPI_API_TOKEN in .env.local with Create/Upload permissions for `feedback` & `upload`
 *   - STRAPI_BASE_URL in .env.local (default: https://cms.fundedproptraders.com)
 *
 * Usage:
 *   node scripts/import-discord-feedback.mjs
 *   STRAPI_API_TOKEN=xxx node scripts/import-discord-feedback.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SCREENSHOT_DIR = "/Users/kimjoshuadr/Downloads/Feedback - Payout - CK";
const LEDGER_PATH = path.join(ROOT, "scripts", "seed-data", "discord-feedback.json");

// Load .env.local
const envPath = path.join(ROOT, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.+)$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim();
  }
}

const BASE_URL = (process.env.STRAPI_BASE_URL ?? "https://cms.fundedproptraders.com").replace(/\/$/, "");
const TOKEN = process.env.STRAPI_API_TOKEN ?? "";

if (!TOKEN) {
  console.error("❌ No STRAPI_API_TOKEN found in .env.local or environment.");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(endpoint, { method = "GET", body, form } = {}) {
  const headers = { Authorization: `Bearer ${TOKEN}` };
  if (form) {
    headers.Accept = "application/json";
    return await fetch(`${BASE_URL}/api/${endpoint}`, { method, headers, body: form });
  }
  if (body) headers["Content-Type"] = "application/json";
  return await fetch(`${BASE_URL}/api/${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function checkPermissions() {
  console.log("🔍 Checking Strapi `feedbacks` endpoint & token permissions...");
  const testRes = await api("feedbacks", {
    method: "POST",
    body: { data: { username: "probe", message: "probe test" } },
  });

  if (testRes.status === 404 || testRes.status === 405) {
    console.error(`\n❌ Collection type \`feedbacks\` does not exist on Strapi yet (HTTP ${testRes.status}).`);
    console.error("👉 Please create the collection type first in Strapi Admin (https://cms.fundedproptraders.com/admin):");
    console.error("   1. Settings → Content-Type Builder → Create new collection type");
    console.error("   2. Display Name: Feedback");
    console.error("   3. Singular API: feedback | Plural API: feedbacks");
    console.error("   4. Add fields:");
    console.error("      - username: Text (short)");
    console.error("      - message: Text (long)");
    console.error("      - image: Media (single)");
    console.error("      - rating: Number (integer)");
    console.error("      - source: Text (short)");
    console.error("      - amount: Text (short)");
    console.error("      - date: Text (short)");
    console.error("   5. Save and restart Strapi.\n");
    return false;
  }

  if (testRes.status === 403) {
    console.error("\n❌ The STRAPI_API_TOKEN lacks Create/Upload permissions (HTTP 403 Forbidden).");
    console.error("👉 Please update STRAPI_API_TOKEN in .env.local with a token having permissions for:");
    console.error("   • Feedback: create, find, findOne, update, publish");
    console.error("   • Upload: upload, destroy, find, findOne\n");
    return false;
  }

  if (!testRes.ok) {
    const text = await testRes.text();
    console.error(`\n❌ Strapi API check failed: HTTP ${testRes.status} ${text.slice(0, 150)}`);
    return false;
  }

  // Delete probe record if created
  const data = await testRes.json();
  if (data?.data?.documentId) {
    await api(`feedbacks/${data.data.documentId}`, { method: "DELETE" });
  }

  console.log("✅ Endpoint and write permissions verified.");
  return true;
}

async function uploadImage(filePath, fileName) {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File not found: ${filePath}`);
    return null;
  }
  const form = new FormData();
  const fileBuf = fs.readFileSync(filePath);
  const blob = new Blob([fileBuf], { type: "image/png" });
  form.append("files", blob, fileName);
  form.append("fileInfo", JSON.stringify({ name: fileName }));

  const res = await api("upload", { method: "POST", form });
  if (!res.ok) {
    const err = await res.text();
    console.warn(`⚠️ Media upload failed for ${fileName}: ${res.status} ${err.slice(0, 100)}`);
    return null;
  }
  const json = await res.json();
  return json[0]?.id ?? null;
}

async function main() {
  console.log("==================================================");
  console.log("🚀 Starting CK Propfirm Feedback Ingestion (Dedicated `feedbacks` Collection)");
  console.log(`Base URL: ${BASE_URL}`);
  console.log("==================================================\n");

  const canProceed = await checkPermissions();
  if (!canProceed) {
    console.log("ℹ️ Ingestion stopped. Once the collection type and write token are ready, run this script again.");
    return;
  }

  if (!fs.existsSync(LEDGER_PATH)) {
    console.error(`❌ Ledger file not found at ${LEDGER_PATH}`);
    return;
  }

  const ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, "utf-8"));
  console.log(`📋 Found ${ledger.items.length} items in ledger.\n`);

  let created = 0;
  let failed = 0;

  for (let i = 0; i < ledger.items.length; i++) {
    const item = ledger.items[i];
    console.log(`[${i + 1}/${ledger.items.length}] Uploading: ${item.authorName} (${item.file})`);

    let mediaId = null;
    if (item.file) {
      const imgPath = path.join(SCREENSHOT_DIR, item.file);
      mediaId = await uploadImage(imgPath, `discord_feedback_${i + 1}.png`);
    }

    const payload = {
      data: {
        username: item.authorName,
        message: item.summary,
        rating: item.rating ?? 5,
        source: item.source ?? "Discord",
        date: item.date ?? null,
        amount: item.amount ?? null,
        image: mediaId,
      },
    };

    const res = await api("feedbacks?status=published", { method: "POST", body: payload });
    if (res.status === 201 || res.status === 200) {
      const respData = await res.json();
      item.cmsDocumentId = respData.data?.documentId;
      created++;
      console.log(`   ✓ Created Feedback entry (${item.cmsDocumentId})`);
    } else {
      const err = await res.text();
      console.warn(`   ⚠️ Feedback create failed: ${res.status} ${err.slice(0, 120)}`);
      failed++;
    }

    await sleep(200);
  }

  fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2));
  console.log("\n==================================================");
  console.log(`🎉 Ingestion Complete:`);
  console.log(`   • Successfully created: ${created}`);
  console.log(`   • Failed: ${failed}`);
  console.log(`   • Updated ledger: ${LEDGER_PATH}`);
  console.log("==================================================");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
