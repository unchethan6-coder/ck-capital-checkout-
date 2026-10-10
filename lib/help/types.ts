/** Shapes written by scripts/import-help-center.mjs into articles.json. */

export interface Run {
  t: string;
  b?: boolean;
  i?: boolean;
  href?: string;
  br?: boolean;
}

export type Block =
  | { type: "p"; runs: Run[] }
  | { type: "h"; level: number; runs: Run[] }
  | { type: "list"; ordered: boolean; items: Block[][] }
  | { type: "table"; rows: Block[][][] }
  | { type: "button"; text: string; href: string };

export interface HelpArticle {
  slug: string;
  title: string;
  collection: string;
  section: string | null;
  updated: string;
  blocks: Block[];
}

export interface HelpCollection {
  slug: string;
  name: string;
  description: string;
  sections: { name: string | null; articles: string[] }[];
}

export interface HelpData {
  source: string;
  collections: HelpCollection[];
  articles: HelpArticle[];
}
