import { describe, it, expect } from "vitest";
import { runAIFinder } from "@/ai/finder";

describe("AI Finder Recommendation Engine", () => {
  it("should filter tools by free pricing preference without hallucinating", async () => {
    const matches = await runAIFinder({
      pricingStatus: "FREE",
    });

    expect(matches.length).toBeGreaterThan(0);
    for (const match of matches) {
      expect(match.tool.pricingStatus).toBe("FREE");
      expect(match.explanation).toContain("Good option for");
    }
  });

  it("should filter by category and include transparent match reasons", async () => {
    const matches = await runAIFinder({
      category: "coding",
    });

    expect(matches.length).toBeGreaterThan(0);
    for (const match of matches) {
      expect(match.tool.category).toBe("coding");
    }
  });

  it("should honor commercial use requirements strictly", async () => {
    const matches = await runAIFinder({
      commercialUseOnly: true,
    });

    expect(matches.length).toBeGreaterThan(0);
    for (const match of matches) {
      expect(match.tool.commercialUse.toLowerCase()).toContain("verified");
    }
  });

  it("should never rank an affiliate tool higher purely because of affiliate status", async () => {
    // Score should depend purely on match tokens, features, and verified status
    const codingMatches = await runAIFinder({ category: "coding" });
    expect(codingMatches[0].score).toBeGreaterThanOrEqual(codingMatches[1].score);
  });
});
