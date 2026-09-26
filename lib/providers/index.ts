import { AIProvider } from "./types";
import { GeminiProvider } from "./gemini";

export * from "./types";
export * from "./gemini";

const defaultGeminiProvider = new GeminiProvider();

export function getProvider(providerId: string = "gemini"): AIProvider {
  switch (providerId.toLowerCase()) {
    case "gemini":
      return defaultGeminiProvider;
    case "openai":
      throw new Error(
        "OpenAI provider is scheduled for a future milestone. Only Google Gemini is active for v0.1."
      );
    case "anthropic":
      throw new Error(
        "Anthropic provider is scheduled for a future milestone. Only Google Gemini is active for v0.1."
      );
    default:
      throw new Error(`Unsupported AI provider: "${providerId}". Supported v0.1 provider: "gemini".`);
  }
}
