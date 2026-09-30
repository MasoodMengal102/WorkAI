import { describe, it, expect } from "vitest";
import { analyzeUserGoal } from "@/ai/goal-analyzer";

describe("Deterministic Goal Analyzer & Intent Engine", () => {
  it("should extract video category and map to verified video workflow for YouTube queries", async () => {
    const result = await analyzeUserGoal("I want to create YouTube videos");

    expect(result.category.toLowerCase()).toBe("video");
    expect(result.taskType).toBe("Video Production Pipeline");
    expect(result.workflow.title).toContain("YouTube");
    expect(result.workflow.steps.length).toBeGreaterThan(0);
    expect(result.recommendedTools.length).toBeGreaterThan(0);
    expect(result.freeOptions.length).toBeGreaterThan(0);

    // Verify all tools in freeOptions are truly free or freemium
    for (const tool of result.freeOptions) {
      expect(["FREE", "FREEMIUM"]).toContain(tool.pricingStatus);
    }
  });

  it("should accurately route coding queries to coding tools and workflows", async () => {
    const result = await analyzeUserGoal("I want to learn Python and build web applications");

    expect(result.category.toLowerCase()).toBe("coding");
    expect(result.taskType).toBe("Code Acceleration & Learning");
    expect(result.workflow.title.toLowerCase()).toContain("programming");
    expect(result.recommendedTools.some((t) => t.category === "coding")).toBe(true);
  });

  it("should accurately route career and CV queries", async () => {
    const result = await analyzeUserGoal("I need to build a professional CV for tech jobs");

    expect(result.category.toLowerCase()).toBe("career");
    expect(result.subcategory).toBe("Resume & Career Advancement");
    expect(result.workflow.title.toLowerCase()).toContain("cv");
  });

  it("should provide built-in services and related guides for every goal", async () => {
    const result = await analyzeUserGoal("create faceless video");

    expect(result.builtInServices.length).toBeGreaterThan(0);
    expect(result.workflow.steps.every((s) => s.stepNumber > 0 && s.title.length > 0)).toBe(true);
  });
});
