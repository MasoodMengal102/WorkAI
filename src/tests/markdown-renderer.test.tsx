import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  MarkdownRenderer,
  InlineMarkdown,
  extractHeadingAnchor,
  stripAnchorSyntax,
} from "@/components/content/MarkdownRenderer";
import { GUIDES } from "@/data/guides";

describe("MarkdownRenderer Unit & Integration Tests", () => {
  describe("Anchor & Syntax Extraction", () => {
    it("should extract custom anchor IDs and clean heading text", () => {
      const { cleanText, anchorId } = extractHeadingAnchor(
        "1. The Modern AI YouTube Workflow {#modern-workflow}"
      );
      expect(cleanText).toBe("1. The Modern AI YouTube Workflow");
      expect(anchorId).toBe("modern-workflow");
    });

    it("should generate fallback slug ID when custom anchor is absent", () => {
      const { cleanText, anchorId } = extractHeadingAnchor("Topic Validation with Real Data");
      expect(cleanText).toBe("Topic Validation with Real Data");
      expect(anchorId).toBe("topic-validation-with-real-data");
    });

    it("should strip anchor syntax from general text", () => {
      expect(stripAnchorSyntax("Check out this section {#section-1} for details.")).toBe(
        "Check out this section for details."
      );
    });
  });

  describe("HTML & Rich Formatting Rendering", () => {
    it("should render headings without showing raw ## or ### or {#anchor}", () => {
      const markdown = `### 1. ATS Reality {#ats-reality}\n\nSome introductory text.`;
      const { container } = render(<MarkdownRenderer content={markdown} />);

      // Ensure no raw syntax is visible in text content
      expect(container.textContent).not.toContain("###");
      expect(container.textContent).not.toContain("{#ats-reality}");
      expect(container.textContent).toContain("1. ATS Reality");

      // Verify the element has the proper id for TOC navigation
      const heading = container.querySelector("#ats-reality");
      expect(heading).not.toBeNull();
      expect(heading?.tagName.toLowerCase()).toBe("h2"); // normalized depth 3 to h2
    });

    it("should render bold, italic, and inline code without raw markers", () => {
      const markdown = `This is **bold text**, *italic text*, and \`inline code\`.`;
      const { container } = render(<MarkdownRenderer content={markdown} />);

      expect(container.textContent).not.toContain("**");
      expect(container.textContent).not.toContain("`");

      const strongEl = container.querySelector("strong");
      expect(strongEl?.textContent).toBe("bold text");

      const emEl = container.querySelector("em");
      expect(emEl?.textContent).toBe("italic text");

      const codeEl = container.querySelector("code");
      expect(codeEl?.textContent).toBe("inline code");
    });

    it("should render bullet lists and numbered lists as HTML lists", () => {
      const markdown = `
- Bullet item 1
- Bullet item 2

1. Numbered item 1
2. Numbered item 2
`;
      const { container } = render(<MarkdownRenderer content={markdown} />);

      const ul = container.querySelector("ul");
      expect(ul).not.toBeNull();
      const ulItems = ul?.querySelectorAll("li");
      expect(ulItems?.length).toBe(2);
      expect(ulItems?.[0].textContent).toBe("Bullet item 1");

      const ol = container.querySelector("ol");
      expect(ol).not.toBeNull();
      const olItems = ol?.querySelectorAll("li");
      expect(olItems?.length).toBe(2);
      expect(olItems?.[0].textContent).toBe("Numbered item 1");
    });

    it("should render links and external link icons", () => {
      const markdown = `Visit [WorkAI Guides](/guides) or [OpenAI](https://openai.com).`;
      const { container } = render(<MarkdownRenderer content={markdown} />);

      const internalLink = container.querySelector('a[href="/guides"]');
      expect(internalLink).not.toBeNull();
      expect(internalLink?.textContent).toBe("WorkAI Guides");

      const externalLink = container.querySelector('a[href="https://openai.com"]');
      expect(externalLink).not.toBeNull();
      expect(externalLink?.getAttribute("target")).toBe("_blank");
      expect(externalLink?.getAttribute("rel")).toContain("noopener");
    });

    it("should render blockquotes properly", () => {
      const markdown = `> *Prompt:* 'Act as an expert biology professor.'`;
      const { container } = render(<MarkdownRenderer content={markdown} />);

      const blockquote = container.querySelector("blockquote");
      expect(blockquote).not.toBeNull();
      expect(blockquote?.textContent).toContain("Prompt: 'Act as an expert biology professor.'");
    });

    it("should render code blocks with language indicator and copy button", () => {
      const markdown = `\`\`\`typescript\nconst greeting = "Hello World";\nconsole.log(greeting);\n\`\`\``;
      const { container } = render(<MarkdownRenderer content={markdown} />);

      expect(container.textContent).not.toContain("```");
      expect(container.textContent).toContain("typescript");
      expect(container.textContent).toContain('const greeting = "Hello World";');

      const copyBtn = screen.getByRole("button", { name: /copy code to clipboard/i });
      expect(copyBtn).not.toBeNull();
    });

    it("should render responsive tables with headers and rows", () => {
      const markdown = `
| Tool Name | Pricing | Category |
| :--- | :---: | ---: |
| ChatGPT | Freemium | Chatbot |
| Claude | Freemium | Writing |
`;
      const { container } = render(<MarkdownRenderer content={markdown} />);

      const table = container.querySelector("table");
      expect(table).not.toBeNull();

      const headers = table?.querySelectorAll("th");
      expect(headers?.length).toBe(3);
      expect(headers?.[0].textContent).toBe("Tool Name");

      const rows = table?.querySelectorAll("tbody tr");
      expect(rows?.length).toBe(2);
      expect(rows?.[0].textContent).toContain("ChatGPT");
      expect(rows?.[1].textContent).toContain("Claude");
    });

    it("InlineMarkdown should parse rich text without wrapping <p> tag", () => {
      const text = `Transform duties with **quantifiable metrics** and \`STAR\` format.`;
      const { container } = render(<InlineMarkdown text={text} />);

      expect(container.querySelector("p")).toBeNull();
      expect(container.querySelector("strong")?.textContent).toBe("quantifiable metrics");
      expect(container.querySelector("code")?.textContent).toBe("STAR");
      expect(container.textContent).not.toContain("**");
    });
  });

  describe("Real Guides Integrity & Zero Raw Markdown Guarantee", () => {
    it("should render every guide from GUIDES without leaking raw ##, ###, or {#...}", () => {
      for (const guide of GUIDES) {
        const { container } = render(<MarkdownRenderer content={guide.content} />);

        // Guarantee no raw markdown header tokens
        expect(container.textContent).not.toMatch(/(^|\s)###?\s/);
        // Guarantee no raw anchor syntax like {#anchor-name}
        expect(container.textContent).not.toMatch(/\{#[a-zA-Z0-9_-]+\}/);

        // Guarantee Table of Contents anchors exist on elements
        for (const tocItem of guide.tableOfContents) {
          const anchorEl = container.querySelector(`#${tocItem.anchor}`);
          expect(
            anchorEl,
            `Anchor #${tocItem.anchor} for guide "${guide.title}" should exist in rendered DOM`
          ).not.toBeNull();
        }
      }
    });
  });
});
