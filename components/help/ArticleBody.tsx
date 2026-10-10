import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Block, Run } from "@/lib/help/types";

/**
 * Renders imported help-centre blocks.
 *
 * Has no client-only code, so the article page renders it on the server and
 * the search box reuses it for instant answers.
 */

const LINK = "font-semibold text-[#A98BFF] underline decoration-[#A98BFF]/40 underline-offset-4 transition-colors hover:decoration-[#A98BFF]";

function HelpLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href as never} className={className}>
        {children}
      </Link>
    );
  }
  const external = href.startsWith("http");
  return (
    <a href={href} className={className} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}

function Inline({ runs }: { runs: Run[] }) {
  return (
    <>
      {runs.map((run, i) => {
        if (run.br) return <br key={i} />;
        let node: React.ReactNode = run.t;
        if (run.b) node = <strong className="font-semibold text-foreground">{node}</strong>;
        if (run.i) node = <em>{node}</em>;
        if (run.href) node = <HelpLink href={run.href} className={LINK}>{node}</HelpLink>;
        return <Fragment key={i}>{node}</Fragment>;
      })}
    </>
  );
}

const HEADING: Record<number, string> = {
  2: "mt-8 text-xl font-bold md:text-2xl",
  3: "mt-7 text-lg font-bold",
  4: "mt-6 text-base font-bold",
};

function BlockView({ block, compact }: { block: Block; compact?: boolean }) {
  switch (block.type) {
    case "p":
      return <p><Inline runs={block.runs} /></p>;
    case "h": {
      // Article headings sit under the page <h1>, or under the answer card's title.
      const Tag = (compact ? "p" : `h${Math.min(block.level, 4)}`) as "h2";
      return (
        <Tag
          className={cn(
            "font-[family-name:var(--font-jakarta)] text-foreground first:mt-0",
            compact ? "mt-4 text-sm font-bold" : HEADING[block.level] ?? HEADING[4]
          )}
        >
          <Inline runs={block.runs} />
        </Tag>
      );
    }
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className={cn("ml-5 space-y-2", block.ordered ? "list-decimal" : "list-disc", "marker:text-[#A98BFF]/70")}>
          {block.items.map((item, i) => (
            <li key={i} className="space-y-2 pl-1">
              <Blocks blocks={item} compact={compact} />
            </li>
          ))}
        </Tag>
      );
    }
    case "table": {
      const [head, ...body] = block.rows;
      return (
        <div className="overflow-x-auto rounded-xl border border-foreground/10">
          <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-foreground/[0.06]">
                {head.map((cell, i) => (
                  <th key={i} scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                    <Blocks blocks={cell} compact={compact} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, r) => (
                <tr key={r} className="border-t border-foreground/10">
                  {row.map((cell, i) => (
                    <td key={i} className="px-4 py-2.5 align-top">
                      <Blocks blocks={cell} compact={compact} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case "button":
      return (
        <HelpLink
          href={block.href}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {block.text} <ArrowRight size={15} aria-hidden />
        </HelpLink>
      );
  }
}

export function Blocks({ blocks, compact }: { blocks: Block[]; compact?: boolean }) {
  return (
    <>
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} compact={compact} />
      ))}
    </>
  );
}

/** Help content is written in English, so it reads left-to-right in every locale. */
export function ArticleBody({ blocks, compact, className }: { blocks: Block[]; compact?: boolean; className?: string }) {
  return (
    <div
      dir="ltr"
      lang="en"
      className={cn(
        "leading-relaxed text-foreground/70",
        compact ? "space-y-3 text-sm" : "space-y-4 text-[15px]",
        className
      )}
    >
      <Blocks blocks={blocks} compact={compact} />
    </div>
  );
}
