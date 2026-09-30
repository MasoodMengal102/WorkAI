import { AIProvider, AIProviderOptions, AIProviderResult, ProviderConfigurationError, ProviderExecutionError } from "./provider";

export class AnthropicProvider implements AIProvider {
  name = "anthropic";
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || "";
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  getModelInfo() {
    return {
      defaultModel: "claude-3-5-sonnet-20241022",
      supportedModels: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022"],
    };
  }

  estimateUsage(inputTokens: number, outputTokens: number, model = "claude-3-5-sonnet-20241022"): { estimatedCostUSD: number } {
    const isHaiku = model.includes("haiku");
    const inputCost = (inputTokens / 1_000_000) * (isHaiku ? 0.80 : 3.0);
    const outputCost = (outputTokens / 1_000_000) * (isHaiku ? 4.0 : 15.0);
    return { estimatedCostUSD: Number((inputCost + outputCost).toFixed(6)) };
  }

  async generateText(prompt: string, options?: AIProviderOptions): Promise<AIProviderResult> {
    if (!this.isConfigured()) {
      throw new ProviderConfigurationError("Anthropic");
    }

    const model = options?.model || (process.env.DEFAULT_AI_PROVIDER === "anthropic" && process.env.DEFAULT_AI_MODEL) || "claude-3-5-sonnet-20241022";
    const startTime = Date.now();

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: options?.maxTokens ?? 2048,
          temperature: options?.temperature ?? 0.7,
          system: options?.systemPrompt,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 200)}`);
      }

      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      const latencyMs = Date.now() - startTime;
      const tokensUsed = ((data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)) || Math.ceil((prompt.length + text.length) / 4);

      return {
        text,
        provider: this.name,
        model,
        tokensUsed,
        latencyMs,
      };
    } catch (err: any) {
      throw new ProviderExecutionError("Anthropic", err.message || "Failed to generate response");
    }
  }
}
