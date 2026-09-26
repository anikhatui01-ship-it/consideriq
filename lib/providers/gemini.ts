import { GoogleGenAI } from "@google/genai";
import {
  AIProvider,
  AIProviderMessage,
  ProviderGenerateOptions,
  ProviderGenerateResult,
} from "./types";

export class GeminiProvider implements AIProvider {
  readonly id = "gemini";
  readonly name = "Google Gemini";
  readonly defaultModel = "gemini-2.5-flash";

  private getClient(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not configured in server environment. Please set GEMINI_API_KEY in .env.local to execute simulations."
      );
    }
    return new GoogleGenAI({ apiKey });
  }

  isConfigured(): boolean {
    return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  }

  async generateResponse(
    prompt: string,
    options?: ProviderGenerateOptions
  ): Promise<ProviderGenerateResult> {
    const client = this.getClient();
    const model = options?.model || this.defaultModel;

    // Build configuration
    const config: Record<string, unknown> = {};
    if (typeof options?.temperature === "number") {
      config.temperature = options.temperature;
    }
    if (typeof options?.maxOutputTokens === "number") {
      config.maxOutputTokens = options.maxOutputTokens;
    }
    if (options?.systemInstruction) {
      config.systemInstruction = options.systemInstruction;
    }
    if (options?.responseJsonSchema) {
      config.responseMimeType = "application/json";
      config.responseJsonSchema = options.responseJsonSchema;
    }

    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      const rawText = response.text || "";
      let parsedJson: unknown = undefined;

      if (options?.responseJsonSchema && rawText) {
        try {
          parsedJson = JSON.parse(rawText);
        } catch {
          // If JSON parse fails, rawText remains intact
        }
      }

      return {
        rawText,
        parsedJson,
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount,
          candidatesTokens: response.usageMetadata?.candidatesTokenCount,
          totalTokens: response.usageMetadata?.totalTokenCount,
        },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown Gemini API error";
      // Sanitize: ensure no API keys or raw credentials in the error message
      const sanitized = message.replace(/AIza[0-9A-Za-z-_]{35}/g, "[REDACTED_API_KEY]");
      throw new Error(`Gemini simulation failed: ${sanitized}`);
    }
  }

  async generateConversationTurn(
    history: AIProviderMessage[],
    newPrompt: string,
    options?: ProviderGenerateOptions
  ): Promise<ProviderGenerateResult> {
    const client = this.getClient();
    const model = options?.model || this.defaultModel;

    // Convert history to Gemini format
    const contents = history
      .filter((h) => h.role === "user" || h.role === "model")
      .map((h) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.content }],
      }));

    contents.push({
      role: "user",
      parts: [{ text: newPrompt }],
    });

    const config: Record<string, unknown> = {};
    if (typeof options?.temperature === "number") {
      config.temperature = options.temperature;
    }
    if (typeof options?.maxOutputTokens === "number") {
      config.maxOutputTokens = options.maxOutputTokens;
    }
    if (options?.systemInstruction) {
      config.systemInstruction = options.systemInstruction;
    }
    if (options?.responseJsonSchema) {
      config.responseMimeType = "application/json";
      config.responseJsonSchema = options.responseJsonSchema;
    }

    try {
      const response = await client.models.generateContent({
        model,
        contents,
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      const rawText = response.text || "";
      let parsedJson: unknown = undefined;

      if (options?.responseJsonSchema && rawText) {
        try {
          parsedJson = JSON.parse(rawText);
        } catch {
          // Keep rawText
        }
      }

      return {
        rawText,
        parsedJson,
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount,
          candidatesTokens: response.usageMetadata?.candidatesTokenCount,
          totalTokens: response.usageMetadata?.totalTokenCount,
        },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown Gemini API error";
      const sanitized = message.replace(/AIza[0-9A-Za-z-_]{35}/g, "[REDACTED_API_KEY]");
      throw new Error(`Gemini simulation failed: ${sanitized}`);
    }
  }
}
