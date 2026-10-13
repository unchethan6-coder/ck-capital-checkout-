#!/usr/bin/env node
/**
 * Seed CK Propfirm payout records into Strapi from the public payout CSV.
 *
 * The `payout` content type is minimal (title, amount, image) — no country,
 * date, or verification fields exist and the API token cannot extend the
 * schema. So this script stores:
 *   - title  = "FirstName · CountryName"   (site splits country out)
 *   - amount = "$8,000.00"
 *   - image  = certificate (uploaded to Strapi media) when a cert link exists
 *
 * Records without a certificate are created WITHOUT an image (site counts
 * them in totals but hides them from display lists). All records are
 * published so they are readable with the site's read-only token.
 *
 * The full ledger (country, date, cert url, currency) is mirrored to
 * scripts/seed-data/payouts.json so the site can derive precise stats and
 * the modal can offer "Open source certificate" without new CMS fields.
 *
 * Usage:
 *   node scripts/seed-payouts.mjs            # uses .env.local token
 *   STRAPI_API_TOKEN=xxx node scripts/seed-payouts.mjs
 *
 * Idempotent: deletes existing payouts, uploads fresh certs, recreates.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Load .env.local if it exists (server-only, no dotenv dep).
const envPath = path.join(ROOT, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.+)$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim();
  }
}

const BASE_URL = process.env.STRAPI_BASE_URL ?? "https://cms.fundedproptraders.com";
const TOKEN = process.env.STRAPI_API_TOKEN ?? "";
const SHEET_CSV = path.resolve(__dirname, "payouts.csv");
const OUT_DIR = path.join(__dirname, "seed-data");
const LEDGER_PATH = path.join(OUT_DIR, "payouts.json");
const CERT_DIR = path.join(OUT_DIR, "certs");

if (!TOKEN) {
  console.error("No STRAPI_API_TOKEN set (use .env.local or env var). Aborting.");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(path, { method = "GET", body, form } = {}) {
  const headers = { Authorization: `Bearer ${TOKEN}` };
  if (form) {
    headers.Accept = "application/json";
    return await fetch(`${BASE_URL}/api/${path}`, { method, headers, body: form });
  }
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(`${BASE_URL}/api/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res;
}

/* ── CSV parsing (handles quoted commas) ─────────────────────────── */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else cell += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      if (row.some((v) => v.trim() !== "")) rows.push(row);
      row = [];
    } else {
      cell += c;
    }
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    if (row.some((v) => v.trim() !== "")) rows.push(row);
  }
  return rows;
}

/* ── Country name → ISO-2 map ─────────────────────────────────────── */
const COUNTRY_CODES = {
  "United Kingdom": "GB",
  "United States": "US",
  India: "IN",
  "South Africa": "ZA",
  Germany: "DE",
  Australia: "AU",
  Indonesia: "ID",
  Nigeria: "NG",
  Pakistan: "PK",
  Romania: "RO",
  Brazil: "BR",
  Malaysia: "MY",
  Singapore: "SG",
  France: "FR",
  Kenya: "KE",
  Egypt: "EG",
  Brunei: "BN",
  Bulgaria: "BG",
  Netherlands: "NL",
  Nepal: "NP",
  Argentina: "AR",
  "Czech Republic": "CZ",
  "Saudi Arabia": "SA",
  Namibia: "NA",
  Poland: "PL",
  Serbia: "RS",
  Thailand: "TH",
  Honduras: "HN",
  Finland: "FI",
  Portugal: "PT",
  Sweden: "SE",
  Austria: "AT",
  Belgium: "BE",
  Denmark: "DK",
  Hungary: "HU",
  Israel: "IL",
  Japan: "JP",
  Luxembourg: "LU",
  Mexico: "MX",
  Norway: "NO",
  Peru: "PE",
  Philippines: "PH",
  Russia: "RU",
  Switzerland: "CH",
  Turkey: "TR",
  Ukraine: "UA",
  Vietnam: "VN",
  "Sri Lanka": "LK",
  Bangladesh: "BD",
  Ghana: "GH",
  Zimbabwe: "ZW",
  Ireland: "IE",
  Italy: "IT",
  Spain: "ES",
  Canada: "CA",
  Morocco: "MA",
};

function countryCode(name) {
  return COUNTRY_CODES[name] ?? null;
}

/* ── Amount parsing ───────────────────────────────────────────────── */
function parseAmount(v) {
  const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
function fmtMoney(n) {
  return `$${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n)}`;
}

/* ── First name extraction ────────────────────────────────────────── */
function firstName(full) {
  const trimmed = String(full ?? "").trim();
  if (!trimmed) return null;
  return trimmed.split(/[\s,]+/)[0];
}

/* ── Certificate link → downloadable URL ──────────────────────────── */
function certToUrl(link) {
  if (!link) return null;
  const t = link.trim();
  if (!t) return null;
  // Google Drive /file/d/<id>/view
  const drive = t.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (drive) {
    const id = drive[1];
    return `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;
  }
  // direct ibb.co / any http link
  if (/^https?:\/\//i.test(t)) return t;
  return null;
}

async function downloadCert(url, dest) {
  const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(60000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf;
}

function extFromUrl(url) {
  const m = url.match(/\.(jpe?g|png|webp|gif)(\?|$)/i);
  return m ? m[1].toLowerCase() : "png";
}

/* ── ibb.co: resolve og:image via the page HTML ───────────────────── */
async function ibbImageUrl(link) {
  const res = await fetch(link, { redirect: "follow", signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`ibb HTTP ${res.status}`);
  const html = await res.text();
  const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(CERT_DIR, { recursive: true });

  // 1. Read CSV
  console.log("Reading payout CSV…");
  const csvText = fs.readFileSync(SHEET_CSV, "utf-8");
  const rows = parseCsv(csvText);
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const data = rows.slice(1);
  console.log(`CSV: ${data.length} rows`);

  // Skip obvious test rows (no real name/email).
  const clean = data.filter((r) => {
    const name = (r[2] || "").trim();
    const email = (r[3] || "").trim();
    if (/test|probe|codesis/i.test(name) || /codesis|@example\.|test/i.test(email)) return false;
    return name.length > 0;
  });
  console.log(`After test-row filter: ${clean.length}`);

  // 2. Build ledger + download certs
  const ledger = [];
  let downloaded = 0;
  let failedCerts = 0;
  for (let i = 0; i < clean.length; i++) {
    const r = clean[i];
    const ref = (r[0] || "").trim();
    const dateRaw = (r[1] || "").trim();
    const fullName = (r[2] || "").trim();
    const email = (r[3] || "").trim();
    const country = (r[4] || "").trim();
    const amount = parseAmount(r[5]);
    const certLink = (r[6] || "").trim();

    const rec = {
      ref,
      name: fullName,
      firstName: firstName(fullName),
      email,
      country,
      countryCode: countryCode(country),
      amount,
      amountLabel: fmtMoney(amount),
      date: dateRaw,
      certLink: certLink || null,
      certFile: null,
      certUrl: null,
      imageDocumentId: null,
      display: false,
    };

    // Try to resolve + download the certificate.
    if (certLink) {
      try {
        let url = certToUrl(certLink);
        if (!url && /ibb\.co/i.test(certLink)) {
          url = await ibbImageUrl(certLink);
        }
        if (url) {
          const ext = extFromUrl(url);
          const dest = path.join(CERT_DIR, `${ref}.${ext}`);
          if (!fs.existsSync(dest) || fs.statSync(dest).size < 100) {
            await downloadCert(url, dest);
          }
          rec.certFile = path.basename(dest);
          rec.certUrl = url;
          rec.display = true;
          downloaded++;
          console.log(`  [${i + 1}/${clean.length}] ${ref} ${rec.firstName} ${rec.country} ${rec.amountLabel} ✓ cert`);
        } else {
          console.log(`  [${i + 1}/${clean.length}] ${ref} ${rec.firstName} — cert link unresolved`);
        }
      } catch (err) {
        failedCerts++;
        console.warn(`  [${i + 1}/${clean.length}] ${ref} cert download failed: ${err.message}`);
      }
    } else {
      console.log(`  [${i + 1}/${clean.length}] ${ref} ${rec.firstName} ${rec.country} ${rec.amountLabel} (no cert)`);
    }
    ledger.push(rec);
  }

  const totalAll = ledger.reduce((s, r) => s + r.amount, 0);
  const totalCert = ledger.filter((r) => r.display).reduce((s, r) => s + r.amount, 0);
  console.log(`\nCertificates downloaded: ${downloaded} (${failedCerts} failed)`);
  console.log(`Total (all): ${fmtMoney(totalAll)} across ${ledger.length} records`);
  console.log(`Total (cert): ${fmtMoney(totalCert)} across ${ledger.filter((r) => r.display).length} records`);
  console.log(`Countries: ${new Set(ledger.map((r) => r.country).filter(Boolean)).size}`);

  // Write ledger (before Strapi calls so the data is safe).
  fs.writeFileSync(LEDGER_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), payouts: ledger }, null, 2));
  console.log(`Ledger written → ${LEDGER_PATH}`);

  // 3. Delete existing payouts (use documentId for delete)
  let page = 1;
  let deletedCount = 0;
  while (true) {
    const r = await api(`payouts?pagination[page]=${page}&pagination[pageSize]=100`);
    const j = await r.json();
    if (!j.data || j.data.length === 0) break;
    for (const p of j.data) {
      await api(`payouts/${p.documentId}`, { method: "DELETE" });
      deletedCount++;
    }
    if (page >= (j.meta?.pagination?.pageCount ?? 1)) break;
    page++;
  }
  console.log(`Deleted ${deletedCount} existing payouts.`);

  // 4. Upload certs + create payouts

  let created = 0;
  let skipped = 0;
  for (let i = 0; i < ledger.length; i++) {
    const rec = ledger[i];
    const title = rec.firstName && rec.country ? `${rec.firstName} · ${rec.country}` : rec.firstName || rec.name;
    const body = { data: { title, amount: rec.amountLabel } };

    if (rec.certFile) {
      // Upload the cert image, attach to this payout.
      const filePath = path.join(CERT_DIR, rec.certFile);
      const form = new FormData();
      const fileBuf = fs.readFileSync(filePath);
      const file = new Blob([fileBuf]);
      const name = `${rec.ref}_${rec.certFile}`;
      form.append("files", file, name);
      form.append("fileInfo", JSON.stringify({ name }));
      const upRes = await api("upload", { method: "POST", form });
      if (upRes.ok) {
        const up = await upRes.json();
        const fileId = up[0]?.id;
        if (fileId) {
          body.data.image = fileId;
          rec.imageDocumentId = up[0].documentId;
        }
      } else {
        console.warn(`  upload failed for ${rec.ref}: ${upRes.status}`);
      }
    } else {
      skipped++;
    }

    const res = await api("payouts?status=published", { method: "POST", body });
    if (res.status === 201) {
      created++;
      if (i % 25 === 0 || i === ledger.length - 1) console.log(`  created ${i + 1}/${ledger.length} (${rec.ref})`);
    } else {
      const errText = await res.text();
      console.warn(`  create failed ${rec.ref}: ${res.status} ${errText.slice(0, 200)}`);
      if (!rec.imageDocumentId) {
        console.log("    retrying without image…");
        const retry = await api("payouts?status=published", { method: "POST", body: { data: { title, amount: rec.amountLabel } } });
        if (retry.status === 201) {
          created++;
          skipped++;
          rec.display = false;
        }
      }
    }
    // Keep a light throttle.
    if (i % 10 === 9) await sleep(150);
  }

  fs.writeFileSync(LEDGER_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), payouts: ledger }, null, 2));
  console.log(`\nDone. Created ${created} payouts (${skipped} without cert image). Ledger updated.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
