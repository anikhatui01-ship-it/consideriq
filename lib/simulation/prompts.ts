import { Project } from "@/lib/types/database";

export interface BuyerJourneyTurnPlan {
  turnIndex: number;
  stage: "QUESTION" | "CONSTRAINT" | "SHORTLIST" | "ELIMINATION" | "RECOMMENDATION";
  title: string;
  subtitle: string;
  buyerPrompt: string;
}

export function buildBuyerJourneyPlan(project: Project): BuyerJourneyTurnPlan[] {
  const category = project.category || "software tools";
  const persona =
    project.target_persona ||
    "An engineering and operations team looking for a reliable, modern solution";
  const constraints =
    project.constraints && project.constraints.length > 0
      ? project.constraints.join(", ")
      : "standard security compliance and straightforward workflow integrations";

  return [
    {
      turnIndex: 1,
      stage: "QUESTION",
      title: "Initial Category Discovery",
      subtitle: "Turn 1 · Broad Discovery Search",
      buyerPrompt: `We are ${persona}. We are researching top solutions in the ${category} space. What are the leading options we should evaluate, and what are their primary strengths?`,
    },
    {
      turnIndex: 2,
      stage: "CONSTRAINT",
      title: "Operational & Workflow Filter",
      subtitle: "Turn 2 · Architecture & Integration Filter",
      buyerPrompt: `Our team requires tight integration with our daily workflows, specifically: ${constraints}. Which of the candidate options support these operational requirements out of the box, and which struggle or require complex custom workarounds?`,
    },
    {
      turnIndex: 3,
      stage: "SHORTLIST",
      title: "Comparative Shortlist",
      subtitle: "Turn 3 · Comparative Synthesis",
      buyerPrompt: `Based on these requirements, please narrow this down to a top 3 shortlist. Compare the surviving tools side-by-side on pricing transparency, implementation time, and ease of onboarding for our team.`,
    },
    {
      turnIndex: 4,
      stage: "ELIMINATION",
      title: "Critical Elimination Gate",
      subtitle: "Turn 4 · Governance & Security Audit",
      buyerPrompt: `Before advancing to vendor trials, our security and procurement team requires confirmed SOC 2 Type II compliance, directory user provisioning (SCIM), and predictable licensing. Which tools fail these mandatory criteria and must be eliminated from consideration? Clearly explain why each eliminated tool was dropped.`,
    },
    {
      turnIndex: 5,
      stage: "RECOMMENDATION",
      title: "Final Single Recommendation",
      subtitle: "Turn 5 · Final Decision & Rationale",
      buyerPrompt: `Taking into account all our constraints, team profile, and evaluation points, which single vendor should we schedule a pilot with this quarter? Provide your final recommendation and the primary reasons behind this choice.`,
    },
  ];
}
