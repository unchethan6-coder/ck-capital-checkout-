/**
 * Help-centre search and instant answers.
 *
 * Everything runs in the browser against the imported articles: no model, no
 * API key and no per-question cost. An "answer" is the passage of a published
 * article that best matches the question, quoted as written, so it cannot
 * state a rule the help centre does not.
 */

import type { Block, HelpArticle } from "./types";

const STOPWORDS = new Set(
  ("a an and are as at be been but by can could did do does for from had has have how i if in into is it its " +
    "me my of on or our should so than that the their them then there these they this to us was we were what " +
    "when where which who why will with would you your about any get got ck prop firm please tell " +
    "long take takes much many does work works happen happens need").split(" ")
);

/** Words traders use for the same thing the articles call something else. */
const SYNONYMS: Record<string, string[]> = {
  withdraw: ["payout", "paid", "reward"],
  withdrawal: ["payout", "paid", "reward"],
  payout: ["withdrawal", "paid", "reward"],
  payment: ["payout", "paid"],
  money: ["payout", "paid"],
  dd: ["drawdown", "loss"],
  drawdown: ["loss", "limit"],
  ea: ["expert", "advisor", "bot"],
  bot: ["expert", "advisor", "ea"],
  robot: ["expert", "advisor", "ea"],
  kyc: ["identity", "verification"],
  verify: ["kyc", "identity", "verification"],
  id: ["kyc", "identity"],
  country: ["countries", "restricted"],
  banned: ["restricted", "prohibited", "breach"],
  allowed: ["permitted", "prohibited", "restricted"],
  refund: ["refundable"],
  referral: ["affiliate", "commission"],
  commission: ["affiliate"],
  weekend: ["holding", "overnight"],
  hedge: ["hedging"],
  copy: ["copier", "copying"],
  vpn: ["vps", "ip"],
  scale: ["scaling"],
  split: ["profit"],
  mt5: ["metatrader", "platform"],
  platform: ["platforms", "metatrader", "tradelocker"],
};

function stem(word: string): string {
  if (word.length > 5 && word.endsWith("ing")) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.length > 4 && word.endsWith("ed")) return word.slice(0, -2);
  if (word.length > 4 && word.endsWith("es")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

function words(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9%$]+/g, " ").split(" ").filter(Boolean);
}

function tokens(text: string): string[] {
  return words(text).filter((w) => !STOPWORDS.has(w)).map(stem);
}

function blockText(b: Block): string {
  if (b.type === "p" || b.type === "h") return b.runs.map((r) => (r.br ? " " : r.t)).join("");
  if (b.type === "list") return b.items.map((item) => item.map(blockText).join(" ")).join(" ");
  if (b.type === "table") return b.rows.map((row) => row.map((cell) => cell.map(blockText).join(" ")).join(" ")).join(" ");
  return b.text;
}

interface Doc {
  article: HelpArticle;
  title: Map<string, number>;
  body: Map<string, number>;
  length: number;
  /** Token counts per top-level block, for picking the passage to quote. */
  blocks: Map<string, number>[];
  chars: number[];
}

export interface HelpIndex {
  docs: Doc[];
  /** Number of articles containing each term. */
  df: Map<string, number>;
  avgLength: number;
}

function count(list: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const t of list) m.set(t, (m.get(t) ?? 0) + 1);
  return m;
}

export function buildIndex(articles: HelpArticle[]): HelpIndex {
  const df = new Map<string, number>();
  const docs = articles.map((article) => {
    const texts = article.blocks.map(blockText);
    const blocks = texts.map((t) => count(tokens(t)));
    const title = count(tokens(article.title));
    const body = count(tokens(texts.join(" ")));
    for (const term of new Set([...title.keys(), ...body.keys()])) df.set(term, (df.get(term) ?? 0) + 1);
    let length = 0;
    for (const n of body.values()) length += n;
    return { article, title, body, length, blocks, chars: texts.map((t) => t.length) };
  });
  const avgLength = docs.reduce((sum, d) => sum + d.length, 0) / Math.max(docs.length, 1);
  return { docs, df, avgLength };
}

export interface HelpAnswer {
  article: HelpArticle;
  /** Blocks of the article to quote, as [start, end). */
  start: number;
  end: number;
  /** True when the quote is the whole article. */
  complete: boolean;
}

export interface HelpSearchResult {
  answer: HelpAnswer | null;
  articles: HelpArticle[];
}

const TITLE_WEIGHT = 3;
const K1 = 1.4;
const B = 0.6;
/** Collections that answer a narrow audience; they should not win a general question. */
const NICHE: Record<string, string> = { affiliates: "affiliate", giveaways: "giveaway" };
/** A quote longer than this is trimmed to the best-matching passage. */
const MAX_ANSWER_CHARS = 700;

interface QueryTerm {
  /** The term as typed plus anything that should count as the same word. */
  variants: string[];
}

function queryTerms(query: string, index: HelpIndex): QueryTerm[] {
  const raw = words(query).filter((w) => !STOPWORDS.has(w));
  return raw.map((word, i) => {
    const variants = new Set([stem(word)]);
    for (const syn of SYNONYMS[word] ?? SYNONYMS[stem(word)] ?? []) variants.add(stem(syn));
    // The last word may still be mid-typing, so let it match by prefix.
    if (i === raw.length - 1 && word.length >= 3) {
      let added = 0;
      for (const term of index.df.keys()) {
        if (added >= 12) break;
        if (term.startsWith(word) && !variants.has(term)) {
          variants.add(term);
          added++;
        }
      }
    }
    return { variants: [...variants] };
  });
}

export function searchHelp(query: string, index: HelpIndex, limit = 6): HelpSearchResult {
  const terms = queryTerms(query, index);
  if (terms.length === 0) return { answer: null, articles: [] };

  const n = index.docs.length;
  const idf = (term: string) => {
    const df = index.df.get(term) ?? 0;
    return Math.log(1 + (n - df + 0.5) / (df + 0.5));
  };

  const asked = new Set(terms.flatMap((t) => t.variants));
  const scored = index.docs
    .map((doc) => {
      let score = 0;
      let matched = 0;
      let titleMatched = 0;
      for (const { variants } of terms) {
        // A typed word and its synonyms are one concept: count the best of them once.
        let best = 0;
        let inTitle = false;
        variants.forEach((term, v) => {
          const tf = (doc.body.get(term) ?? 0) + TITLE_WEIGHT * (doc.title.get(term) ?? 0);
          if (!tf) return;
          const norm = (tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * doc.length) / index.avgLength));
          // Synonyms and prefix guesses count for less than the word itself.
          best = Math.max(best, idf(term) * norm * (v === 0 ? 1 : 0.6));
          if (doc.title.has(term)) inTitle = true;
        });
        if (best > 0) matched++;
        if (inTitle) titleMatched++;
        score += best;
      }
      // Prefer articles that cover the whole question over ones that repeat one word.
      const coverage = matched / terms.length;
      // …and ones whose title is the question over ones that merely mention it.
      const titleCoverage = titleMatched / Math.max(doc.title.size, 1);
      const niche = NICHE[doc.article.collection];
      const audience = niche && !asked.has(niche) ? 0.7 : 1;
      return {
        doc,
        score: score * (0.4 + 0.6 * coverage) * (1 + 0.5 * titleCoverage) * audience,
        coverage,
        titleCoverage,
        titleMatched,
      };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored[0];
  // One word found only in passing is a mention, not an answer.
  const confident = top && top.coverage >= 0.5 && (top.titleMatched >= 1 || (terms.length > 1 && top.coverage >= 0.6));

  return {
    // When the question is the article's own title, the article opens with the answer.
    answer: confident ? pickPassage(top.doc, terms, idf, top.titleCoverage >= 0.6) : null,
    articles: scored.slice(0, limit).map((s) => s.doc.article),
  };
}

function pickPassage(doc: Doc, terms: QueryTerm[], idf: (t: string) => number, fromTop: boolean): HelpAnswer {
  const { article, blocks, chars } = doc;
  const total = chars.reduce((a, b) => a + b, 0);
  if (total <= MAX_ANSWER_CHARS) return { article, start: 0, end: blocks.length, complete: true };

  let best = 0;
  let bestScore = -1;
  blocks.forEach((counts, i) => {
    if (fromTop || article.blocks[i].type === "h") return;
    let score = 0;
    for (const { variants } of terms) {
      let hit = 0;
      for (const term of variants) if (counts.has(term)) hit = Math.max(hit, idf(term));
      score += hit;
    }
    // Earlier passages win ties: articles lead with the direct answer.
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  });

  let start = best;
  let end = best + 1;
  // Keep the heading the passage sits under, and the sentence that introduces a list or table.
  const kind = (i: number) => article.blocks[i]?.type;
  if ((kind(best) === "list" || kind(best) === "table") && kind(best - 1) === "p") start = best - 1;
  if (kind(start - 1) === "h") start -= 1;
  let size = chars.slice(start, end).reduce((a, b) => a + b, 0);
  // A lead-in line ("The rules are:") is no answer without what follows it.
  while (end < blocks.length && kind(end) !== "h" && size + chars[end] <= MAX_ANSWER_CHARS) {
    size += chars[end];
    end++;
  }
  const last = article.blocks[end - 1];
  const leadsIn = last.type === "h" || (last.type === "p" && /:\s*$/.test(last.runs.at(-1)?.t ?? ""));
  if (leadsIn && end < blocks.length) end++;

  return { article, start, end, complete: start === 0 && end === blocks.length };
}
