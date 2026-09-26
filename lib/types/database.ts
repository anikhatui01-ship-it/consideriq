export type SimulationStatus = "pending" | "running" | "completed" | "failed";
export type DecisionStage = "QUESTION" | "CONSTRAINT" | "SHORTLIST" | "ELIMINATION" | "RECOMMENDATION";
export type EvidenceClassification = "OBSERVED" | "CALCULATED" | "INFERRED";

export interface Project {
  id: string;
  user_id: string;
  name: string;
  website: string;
  category: string;
  competitors: string[];
  target_persona: string;
  constraints: string[];
  created_at: string;
  updated_at: string;
}

export interface Simulation {
  id: string;
  project_id: string;
  user_id: string;
  provider: string;
  model: string;
  status: SimulationStatus;
  scenarios_count: number;
  visibility_rate: number | null;
  shortlist_rate: number | null;
  recommendation_rate: number | null;
  elimination_rate: number | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface BrandTurnStatus {
  name: string;
  isYourBrand?: boolean;
  status: "candidate" | "active" | "eliminated" | "recommended";
  note?: string;
}

export interface TurnCitation {
  title: string;
  url: string;
  snippet?: string;
}

export interface SimulationTurn {
  id: string;
  simulation_id: string;
  user_id: string;
  turn_index: number;
  stage: DecisionStage;
  buyer_prompt: string;
  observed_response: string;
  brands: BrandTurnStatus[];
  citations: TurnCitation[];
  insight: string | null;
  classification: EvidenceClassification;
  created_at: string;
}
