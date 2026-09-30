"use client";

import React, { useState } from "react";
import Link from "next/link";
import { marked, Tokens } from "marked";
import { Check, Copy, ExternalLink } from "lucide-react";

/**
 * Utility to extract custom anchor ID from heading text like:
 * "1. The Modern AI YouTube Workflow {#modern-workflow}"
 * Returns clean text and the anchor ID.
 */
export function extractHeadingAnchor(text: string): { cleanText: string; anchorId?: string } {
  const match = text.match(/\s*\{#([a-zA-Z0-9_-]+)\}\s*$/);
  if (match) {
    const anchorId = match[1];
    const cleanText = text.replace(/\s*\{#([a-zA-Z0-9_-]+)\}\s*$/, "").trim();
    return { cleanText, anchorId };
  }
  const cleanText = text.replace(/\s*\{#[a-zA-Z0-9_-]+\}\s*/g, " ").trim();
  const fallbackId = cleanText
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return { cleanText, anchorId: fallbackId || undefined };
}

/**
 * Strips any stray {#anchor} syntax from general text without trimming normal whitespace
 */
export function stripAnchorSyntax(text: string): string {
  return text.replace(/\s*\{#[a-zA-Z0-9_-]+\}/g, "");
}

/**
 * Interactive Code Block Component with copy-to-clipboard functionality
 */
export function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanLang = (language || "code").toLowerCase();

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
        <span className="font-semibold uppercase tracking-wider text-[11px] text-indigo-400">
          {cleanLang}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans transition-colors cursor-pointer"
          aria-label="Copy code to clipboard"
          type="button"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-200 selection:bg-indigo-600 selection:text-white">
        <code>{code}</code>
      </pre>
    </div>
  );
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
  allowH1?: boolean;
}

/**
 * Main Rich Markdown Content Renderer
 * Transforms raw markdown into production-grade, accessible, responsive HTML/UI.
 */
export function MarkdownRenderer({ content, className = "", allowH1 = false }: MarkdownRendererProps) {
  if (!content || typeof content !== "string") {
    return null;
  }

  // Parse markdown into tokens
  const tokens = marked.lexer(content, { gfm: true, breaks: false });

  // Calculate highest heading depth present in document to normalize hierarchy
  let minDepth = 6;
  tokens.forEach((t) => {
    if (t.type === "heading" && t.depth < minDepth) {
      minDepth = t.depth;
    }
  });

  const renderInline = (inlineTokens?: Tokens.Generic[]): React.ReactNode => {
    if (!inlineTokens || inlineTokens.length === 0) return null;

    return inlineTokens.map((token, idx) => {
      switch (token.type) {
        case "strong":
          return (
            <strong key={idx} className="font-bold text-slate-900 dark:text-white">
              {renderInline(token.tokens)}
            </strong>
          );

        case "em":
          return (
            <em key={idx} className="italic text-slate-800 dark:text-slate-200">
              {renderInline(token.tokens)}
            </em>
          );

        case "codespan":
          return (
            <code
              key={idx}
              className="px-1.5 py-0.5 rounded-md font-mono text-xs sm:text-[13px] bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200/80 dark:border-slate-700/80 font-medium"
            >
              {token.text}
            </code>
          );

        case "del":
          return (
            <del key={idx} className="line-through text-slate-400">
              {renderInline(token.tokens)}
            </del>
          );

        case "link": {
          const isInternal = token.href.startsWith("/") || token.href.startsWith("#");
          if (isInternal) {
            return (
              <Link
                key={idx}
                href={token.href}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline decoration-indigo-300 underline-offset-2 transition-colors"
              >
                {renderInline(token.tokens) || token.text}
              </Link>
            );
          }
          return (
            <a
              key={idx}
              href={token.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline decoration-indigo-300 underline-offset-2 transition-colors inline-flex items-center gap-0.5"
            >
              <span>{renderInline(token.tokens) || token.text}</span>
              <ExternalLink className="w-3 h-3 inline opacity-70 ml-0.5" />
            </a>
          );
        }

        case "image":
          return (
            <img
              key={idx}
              src={token.href}
              alt={token.text || ""}
              title={token.title || undefined}
              className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-md max-w-full h-auto inline-block my-2"
              loading="lazy"
            />
          );

        case "br":
          return <br key={idx} />;

        case "text": {
          const cleaned = stripAnchorSyntax(token.text);
          return (
            <React.Fragment key={idx}>
              {token.tokens ? renderInline(token.tokens) : cleaned}
            </React.Fragment>
          );
        }

        default:
          return <React.Fragment key={idx}>{stripAnchorSyntax(token.raw || token.text || "")}</React.Fragment>;
      }
    });
  };

  const renderBlock = (token: Tokens.Generic, index: number): React.ReactNode => {
    switch (token.type) {
      case "heading": {
        const { cleanText, anchorId } = extractHeadingAnchor(token.text);

        // Normalize heading level:
        // If document starts with depth 3 (e.g. `### 1. ...`), map 3 -> H2, 4 -> H3, etc.
        // If document starts with depth 2 (e.g. `## ...`), map 2 -> H2, 3 -> H3, etc.
        // If allowH1 is true, depth 1 maps to H1.
        let targetLevel = token.depth;
        if (!allowH1) {
          if (minDepth >= 3) {
            // Depth 3 becomes H2 (major section), depth 4 becomes H3 (subsection)
            targetLevel = token.depth - (minDepth - 2);
          } else if (token.depth === 1) {
            targetLevel = 2;
          }
        }
        targetLevel = Math.max(1, Math.min(4, targetLevel));

        const anchorLink = anchorId ? (
          <a
            href={`#${anchorId}`}
            className="opacity-0 group-hover:opacity-100 text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 transition-opacity ml-2 text-sm sm:text-base font-normal select-none"
            aria-label={`Direct link to ${cleanText}`}
          >
            #
          </a>
        ) : null;

        // Clean tokens of the heading to remove anchor from rendered children
        const headingInline = token.tokens ? (
          token.tokens.map((t: Tokens.Generic, i: number) => {
            if (t.type === "text") {
              return <React.Fragment key={i}>{stripAnchorSyntax(t.text)}</React.Fragment>;
            }
            return renderInline([t]);
          })
        ) : (
          cleanText
        );

        if (targetLevel === 1) {
          return (
            <h1
              key={index}
              id={anchorId}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mt-10 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800 tracking-tight scroll-mt-24 group flex items-center"
            >
              <span>{headingInline}</span>
              {anchorLink}
            </h1>
          );
        }

        if (targetLevel === 2) {
          return (
            <h2
              key={index}
              id={anchorId}
              className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight scroll-mt-24 group flex items-center border-b border-slate-100 dark:border-slate-800/80 pb-2.5"
            >
              <span>{headingInline}</span>
              {anchorLink}
            </h2>
          );
        }

        if (targetLevel === 3) {
          return (
            <h3
              key={index}
              id={anchorId}
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-7 mb-3 tracking-tight scroll-mt-24 group flex items-center"
            >
              <span>{headingInline}</span>
              {anchorLink}
            </h3>
          );
        }

        return (
          <h4
            key={index}
            id={anchorId}
            className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mt-5 mb-2 scroll-mt-24 group flex items-center"
          >
            <span>{headingInline}</span>
            {anchorLink}
          </h4>
        );
      }

      case "paragraph":
        return (
          <p key={index} className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed my-4 font-normal">
            {renderInline(token.tokens)}
          </p>
        );

      case "list": {
        const ListTag = token.ordered ? "ol" : "ul";
        const listClass = token.ordered
          ? "my-4 space-y-2.5 list-decimal list-outside pl-6 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed marker:text-indigo-600 dark:marker:text-indigo-400 marker:font-semibold"
          : "my-4 space-y-2.5 list-disc list-outside pl-6 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed marker:text-indigo-500";

        return (
          <ListTag key={index} start={token.ordered && token.start ? Number(token.start) : undefined} className={listClass}>
            {token.items?.map((item: Tokens.Generic, i: number) => {
              if (item.task) {
                return (
                  <li key={i} className="flex items-start gap-2.5 list-none -ml-6 leading-relaxed">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      readOnly
                      className="mt-1 rounded text-indigo-600 focus:ring-indigo-500 cursor-default"
                    />
                    <span>{renderInline(item.tokens)}</span>
                  </li>
                );
              }
              return (
                <li key={i} className="pl-1 leading-relaxed">
                  {item.tokens ? (
                    item.tokens.map((subToken: Tokens.Generic, subIdx: number) => {
                      if (subToken.type === "text") {
                        return <React.Fragment key={subIdx}>{renderInline(subToken.tokens) || stripAnchorSyntax(subToken.text)}</React.Fragment>;
                      }
                      if (subToken.type === "paragraph") {
                        return <span key={subIdx}>{renderInline(subToken.tokens)}</span>;
                      }
                      return <React.Fragment key={subIdx}>{renderBlock(subToken, subIdx)}</React.Fragment>;
                    })
                  ) : (
                    stripAnchorSyntax(item.text)
                  )}
                </li>
              );
            })}
          </ListTag>
        );
      }

      case "blockquote":
        return (
          <blockquote
            key={index}
            className="my-6 p-4 sm:p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border-l-4 border-indigo-500 text-slate-800 dark:text-slate-200 shadow-sm leading-relaxed text-sm sm:text-base italic"
          >
            {token.tokens?.map((subToken: Tokens.Generic, i: number) => renderBlock(subToken, i))}
          </blockquote>
        );

      case "code":
        return <CodeBlock key={index} code={token.text} language={token.lang} />;

      case "table": {
        const alignClasses = (align?: string | null) => {
          if (align === "center") return "text-center";
          if (align === "right") return "text-right";
          return "text-left";
        };

        return (
          <div key={index} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <table className="w-full text-xs sm:text-sm border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white uppercase font-bold tracking-wider text-[11px]">
                <tr>
                  {token.header?.map((headerCell: Tokens.Generic, hIdx: number) => (
                    <th
                      key={hIdx}
                      className={`p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 ${alignClasses(token.align?.[hIdx])}`}
                    >
                      {renderInline(headerCell.tokens) || headerCell.text}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {token.rows?.map((row: Tokens.Generic[], rIdx: number) => (
                  <tr
                    key={rIdx}
                    className="odd:bg-white even:bg-slate-50/50 dark:odd:bg-slate-900 dark:even:bg-slate-950/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors"
                  >
                    {row.map((cell: Tokens.Generic, cIdx: number) => (
                      <td
                        key={cIdx}
                        className={`p-3.5 sm:p-4 leading-relaxed ${alignClasses(token.align?.[cIdx])}`}
                      >
                        {renderInline(cell.tokens) || cell.text}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case "hr":
        return <hr key={index} className="my-8 border-t border-slate-200 dark:border-slate-800" />;

      case "space":
        return null;

      default:
        if (token.tokens) {
          return <div key={index}>{renderInline(token.tokens)}</div>;
        }
        return (
          <p key={index} className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed my-4">
            {stripAnchorSyntax(token.raw || token.text || "")}
          </p>
        );
    }
  };

  return (
    <div className={`rich-content-renderer max-w-none ${className}`}>
      {tokens.map((token, idx) => renderBlock(token, idx))}
    </div>
  );
}

/**
 * Lightweight Inline Markdown Renderer
 * Parses inline rich text (bold, italic, code, links) without block-level margins or wrapping <p>.
 * Used for short descriptions, table cells, step summaries, etc.
 */
export function InlineMarkdown({ text, className = "" }: { text?: string | null; className?: string }) {
  if (!text || typeof text !== "string") {
    return null;
  }

  // Parse using marked inline lexer
  const tokens = marked.lexer(text, { gfm: true, breaks: false });

  // Extract inline tokens from paragraphs
  const inlineNodes: Tokens.Generic[] = [];
  tokens.forEach((t) => {
    if (t.type === "paragraph" && t.tokens) {
      inlineNodes.push(...t.tokens);
    } else if (t.type === "text") {
      inlineNodes.push(t);
    }
  });

  if (inlineNodes.length === 0) {
    return <span className={className}>{stripAnchorSyntax(text)}</span>;
  }

  return (
    <span className={className}>
      {inlineNodes.map((token, idx) => {
        switch (token.type) {
          case "strong":
            return (
              <strong key={idx} className="font-semibold text-slate-900 dark:text-white">
                {stripAnchorSyntax(token.text)}
              </strong>
            );

          case "em":
            return (
              <em key={idx} className="italic text-slate-800 dark:text-slate-200">
                {stripAnchorSyntax(token.text)}
              </em>
            );

          case "codespan":
            return (
              <code
                key={idx}
                className="px-1.5 py-0.5 rounded-md font-mono text-xs bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200/80 dark:border-slate-700 font-medium"
              >
                {token.text}
              </code>
            );

          case "link": {
            const isInternal = token.href.startsWith("/") || token.href.startsWith("#");
            if (isInternal) {
              return (
                <Link
                  key={idx}
                  href={token.href}
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  {stripAnchorSyntax(token.text)}
                </Link>
              );
            }
            return (
              <a
                key={idx}
                href={token.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                {stripAnchorSyntax(token.text)}
              </a>
            );
          }

          case "text":
          default:
            return <React.Fragment key={idx}>{stripAnchorSyntax(token.text || token.raw || "")}</React.Fragment>;
        }
      })}
    </span>
  );
}
