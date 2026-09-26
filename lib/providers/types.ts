export type MessageRole = "user" | "model" | "system";

export interface AIProviderMessage {
  role: MessageRole;
  content: string;
}

export interface ProviderGenerateOptions {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  systemInstruction?: string;
  responseJsonSchema?: unknown;
}

export interface ProviderTokenUsage {
  promptTokens?: number;
  candidatesTokens?: number;
  totalTokens?: number;
}

export interface ProviderGenerateResult {
  rawText: string;
  parsedJson?: unknown;
  usage?: ProviderTokenUsage;
  finishReason?: string;
}

export interface AIProvider {
  readonly id: string;
  readonly name: string;
  readonly defaultModel: string;

  isConfigured(): boolean;

  generateResponse(
    prompt: string,
    options?: ProviderGenerateOptions
  ): Promise<ProviderGenerateResult>;

  generateConversationTurn(
    history: AIProviderMessage[],
    newPrompt: string,
    options?: ProviderGenerateOptions
  ): Promise<ProviderGenerateResult>;
}
