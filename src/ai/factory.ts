import { AIProvider, AIProviderOptions, AIProviderResult, ProviderConfigurationError } from "./provider";
import { GeminiProvider } from "./gemini";
import { OpenAIProvider } from "./openai";
import { AnthropicProvider } from "./anthropic";
import { dataService } from "@/lib/db";

const providers: Record<string, AIProvider> = {
  gemini: new GeminiProvider(),
  openai: new OpenAIProvider(),
  anthropic: new AnthropicProvider(),
};

/**
 * Returns the currently active provider based on DEFAULT_AI_PROVIDER.
 */
export function getActiveProvider(preferredProvider?: string): AIProvider {
  const chosenName = preferredProvider || process.env.DEFAULT_AI_PROVIDER || "gemini";
  const provider = providers[chosenName.toLowerCase()];
  if (!provider) {
    return providers.gemini;
  }
  return provider;
}

/**
 * Returns all configured providers with active API keys.
 */
export function getConfiguredProviders(): AIProvider[] {
  return Object.values(providers).filter((p) => p.isConfigured());
}

/**
 * Central AI Execution Engine with Failover and Usage Logging:
 * 1. Attempts the preferred/default provider.
 * 2. If it fails due to execution/network error, attempts the next configured provider.
 * 3. If NO providers are configured with valid API keys, fails gracefully with ProviderConfigurationError.
 * 4. Logs token usage and latency securely.
 */
export async function executeAI(
  prompt: string,
  options?: AIProviderOptions & { preferredProvider?: string; endpoint?: string; ipHash?: string }
): Promise<AIProviderResult> {
  const primaryProvider = getActiveProvider(options?.preferredProvider);
  const configuredProviders = getConfiguredProviders();

  if (configuredProviders.length === 0) {
    throw new ProviderConfigurationError(primaryProvider.name);
  }

  // Order providers starting with preferred
  const executionOrder = [
    primaryProvider,
    ...configuredProviders.filter((p) => p.name !== primaryProvider.name),
  ];

  let lastError: Error | null = null;

  for (const provider of executionOrder) {
    if (!provider.isConfigured()) continue;

    try {
      const result = await provider.generateText(prompt, options);

      // Log successful usage asynchronously
      const usage = provider.estimateUsage(Math.ceil(prompt.length / 4), Math.ceil(result.text.length / 4), result.model);
      dataService.recordUsageLog({
        endpoint: options?.endpoint || "ai-generation",
        provider: result.provider,
        model: result.model,
        tokensEstimated: result.tokensUsed,
        costEstimated: usage.estimatedCostUSD,
        status: "SUCCESS",
        latencyMs: result.latencyMs,
        ipHash: options?.ipHash,
      }).catch(() => {});

      return result;
    } catch (err: any) {
      lastError = err;
      // Log failed provider attempt
      dataService.recordUsageLog({
        endpoint: options?.endpoint || "ai-generation",
        provider: provider.name,
        model: options?.model || "default",
        tokensEstimated: 0,
        costEstimated: 0,
        status: `FAILED: ${err.message?.slice(0, 100)}`,
        latencyMs: 0,
        ipHash: options?.ipHash,
      }).catch(() => {});
    }
  }

  throw lastError || new ProviderConfigurationError("All AI Providers");
}
