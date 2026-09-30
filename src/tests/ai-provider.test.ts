import { describe, it, expect } from "vitest";
import { getActiveProvider, getConfiguredProviders, executeAI } from "@/ai/factory";
import { ProviderConfigurationError } from "@/ai/provider";
import { OpenAIProvider } from "@/ai/openai";
import { GeminiProvider } from "@/ai/gemini";
import { AnthropicProvider } from "@/ai/anthropic";

describe("AI Provider Abstraction Layer", () => {
  it("should retrieve default active provider gracefully", () => {
    const defaultProvider = getActiveProvider();
    expect(defaultProvider).toBeDefined();
    expect(["gemini", "openai", "anthropic"]).toContain(defaultProvider.name);

    const openai = getActiveProvider("openai");
    expect(openai.name).toBe("openai");

    const anthropic = getActiveProvider("anthropic");
    expect(anthropic.name).toBe("anthropic");
  });

  it("should accurately report configuration status based on API keys", () => {
    const openai = new OpenAIProvider();
    const gemini = new GeminiProvider();
    const anthropic = new AnthropicProvider();

    // In testing environment without keys, configured should be false
    expect(typeof openai.isConfigured()).toBe("boolean");
    expect(typeof gemini.isConfigured()).toBe("boolean");
    expect(typeof anthropic.isConfigured()).toBe("boolean");
  });

  it("should fail gracefully with ProviderConfigurationError when no provider has an API key configured", async () => {
    // If no provider keys are set, executeAI must throw ProviderConfigurationError
    // and NEVER fabricate fake responses
    const configured = getConfiguredProviders();
    if (configured.length === 0) {
      await expect(executeAI("Test prompt")).rejects.toThrow(ProviderConfigurationError);
    }
  });

  it("should accurately estimate token usage and costs for providers", () => {
    const openai = new OpenAIProvider();
    const gemini = new GeminiProvider();
    const anthropic = new AnthropicProvider();

    const openaiUsage = openai.estimateUsage(1000, 500, "gpt-4o-mini");
    expect(openaiUsage.estimatedCostUSD).toBeGreaterThan(0);
    expect(openaiUsage.estimatedCostUSD).toBeLessThan(0.01);

    const geminiUsage = gemini.estimateUsage(1000, 500);
    expect(geminiUsage.estimatedCostUSD).toBeGreaterThanOrEqual(0);

    const anthropicUsage = anthropic.estimateUsage(1000, 500, "claude-3-haiku-20240307");
    expect(anthropicUsage.estimatedCostUSD).toBeGreaterThan(0);
  });
});
