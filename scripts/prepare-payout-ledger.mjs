import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const certs = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "extracted_certs.json"), "utf8"));
const csvText = fs.readFileSync(path.join(ROOT, "scripts", "payouts.csv"), "utf8");

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
  Botswana: "BW",
  Boswana: "BW",
  Ethiopia: "ET",
  Cambodia: "KH",
  Chile: "CL",
  Slovakia: "SK",
  Slovenia: "SI",
  Fiji: "FJ",
  "Hong Kong": "HK",
  "New Zealand": "NZ",
};

function parseCSV(text) {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const cells = [];
    let cur = "";
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === '"') inQuotes = !inQuotes;
      else if (ch === "," && !inQuotes) {
        cells.push(cur.trim());
        cur = "";
      } else cur += ch;
    }
    cells.push(cur.trim());
    rows.push(cells);
  }
  return rows;
}

const csvRows = parseCSV(csvText);

function cleanAmt(s) {
  if (!s) return 0;
  const n = parseFloat(String(s).replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

function extractCertAmount(c) {
  for (const l of c.lines) {
    const m = l.match(/\$([0-9,]+(?:\.[0-9]{2})?)/);
    if (m) return parseFloat(m[1].replace(/,/g, ""));
  }
  return 0;
}

function cleanStr(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function fmtMoney(n) {
  return `$${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}`;
}

// Map of nicknames / handles to real names and countries
const KNOWN_ALIASES = {
  rybvnks: { name: "Ryshawn Cooper", country: "United States" },
  nicojfc: { name: "Nicolas Jose Fernando Condori", country: "Argentina" },
  meds: { name: "Joe Meddins", country: "United Kingdom" },
  aydemis95: { name: "Onur Aydemis", country: "Denmark" },
  the_mamba_trader: { name: "Adarsh Shitole", country: "India" },
  tm: { name: "Tahir Mahmood", country: "United Kingdom" },
  kavo: { name: "Kavish Badal", country: "Netherlands" },
  ondrejcerny: { name: "Ondřej Černý", country: "Czech Republic" },
  tommyutama: { name: "Tommy Utama Putra", country: "Indonesia" },
  joshuajohn: { name: "Joshua John Cattermole", country: "United Kingdom" },
  pedroangustia: { name: "Pedro Angustia Perez", country: "United Kingdom" },
};

// Build CSV lookup
const csvByAmt = new Map();
csvRows.forEach((r, idx) => {
  const amt = cleanAmt(r[5]);
  if (!csvByAmt.has(amt)) csvByAmt.set(amt, []);
  csvByAmt.get(amt).push({ idx, ref: r[0], date: r[1], name: r[2], email: r[3], country: r[4], amt });
});

const usedCsvIndices = new Set();
const fullLedger = [];

// 1. Process all 211 certificates
certs.forEach((c, i) => {
  const cAmt = extractCertAmount(c);
  const cClean = cleanStr(c.name);
  const alias = KNOWN_ALIASES[cClean];
  
  const amtCands = csvByAmt.get(cAmt) || [];
  let best = null;
  
  // Find cand matching name or alias
  for (const cand of amtCands) {
    if (usedCsvIndices.has(cand.idx)) continue;
    const candClean = cleanStr(cand.name);
    const candFirst = cleanStr(cand.name.split(/\s+/)[0]);
    if (
      candClean.includes(cClean) ||
      cClean.includes(candClean) ||
      candFirst.includes(cClean) ||
      cClean.includes(candFirst) ||
      (alias && candClean.includes(cleanStr(alias.name)))
    ) {
      best = cand;
      break;
    }
  }
  
  if (!best && amtCands.length > 0) {
    // If only one unused candidate with exact amount, pair them
    const unused = amtCands.filter((x) => !usedCsvIndices.has(x.idx));
    if (unused.length === 1) best = unused[0];
  }

  if (best) usedCsvIndices.add(best.idx);

  const rawName = alias?.name || (best ? best.name : c.name.trim());
  const firstName = rawName.split(/\s+/)[0];
  let country = alias?.country || (best ? best.country : "United Kingdom");
  if (country === "Boswana") country = "Botswana";
  const countryCode = COUNTRY_CODES[country] || null;
  const ref = best ? best.ref : `CKP_2026_${String(i + 1).padStart(3, "0")}`;
  const email = best ? best.email : null;
  const date = c.date || (best ? best.date : "2025-06-01");

  fullLedger.push({
    ref,
    name: rawName,
    firstName,
    email,
    country,
    countryCode,
    amount: cAmt,
    amountLabel: fmtMoney(cAmt),
    date,
    challenge: c.challenge || "100K Challenge",
    cost: c.cost || null,
    certFolder: c.folder,
    certFile: c.file,
    certPath: c.path,
    display: true,
  });
});

console.log(`Processed ${fullLedger.length} certificate payouts.`);
console.log(`Used CSV rows: ${usedCsvIndices.size}/${csvRows.length}`);

// 2. Add non-cert CSV rows with display: false
let nonCertCount = 0;
csvRows.forEach((r, idx) => {
  if (!usedCsvIndices.has(idx)) {
    const amt = cleanAmt(r[5]);
    let country = r[4] || "United Kingdom";
    if (country === "Boswana") country = "Botswana";
    const fullName = r[2] || "Trader";
    const firstName = fullName.split(/\s+/)[0];
    fullLedger.push({
      ref: r[0],
      name: fullName,
      firstName,
      email: r[3],
      country,
      countryCode: COUNTRY_CODES[country] || null,
      amount: amt,
      amountLabel: fmtMoney(amt),
      date: r[1],
      challenge: "100K Challenge",
      cost: null,
      certFolder: null,
      certFile: null,
      certPath: null,
      display: false,
    });
    nonCertCount++;
  }
});

console.log(`Added ${nonCertCount} non-cert payouts (display: false).`);
console.log(`Total ledger entries: ${fullLedger.length}`);

const totalCertVol = fullLedger.filter((p) => p.display).reduce((s, p) => s + p.amount, 0);
const totalAllVol = fullLedger.reduce((s, p) => s + p.amount, 0);
console.log(`Cert Volume: ${fmtMoney(totalCertVol)} across ${fullLedger.filter((p) => p.display).length} records`);
console.log(`Total Volume: ${fmtMoney(totalAllVol)} across ${fullLedger.length} records`);

const outPath = path.join(ROOT, "scripts", "seed-data", "prepared_payouts.json");
fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), payouts: fullLedger }, null, 2));
console.log(`Saved prepared ledger to ${outPath}`);
