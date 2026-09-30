/**
 * AI Provider Abstraction Layer for WorkAI.
 * 
 * Supports OpenAI, Google Gemini, and Anthropic.
 * Adheres to critical prompt rules:
 * - If an external API key is not configured, fails gracefully and clearly
 *   states that the provider is not configured.
 * - NEVER returns fake AI-generated output pretending it came from a real provider.
 * - Logs failures and can attempt configured fallback provider.
 * - Server-side only; never exposes secrets to the browser.
 */

export interface AIProviderOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface AIProviderResult {
  text: string;
  provider: string;
  model: string;
  tokensUsed: number;
  latencyMs: number;
}

export interface AIProvider {
  name: string;
  isConfigured(): boolean;
  generateText(prompt: string, options?: AIProviderOptions): Promise<AIProviderResult>;
  estimateUsage(inputTokens: number, outputTokens: number, model?: string): { estimatedCostUSD: number };
  getModelInfo(): { defaultModel: string; supportedModels: string[] };
}

export class ProviderConfigurationError extends Error {
  constructor(providerName: string) {
    super(`AI generation is unavailable because provider '${providerName}' is not configured with an API key.`);
    this.name = "ProviderConfigurationError";
  }
}

export class ProviderExecutionError extends Error {
  constructor(providerName: string, message: string) {
    super(`AI service error from '${providerName}': ${message}`);
    this.name = "ProviderExecutionError";
  }
}
