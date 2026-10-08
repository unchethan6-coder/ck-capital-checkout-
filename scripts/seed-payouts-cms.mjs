#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFilePromise = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

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
const LEDGER_PATH = path.join(ROOT, "scripts", "seed-data", "payouts.json");
const CACHE_PATH = path.join(ROOT, "scripts", "seed-data", "uploaded_media_cache.json");

if (!TOKEN) {
  console.error("❌ No STRAPI_API_TOKEN found.");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function uploadWithCurl(filePath, sanitizedName) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await execFilePromise("curl", [
        "-s", "-X", "POST",
        "-H", `Authorization: Bearer ${TOKEN}`,
        "-F", `files=@${filePath};filename=${sanitizedName}`,
        "-F", `fileInfo={"name":"${sanitizedName}"}`,
        "--max-time", "60",
        `${BASE_URL}/api/upload`
      ], { encoding: "utf8" });
      const json = JSON.parse(res.stdout);
      if (json && json[0]?.id) return json[0];
    } catch (err) {
      if (attempt === 3) {
        console.warn(`  Attempt 3/3 failed for ${sanitizedName}: ${err.message}`);
      }
      await sleep(1500 * attempt);
    }
  }
  return null;
}

async function api(endpoint, { method = "GET", body } = {}) {
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json"
  };
  return await fetch(`${BASE_URL}/api/${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30000),
  });
}

// Helper: Run items through a worker pool of given concurrency
async function pool(items, concurrency, fn) {
  let index = 0;
  const results = new Array(items.length);
  const workers = Array.from({ length: concurrency }, async () => {
    while (index < items.length) {
      const currentIdx = index++;
      results[currentIdx] = await fn(items[currentIdx], currentIdx);
    }
  });
  await Promise.all(workers);
  return results;
}

async function main() {
  console.log("🚀 Starting Payouts CMS Update...");
  console.log(`Strapi Base: ${BASE_URL}`);

  const ledgerRaw = JSON.parse(fs.readFileSync(LEDGER_PATH, "utf8"));
  const payouts = ledgerRaw.payouts;
  console.log(`Total payouts in ledger: ${payouts.length}`);
  const certPayouts = payouts.filter((p) => p.display && p.optCertPath);
  console.log(`Certificate payouts to upload: ${certPayouts.length}`);

  let uploadCache = {};
  if (fs.existsSync(CACHE_PATH)) {
    try {
      uploadCache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
    } catch {}
  }

  // 1. Upload certificate images
  console.log("\n📸 Step 1: Uploading certificate images via curl (concurrency: 3)...");
  let uploadSuccess = 0;
  let uploadSkipped = 0;
  let uploadFailed = 0;

  await pool(certPayouts, 3, async (p, idx) => {
    const key = `${p.ref}_${p.certFolder}_${p.certFile}`;

    if (uploadCache[key]?.id) {
      p.mediaId = uploadCache[key].id;
      p.mediaUrl = uploadCache[key].url;
      uploadSkipped++;
      return;
    }

    const absPath = path.isAbsolute(p.optCertPath) ? p.optCertPath : path.resolve(ROOT, p.optCertPath);
    const sanitizedName = `${p.ref}_${p.name.replace(/[^a-zA-Z0-9]/g, "_")}_cert.webp`;
    const item = await uploadWithCurl(absPath, sanitizedName);

    if (item?.id) {
      p.mediaId = item.id;
      p.mediaUrl = item.url;
      uploadCache[key] = { id: item.id, documentId: item.documentId, url: item.url };
      fs.writeFileSync(CACHE_PATH, JSON.stringify(uploadCache, null, 2));
      uploadSuccess++;
      console.log(`  [${idx + 1}/${certPayouts.length}] Uploaded ${p.ref} (${p.name}): ${item.url}`);
    } else {
      console.warn(`  [${idx + 1}/${certPayouts.length}] FAILED upload for ${p.ref}`);
      uploadFailed++;
    }
  });

  console.log(`\nUploads complete: ${uploadSuccess} newly uploaded, ${uploadSkipped} from cache, ${uploadFailed} failed.`);
  if (uploadFailed > 0) {
    console.error(`⚠️ Warning: ${uploadFailed} images failed to upload. Check logs.`);
  }

  // 2. Fetch and delete existing payouts
  console.log("\n🗑️ Step 2: Fetching existing payouts to clean up...");
  const existingDocs = [];
  let page = 1;
  while (true) {
    const res = await api(`payouts?pagination[page]=${page}&pagination[pageSize]=100`);
    if (!res?.ok) break;
    const json = await res.json();
    if (!json.data || json.data.length === 0) break;
    for (const item of json.data) {
      if (item.documentId) existingDocs.push(item.documentId);
    }
    if (page >= (json.meta?.pagination?.pageCount ?? 1)) break;
    page++;
  }
  console.log(`Found ${existingDocs.length} existing payouts in Strapi.`);

  if (existingDocs.length > 0) {
    console.log(`Deleting ${existingDocs.length} existing payouts (concurrency: 5)...`);
    let deleted = 0;
    await pool(existingDocs, 5, async (docId) => {
      try {
        await api(`payouts/${docId}`, { method: "DELETE" });
        deleted++;
        if (deleted % 50 === 0 || deleted === existingDocs.length) {
          console.log(`  Deleted ${deleted}/${existingDocs.length}`);
        }
      } catch (err) {
        console.warn(`Failed to delete payout ${docId}:`, err.message);
      }
      await sleep(25);
    });
    console.log("Deleted old payouts.");
  }

  // 3. Create fresh payouts
  console.log("\n✨ Step 3: Creating updated payouts in Strapi (concurrency: 3)...");
  let createdCount = 0;
  let createdFailed = 0;

  await pool(payouts, 3, async (p, idx) => {
    // Attach mediaId from cache if not already set
    const key = `${p.ref}_${p.certFolder}_${p.certFile}`;
    if (!p.mediaId && uploadCache[key]?.id) {
      p.mediaId = uploadCache[key].id;
    }

    const title = p.firstName && p.country ? `${p.firstName} · ${p.country}` : p.name;
    const bodyData = {
      title,
      amount: p.amountLabel,
    };
    if (p.mediaId) {
      bodyData.image = p.mediaId;
    }

    try {
      const res = await api("payouts?status=published", { method: "POST", body: { data: bodyData } });
      if (res?.status === 201) {
        const created = await res.json();
        p.cmsId = created.data?.id;
        p.cmsDocumentId = created.data?.documentId;
        createdCount++;
        if (createdCount % 25 === 0 || createdCount === payouts.length) {
          console.log(`  Created ${createdCount}/${payouts.length} (${p.ref}: ${title} -> ${p.amountLabel})`);
        }
      } else {
        const errText = await res.text();
        console.warn(`  Failed creating ${p.ref} (${res?.status}): ${errText.substring(0, 100)}`);
        createdFailed++;
      }
    } catch (err) {
      console.warn(`  Error creating ${p.ref}:`, err.message);
      createdFailed++;
    }
    await sleep(25);
  });

  console.log(`\nPayouts created: ${createdCount} succeeded, ${createdFailed} failed.`);

  // 4. Save updated ledger
  fs.writeFileSync(LEDGER_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), payouts }, null, 2));
  console.log(`Updated ledger saved to ${LEDGER_PATH}`);

  // 5. Trigger Next.js revalidation webhook if secret exists
  const revSecret = process.env.REVALIDATE_SECRET;
  if (revSecret) {
    console.log("\n🔄 Triggering Next.js revalidation cache flush...");
    try {
      const revUrl = `https://ckpropfirm.com/api/revalidate?secret=${revSecret}&tag=cms`;
      const revRes = await fetch(revUrl, { signal: AbortSignal.timeout(10000) });
      console.log(`Revalidation triggered: HTTP ${revRes.status}`);
    } catch (e) {
      console.log(`Revalidation note: ${e.message}`);
    }
  }

  console.log("\n🎉 Payouts CMS Update Successfully Completed!");
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
