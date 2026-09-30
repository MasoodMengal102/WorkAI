import { ToolItem } from "@/types";
import { dataService } from "@/lib/db";

export interface FinderQueryOptions {
  query?: string;
  category?: string;
  pricingStatus?: string; // FREE, FREEMIUM, FREE_TRIAL, PAID
  platform?: string; // Browser, Desktop, Mobile, API
  commercialUseOnly?: boolean;
  apiRequired?: boolean;
  experienceLevel?: "Beginner" | "Advanced" | "All";
}

export interface RecommendationMatch {
  tool: ToolItem;
  score: number;
  matchReasons: string[];
  explanation: string;
}

/**
 * Transparent, Explainable Recommendation Engine for AI Finder.
 * Adheres to Requirement 15 & 16:
 * - Transparent scoring based on verified factual metadata.
 * - Affiliate status does NOT influence ranking.
 * - Explanations use objective language: "Suitable for...", "Good option for...", "Useful when..."
 */
export async function runAIFinder(options: FinderQueryOptions): Promise<RecommendationMatch[]> {
  const allTools = await dataService.getTools();
  const rawQuery = (options.query || "").toLowerCase().trim();
  const queryTokens = rawQuery.split(/\s+/).filter((t) => t.length > 2);

  const scoredMatches: RecommendationMatch[] = [];

  for (const tool of allTools) {
    let score = 0;
    const matchReasons: string[] = [];

    // Filter checks
    if (options.category && options.category !== "all" && tool.category !== options.category) {
      continue;
    }

    if (options.pricingStatus && options.pricingStatus !== "all") {
      if (options.pricingStatus === "FREE" && tool.pricingStatus !== "FREE") {
        continue;
      }
      if (options.pricingStatus === "FREEMIUM" && tool.pricingStatus !== "FREEMIUM" && tool.pricingStatus !== "FREE") {
        continue;
      }
      if (options.pricingStatus === "PAID" && tool.pricingStatus !== "PAID") {
        continue;
      }
    }

    if (options.platform && options.platform !== "all") {
      if (!tool.platforms.map((p) => p.toLowerCase()).includes(options.platform.toLowerCase())) {
        continue;
      }
    }

    if (options.commercialUseOnly) {
      if (!tool.commercialUse.toLowerCase().includes("verified")) {
        continue;
      }
      matchReasons.push("Verified commercial usage rights");
      score += 15;
    }

    if (options.apiRequired) {
      if (!tool.apiAvailability) {
        continue;
      }
      matchReasons.push("Developer API access available");
      score += 15;
    }

    // Keyword & Token Matching
    const corpus = `${tool.name} ${tool.description} ${tool.category} ${tool.subcategory || ""} ${tool.features.join(" ")} ${tool.useCases.join(" ")}`.toLowerCase();

    let queryMatchCount = 0;
    for (const token of queryTokens) {
      if (corpus.includes(token)) {
        queryMatchCount++;
      }
    }

    if (queryTokens.length > 0) {
      if (queryMatchCount === 0 && !options.category) {
        // No match to search tokens and no specific category filter
        continue;
      }
      score += queryMatchCount * 12;
      if (queryMatchCount >= 2) {
        matchReasons.push(`Matches search terms (${queryMatchCount} matches)`);
      }
    }

    // Pricing Preference Scoring
    if (rawQuery.includes("free")) {
      if (tool.pricingStatus === "FREE") {
        score += 25;
        matchReasons.push("100% verified free tier");
      } else if (tool.pricingStatus === "FREEMIUM") {
        score += 18;
        matchReasons.push("Verified freemium tier with regular free credits");
      }
    }

    // Verification Freshness
    if (tool.verificationStatus === "VERIFIED") {
      score += 10;
      matchReasons.push("Recently verified by WorkAI editorial desk");
    }

    // Platform Preference
    if (rawQuery.includes("browser") || rawQuery.includes("web")) {
      if (tool.platforms.includes("Browser")) {
        score += 10;
        matchReasons.push("Runs directly in your web browser");
      }
    }
    if (rawQuery.includes("mobile") || rawQuery.includes("phone")) {
      if (tool.platforms.includes("Mobile")) {
        score += 10;
        matchReasons.push("Supports mobile devices");
      }
    }

    // Craft objective, non-hallucinatory explanation
    const reasonsSummary = matchReasons.length > 0 ? matchReasons.slice(0, 2).join(" and ") : "its verified capabilities in this category";
    const explanation = `Good option for ${tool.useCases[0] || tool.category} because it supports ${reasonsSummary}.`;

    scoredMatches.push({
      tool,
      score,
      matchReasons,
      explanation,
    });
  }

  // Sort strictly by transparent relevance score (never by affiliate status)
  return scoredMatches.sort((a, b) => b.score - a.score);
}
