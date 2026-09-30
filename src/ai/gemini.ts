import { AIProvider, AIProviderOptions, AIProviderResult, ProviderConfigurationError, ProviderExecutionError } from "./provider";

export class GeminiProvider implements AIProvider {
  name = "gemini";
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || "";
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  getModelInfo() {
    return {
      defaultModel: "gemini-1.5-flash",
      supportedModels: ["gemini-1.5-flash", "gemini-1.5-pro"],
    };
  }

  estimateUsage(inputTokens: number, outputTokens: number, model = "gemini-1.5-flash"): { estimatedCostUSD: number } {
    // Standard Gemini 1.5 Flash rates: ~$0.075 / 1M input tokens, ~$0.30 / 1M output tokens
    const inputCost = (inputTokens / 1_000_000) * (model.includes("pro") ? 3.5 : 0.075);
    const outputCost = (outputTokens / 1_000_000) * (model.includes("pro") ? 10.5 : 0.30);
    return { estimatedCostUSD: Number((inputCost + outputCost).toFixed(6)) };
  }

  async generateText(prompt: string, options?: AIProviderOptions): Promise<AIProviderResult> {
    if (!this.isConfigured()) {
      throw new ProviderConfigurationError("Google Gemini");
    }

    const model = options?.model || process.env.DEFAULT_AI_MODEL || "gemini-1.5-flash";
    const startTime = Date.now();

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${this.apiKey}`;

    const contents: any[] = [];
    if (options?.systemPrompt) {
      contents.push({
        role: "user",
        parts: [{ text: `System Instructions: ${options.systemPrompt}` }],
      });
      contents.push({
        role: "model",
        parts: [{ text: "Understood. I will strictly follow these instructions." }],
      });
    }

    contents.push({
      role: "user",
      parts: [{ text: prompt }],
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: options?.temperature ?? 0.7,
            maxOutputTokens: options?.maxTokens ?? 2048,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 200)}`);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text || "";
      const latencyMs = Date.now() - startTime;
      const tokensUsed = (data.usageMetadata?.totalTokenCount) || Math.ceil((prompt.length + text.length) / 4);

      return {
        text,
        provider: this.name,
        model,
        tokensUsed,
        latencyMs,
      };
    } catch (err: any) {
      throw new ProviderExecutionError("Google Gemini", err.message || "Failed to generate response");
    }
  }
}
