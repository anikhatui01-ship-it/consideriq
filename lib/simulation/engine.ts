import { Project, BrandTurnStatus, TurnCitation, DecisionStage, EvidenceClassification } from "@/lib/types/database";
import { AIProvider, AIProviderMessage } from "@/lib/providers/types";
import { getProvider } from "@/lib/providers";
import { buildBuyerJourneyPlan, BuyerJourneyTurnPlan } from "./prompts";

export interface SimulationTurnResult {
  turnIndex: number;
  stage: DecisionStage;
  title: string;
  subtitle: string;
  buyerPrompt: string;
  observedResponse: string;
  brands: BrandTurnStatus[];
  citations: TurnCitation[];
  insight: string;
  classification: EvidenceClassification;
}

export interface SimulationTiming {
  turnIndex: number;
  stage: DecisionStage;
  durationMs: number;
}

export interface SimulationExecutionResult {
  visibilityRate: number;
  shortlistRate: number;
  recommendationRate: number;
  eliminationRate: number;
  eliminatedAtTurn: number | null;
  turns: SimulationTurnResult[];
  timings?: {
    totalDurationMs: number;
    turnDurations: SimulationTiming[];
  };
}

export class SimulationEngine {
  private provider: AIProvider;

  constructor(provider?: AIProvider) {
    this.provider = provider || getProvider("gemini");
  }

  async runSimulation(project: Project): Promise<SimulationExecutionResult> {
    if (!this.provider.isConfigured()) {
      throw new Error(
        "AI provider is not configured. Please set GEMINI_API_KEY in your server environment."
      );
    }

    const turnsPlan = buildBuyerJourneyPlan(project);
    const conversationHistory: AIProviderMessage[] = [];
    const turnsResults: SimulationTurnResult[] = [];
    const turnDurations: SimulationTiming[] = [];
    const totalStart = Date.now();

    // System instruction defining the AI buyer simulation environment and structured JSON contract
    const systemInstruction = `You are an expert enterprise software evaluation assistant and consultative procurement advisor.
A prospective B2B software buyer is evaluating vendor options for their company in the category: "${project.category}".
Buyer Profile: "${project.target_persona}".
Tracked brand under evaluation: "${project.name}".
Known competitors in this space: ${project.competitors.join(", ")}.

Provide objective, technically accurate, rigorous evaluation responses.
Clearly evaluate software options by name based on publicly known architectural, security, pricing, and integration capabilities.
Do not invent fake tools or fabricated features. Ground every assessment in realistic software capabilities.
Keep your conversational response concise, analytical, and under 250 words.
You MUST output your response as a valid JSON object matching the provided schema.`;

    // JSON Schema for structured turn generation in a single call
    const structuredTurnSchema = {
      type: "object",
      properties: {
        observedResponse: {
          type: "string",
          description: "Concise (under 250 words) consultative advice and evaluation response answering the buyer's query directly.",
        },
        brands: {
          type: "array",
          description: "List of vendors evaluated or mentioned in this turn.",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Brand / vendor name" },
              isYourBrand: { type: "boolean", description: "True if this matches the tracked brand under evaluation" },
              status: {
                type: "string",
                enum: ["candidate", "active", "eliminated", "recommended"],
                description: "Vendor status: candidate (initial mention), active (shortlisted), eliminated (dropped/failed constraints), recommended (winning recommendation)",
              },
              note: { type: "string", description: "Brief evaluation note or reason observed in text" },
            },
            required: ["name", "isYourBrand", "status"],
          },
        },
        citations: {
          type: "array",
          description: "Public documentation, URL, or domain references grounding the assessment. Do NOT invent fake URLs.",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              url: { type: "string" },
              snippet: { type: "string" },
            },
            required: ["title", "url"],
          },
        },
        insight: {
          type: "string",
          description: "Concise analytical summary of vendor consideration, survival, or elimination at this stage.",
        },
      },
      required: ["observedResponse", "brands", "citations", "insight"],
    };

    // Execute exactly 5 turns: ONE Gemini call per turn (TOTAL = 5 calls)
    for (const plan of turnsPlan) {
      const turnStart = Date.now();

      let turnResponse;
      try {
        turnResponse = await this.provider.generateConversationTurn(
          conversationHistory,
          plan.buyerPrompt,
          {
            systemInstruction,
            temperature: 0.2, // Low temperature for high reproducibility and factuality
            maxOutputTokens: 1000, // Token cap around 900-1000 tokens
            responseJsonSchema: structuredTurnSchema,
          }
        );
      } catch (providerErr: unknown) {
        const turnDurationMs = Date.now() - turnStart;
        const rawMsg = providerErr instanceof Error ? providerErr.message : "Provider call failed";
        console.error(`[Simulation] Turn ${plan.turnIndex} (${plan.stage}) failed after ${turnDurationMs}ms:`, rawMsg);
        
        const enhancedError = new Error(`Turn ${plan.turnIndex} (${plan.stage}) provider error: ${rawMsg}`);
        (enhancedError as { turnIndex?: number }).turnIndex = plan.turnIndex;
        (enhancedError as { stage?: string }).stage = plan.stage;
        throw enhancedError;
      }

      const turnDurationMs = Date.now() - turnStart;
      turnDurations.push({
        turnIndex: plan.turnIndex,
        stage: plan.stage,
        durationMs: turnDurationMs,
      });
      console.log(`[Simulation] Turn ${plan.turnIndex} (${plan.stage}) completed in ${turnDurationMs}ms`);

      // Parse structured JSON with deterministic fallback
      const parsedData = this.resolveTurnData(turnResponse.parsedJson, turnResponse.rawText, project, plan);

      // Append only the conversational observedResponse to history for turn-to-turn coherence
      conversationHistory.push({ role: "user", content: plan.buyerPrompt });
      conversationHistory.push({ role: "model", content: parsedData.observedResponse });

      // Preserve evidence classification standards:
      // QUESTION = OBSERVED
      // CONSTRAINT = OBSERVED
      // SHORTLIST = CALCULATED
      // ELIMINATION = INFERRED
      // RECOMMENDATION = OBSERVED
      let classification: EvidenceClassification = "OBSERVED";
      if (plan.stage === "SHORTLIST") {
        classification = "CALCULATED";
      } else if (plan.stage === "ELIMINATION") {
        classification = "INFERRED";
      }

      turnsResults.push({
        turnIndex: plan.turnIndex,
        stage: plan.stage,
        title: plan.title,
        subtitle: plan.subtitle,
        buyerPrompt: plan.buyerPrompt,
        observedResponse: parsedData.observedResponse,
        brands: parsedData.brands,
        citations: parsedData.citations,
        insight: parsedData.insight,
        classification,
      });
    }

    const totalDurationMs = Date.now() - totalStart;
    console.log(`[Simulation] Total simulation completed in ${totalDurationMs}ms across 5 turns.`);

    // Calculate empirical metrics directly from the simulation turns
    const metrics = this.calculateMetrics(project, turnsResults);
    return {
      ...metrics,
      timings: {
        totalDurationMs,
        turnDurations,
      },
    };
  }

  private resolveTurnData(
    parsedJson: unknown,
    rawText: string,
    project: Project,
    plan: BuyerJourneyTurnPlan
  ): {
    observedResponse: string;
    brands: BrandTurnStatus[];
    citations: TurnCitation[];
    insight: string;
  } {
    // 1. Direct structured JSON from Gemini provider
    if (parsedJson && typeof parsedJson === "object") {
      const data = parsedJson as {
        observedResponse?: string;
        brands?: BrandTurnStatus[];
        citations?: TurnCitation[];
        insight?: string;
      };

      if (typeof data.observedResponse === "string" && data.observedResponse.trim().length > 0) {
        return this.normalizeStructuredData(data, rawText, project, plan);
      }
    }

    // 2. Fallback: attempt regex extraction of JSON block from rawText
    if (rawText && rawText.includes("{")) {
      try {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed && typeof parsed === "object") {
            return this.normalizeStructuredData(parsed, rawText, project, plan);
          }
        }
      } catch {
        // Fall through to deterministic fallback
      }
    }

    // 3. Deterministic fallback parsing (preserves rawText without crashing simulation)
    return this.fallbackDeterministicParsing(project, plan, rawText);
  }

  private normalizeStructuredData(
    data: {
      observedResponse?: string;
      brands?: BrandTurnStatus[];
      citations?: TurnCitation[];
      insight?: string;
    },
    rawText: string,
    project: Project,
    plan: BuyerJourneyTurnPlan
  ): {
    observedResponse: string;
    brands: BrandTurnStatus[];
    citations: TurnCitation[];
    insight: string;
  } {
    const observedResponse =
      typeof data.observedResponse === "string" && data.observedResponse.trim().length > 0
        ? data.observedResponse.trim()
        : rawText.trim();

    const rawBrands = Array.isArray(data.brands) ? data.brands : [];
    const brands: BrandTurnStatus[] = rawBrands.map((b) => ({
      name: String(b.name || "Unknown Vendor").trim(),
      isYourBrand: Boolean(b.isYourBrand),
      status: ["candidate", "active", "eliminated", "recommended"].includes(b.status)
        ? b.status
        : "active",
      note: b.note ? String(b.note).trim() : undefined,
    }));

    // Ensure tracked brand is explicitly identified
    const normalizedYourBrand = project.name.toLowerCase();
    brands.forEach((b) => {
      if (b.name.toLowerCase() === normalizedYourBrand) {
        b.isYourBrand = true;
      }
    });

    // If tracked brand wasn't included by model in brands array, check if mentioned in response
    const hasTrackedBrand = brands.some((b) => b.isYourBrand);
    if (!hasTrackedBrand) {
      const wasMentioned = observedResponse.toLowerCase().includes(normalizedYourBrand);
      brands.push({
        name: project.name,
        isYourBrand: true,
        status: wasMentioned ? (plan.stage === "ELIMINATION" ? "eliminated" : "active") : "eliminated",
        note: wasMentioned ? "Identified in model response text" : "Omitted from candidate consideration set",
      });
    }

    const rawCitations = Array.isArray(data.citations) ? data.citations : [];
    const citations: TurnCitation[] = rawCitations
      .filter((c) => Boolean(c.url && !c.url.includes("example.com")))
      .map((c) => ({
        title: String(c.title || "Reference Document").trim(),
        url: String(c.url).trim(),
        snippet: c.snippet ? String(c.snippet).trim() : undefined,
      }));

    const insight =
      typeof data.insight === "string" && data.insight.trim().length > 0
        ? data.insight.trim()
        : `Turn ${plan.turnIndex} (${plan.stage}) evaluation completed.`;

    return {
      observedResponse,
      brands,
      citations,
      insight,
    };
  }

  private fallbackDeterministicParsing(
    project: Project,
    plan: BuyerJourneyTurnPlan,
    text: string
  ): { brands: BrandTurnStatus[]; citations: TurnCitation[]; insight: string; observedResponse: string } {
    const brands: BrandTurnStatus[] = [];
    const lowerText = text.toLowerCase();

    // Check tracked brand
    const yourBrandMentioned = lowerText.includes(project.name.toLowerCase());
    let yourStatus: "candidate" | "active" | "eliminated" | "recommended" = "candidate";

    if (plan.stage === "ELIMINATION") {
      yourStatus = lowerText.includes("eliminate") && yourBrandMentioned ? "eliminated" : "active";
    } else if (plan.stage === "RECOMMENDATION") {
      yourStatus = lowerText.includes(`recommend ${project.name.toLowerCase()}`) ? "recommended" : "active";
    } else if (yourBrandMentioned) {
      yourStatus = "active";
    } else {
      yourStatus = "eliminated";
    }

    brands.push({
      name: project.name,
      isYourBrand: true,
      status: yourStatus,
      note: yourBrandMentioned ? "Identified in model response" : "Absent from candidate consideration set",
    });

    // Check known competitors
    for (const comp of project.competitors) {
      const compMentioned = lowerText.includes(comp.toLowerCase());
      brands.push({
        name: comp,
        isYourBrand: false,
        status: compMentioned ? "active" : "eliminated",
        note: compMentioned ? "Referenced in candidate set" : "Omitted from turn",
      });
    }

    return {
      observedResponse: text.trim() || `Turn ${plan.turnIndex} evaluation response.`,
      brands,
      citations: [],
      insight: `Empirical evaluation for Turn ${plan.turnIndex}: ${
        yourBrandMentioned ? `${project.name} retained consideration` : `${project.name} was not cited`
      }.`,
    };
  }

  private calculateMetrics(
    project: Project,
    turns: SimulationTurnResult[]
  ): {
    visibilityRate: number;
    shortlistRate: number;
    recommendationRate: number;
    eliminationRate: number;
    eliminatedAtTurn: number | null;
    turns: SimulationTurnResult[];
  } {
    let turnsWithBrand = 0;
    let shortlisted = false;
    let recommended = false;
    let eliminatedAtTurn: number | null = null;

    turns.forEach((turn) => {
      const yourBrand = turn.brands.find((b) => b.isYourBrand);
      if (yourBrand && yourBrand.status !== "eliminated") {
        turnsWithBrand += 1;
      }

      if (turn.stage === "SHORTLIST" && yourBrand && yourBrand.status !== "eliminated") {
        shortlisted = true;
      }

      if (turn.stage === "ELIMINATION" && yourBrand && yourBrand.status === "eliminated") {
        if (eliminatedAtTurn === null) {
          eliminatedAtTurn = turn.turnIndex;
        }
      }

      if (turn.stage === "RECOMMENDATION" && yourBrand && yourBrand.status === "recommended") {
        recommended = true;
      }
    });

    const visibilityRate = Math.round((turnsWithBrand / turns.length) * 100);
    const shortlistRate = shortlisted ? 100 : 0;
    const recommendationRate = recommended ? 100 : 0;
    const eliminationRate = eliminatedAtTurn !== null ? 100 : 0;

    return {
      visibilityRate,
      shortlistRate,
      recommendationRate,
      eliminationRate,
      eliminatedAtTurn,
      turns,
    };
  }
}
