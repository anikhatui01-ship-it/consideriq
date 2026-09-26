import { Project, BrandTurnStatus, TurnCitation, DecisionStage, EvidenceClassification } from "@/lib/types/database";
import { AIProvider, AIProviderMessage } from "@/lib/providers/types";
import { getProvider } from "@/lib/providers";
import { buildBuyerJourneyPlan } from "./prompts";

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

export interface SimulationExecutionResult {
  visibilityRate: number;
  shortlistRate: number;
  recommendationRate: number;
  eliminationRate: number;
  eliminatedAtTurn: number | null;
  turns: SimulationTurnResult[];
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

    // System instruction defining the AI buyer simulation environment
    const systemInstruction = `You are an expert enterprise software evaluation assistant and consultative procurement advisor.
A prospective B2B software buyer is evaluating vendor options for their company in the category: "${project.category}".
Buyer Profile: "${project.target_persona}".
Tracked brand under evaluation: "${project.name}".
Known competitors in this space: ${project.competitors.join(", ")}.

Provide objective, technically accurate, rigorous evaluation responses.
Clearly evaluate software options by name based on publicly known architectural, security, pricing, and integration capabilities.
Do not invent fake tools or fabricated features. Ground every assessment in realistic software capabilities.`;

    // Execute turns sequentially
    for (const plan of turnsPlan) {
      // 1. Generate the conversational turn with Gemini
      const turnResponse = await this.provider.generateConversationTurn(
        conversationHistory,
        plan.buyerPrompt,
        {
          systemInstruction,
          temperature: 0.3, // Low temperature for high reproducibility and factuality
          maxOutputTokens: 1500,
        }
      );

      const observedText = turnResponse.rawText;

      // Update conversation history for multi-turn coherence
      conversationHistory.push({ role: "user", content: plan.buyerPrompt });
      conversationHistory.push({ role: "model", content: observedText });

      // 2. Extract structured consideration set & citations from this turn
      const { brands, citations, insight } = await this.extractTurnAnalysis(
        project,
        plan,
        observedText
      );

      // 3. Determine evidence classification for this turn
      // Turn 1, 2, 5 are primarily OBSERVED (direct text statements)
      // Turn 3 is CALCULATED (ranking/shortlist synthesis)
      // Turn 4 is INFERRED (reasoning behind elimination criteria)
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
        observedResponse: observedText,
        brands,
        citations,
        insight,
        classification,
      });
    }

    // 4. Calculate empirical metrics directly from the simulation turns
    return this.calculateMetrics(project, turnsResults);
  }

  private async extractTurnAnalysis(
    project: Project,
    plan: { stage: DecisionStage; buyerPrompt: string; turnIndex: number },
    observedText: string
  ): Promise<{ brands: BrandTurnStatus[]; citations: TurnCitation[]; insight: string }> {
    const analysisPrompt = `Analyze this procurement conversation turn and extract the vendor consideration status.
Tracked Brand Name: "${project.name}"
Competitors to identify: ${project.competitors.join(", ")}

Buyer Prompt:
"${plan.buyerPrompt}"

Observed AI Response:
"""
${observedText}
"""

Return a JSON object conforming exactly to this structure:
{
  "brands": [
    {
      "name": "Brand Name",
      "isYourBrand": boolean,
      "status": "candidate" | "active" | "eliminated" | "recommended",
      "note": "Brief justification observed in text"
    }
  ],
  "citations": [
    {
      "title": "Title of public documentation or review source",
      "url": "URL if explicitly mentioned in text (do NOT fabricate URLs)",
      "snippet": "Quoted excerpt from text"
    }
  ],
  "insight": "1-2 concise sentences explaining what happened to ${project.name} and competitors at this stage."
}

Rules:
1. Always include "${project.name}" in the brands list if mentioned in the response or prompt.
2. Mark status as:
   - "candidate": initial mention in early discovery
   - "active": survived constraints and actively shortlisted
   - "eliminated": ruled out, dropped, or failed constraints
   - "recommended": chosen as the final recommended option
3. Never invent fake URLs. If no URLs are mentioned in the response, return an empty array for citations: []
4. Maintain factual adherence to the observed text.`;

    const schema = {
      type: "OBJECT",
      properties: {
        brands: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              isYourBrand: { type: "BOOLEAN" },
              status: {
                type: "STRING",
                enum: ["candidate", "active", "eliminated", "recommended"],
              },
              note: { type: "STRING" },
            },
            required: ["name", "isYourBrand", "status"],
          },
        },
        citations: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING" },
              url: { type: "STRING" },
              snippet: { type: "STRING" },
            },
            required: ["title", "url"],
          },
        },
        insight: { type: "STRING" },
      },
      required: ["brands", "insight"],
    };

    try {
      const result = await this.provider.generateResponse(analysisPrompt, {
        temperature: 0.1,
        responseJsonSchema: schema,
      });

      if (result.parsedJson && typeof result.parsedJson === "object") {
        const parsed = result.parsedJson as {
          brands?: BrandTurnStatus[];
          citations?: TurnCitation[];
          insight?: string;
        };

        const brands = Array.isArray(parsed.brands) ? parsed.brands : [];
        const citations = Array.isArray(parsed.citations)
          ? parsed.citations.filter((c) => Boolean(c.url && !c.url.includes("example.com")))
          : [];
        const insight = parsed.insight || `Turn ${plan.turnIndex} evaluation completed.`;

        // Ensure tracked brand is explicitly tagged
        const normalizedYourBrand = project.name.toLowerCase();
        brands.forEach((b) => {
          if (b.name.toLowerCase() === normalizedYourBrand) {
            b.isYourBrand = true;
          }
        });

        // If tracked brand wasn't included by model, check if it was in the text
        const hasTrackedBrand = brands.some((b) => b.isYourBrand);
        if (!hasTrackedBrand) {
          const wasMentioned = observedText.toLowerCase().includes(normalizedYourBrand);
          brands.push({
            name: project.name,
            isYourBrand: true,
            status: wasMentioned ? (plan.stage === "ELIMINATION" ? "eliminated" : "active") : "eliminated",
            note: wasMentioned ? "Mentioned in model response" : "Not included in candidate consideration set",
          });
        }

        return { brands, citations, insight };
      }
    } catch {
      // Fallback: graceful parsing if JSON schema generation encounters an issue
    }

    // Deterministic fallback based on text substring matching
    return this.fallbackTextAnalysis(project, plan, observedText);
  }

  private fallbackTextAnalysis(
    project: Project,
    plan: { stage: DecisionStage; turnIndex: number },
    text: string
  ): { brands: BrandTurnStatus[]; citations: TurnCitation[]; insight: string } {
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
      note: yourBrandMentioned ? "Identified in model response" : "Absent from model consideration set",
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
  ): SimulationExecutionResult {
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

    // Calculations
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
