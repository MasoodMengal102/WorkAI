import { AIProvider, AIProviderOptions, AIProviderResult, ProviderConfigurationError, ProviderExecutionError } from "./provider";

export class OpenAIProvider implements AIProvider {
  name = "openai";
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "";
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  getModelInfo() {
    return {
      defaultModel: "gpt-4o-mini",
      supportedModels: ["gpt-4o-mini", "gpt-4o"],
    };
  }

  estimateUsage(inputTokens: number, outputTokens: number, model = "gpt-4o-mini"): { estimatedCostUSD: number } {
    // OpenAI gpt-4o-mini rates: ~$0.15 / 1M input tokens, ~$0.60 / 1M output tokens
    const inputCost = (inputTokens / 1_000_000) * (model === "gpt-4o" ? 5.0 : 0.15);
    const outputCost = (outputTokens / 1_000_000) * (model === "gpt-4o" ? 15.0 : 0.60);
    return { estimatedCostUSD: Number((inputCost + outputCost).toFixed(6)) };
  }

  async generateText(prompt: string, options?: AIProviderOptions): Promise<AIProviderResult> {
    if (!this.isConfigured()) {
      throw new ProviderConfigurationError("OpenAI");
    }

    const model = options?.model || (process.env.DEFAULT_AI_PROVIDER === "openai" && process.env.DEFAULT_AI_MODEL) || "gpt-4o-mini";
    const startTime = Date.now();

    const messages: any[] = [];
    if (options?.systemPrompt) {
      messages.push({ role: "system", content: options.systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 2048,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 200)}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";
      const latencyMs = Date.now() - startTime;
      const tokensUsed = data.usage?.total_tokens || Math.ceil((prompt.length + text.length) / 4);

      return {
        text,
        provider: this.name,
        model,
        tokensUsed,
        latencyMs,
      };
    } catch (err: any) {
      throw new ProviderExecutionError("OpenAI", err.message || "Failed to generate response");
    }
  }
}
