import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SimulationEngine } from "@/lib/simulation/engine";
import { getProvider } from "@/lib/providers";
import { Project } from "@/lib/types/database";
import { rateLimiter, RATE_LIMITS } from "@/lib/security/rate-limit";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Rate limiting check
  const rateLimitResult = rateLimiter.check(
    `simulation-run:${user.id}`,
    RATE_LIMITS.SIMULATION_RUNS.limit,
    RATE_LIMITS.SIMULATION_RUNS.windowMs
  );

  if (!rateLimitResult.allowed) {
    const minutesLeft = Math.ceil(rateLimitResult.resetMs / 60000);
    return NextResponse.json(
      {
        error: `Simulation rate limit reached. Please wait ${minutesLeft} minute(s) before launching another simulation.`,
      },
      { status: 429 }
    );
  }

  // 2. Request body parsing and validation
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 5 * 1024) {
      return NextResponse.json({ error: "Payload exceeds 5 KB limit." }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Payload must be a JSON object." }, { status: 400 });
  }

  const { projectId } = body as { projectId?: string };
  if (!projectId || typeof projectId !== "string" || !UUID_REGEX.test(projectId)) {
    return NextResponse.json({ error: "A valid project ID is required." }, { status: 400 });
  }

  // 3. Concurrency check: prevent multiple simultaneous runs per user
  const { data: activeSims } = await supabase
    .from("simulations")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "running")
    .limit(1);

  if (activeSims && activeSims.length > 0) {
    return NextResponse.json(
      {
        error: "A simulation is currently in progress. Please wait for it to finish before starting a new run.",
      },
      { status: 409 }
    );
  }

  // 4. Verify project ownership with tenant isolation
  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (projectError || !projectData) {
    return NextResponse.json({ error: "Brand project not found or access denied." }, { status: 404 });
  }

  const project: Project = projectData;

  // 5. Verify AI Provider configuration
  const provider = getProvider("gemini");
  if (!provider.isConfigured()) {
    return NextResponse.json(
      {
        error:
          "Google Gemini API key is not configured in the server environment. Please configure GEMINI_API_KEY to run live simulations.",
      },
      { status: 400 }
    );
  }

  // 6. Create running simulation record
  const { data: simulation, error: insertSimError } = await supabase
    .from("simulations")
    .insert({
      project_id: project.id,
      user_id: user.id,
      provider: provider.id,
      model: provider.defaultModel,
      status: "running",
      scenarios_count: 1,
    })
    .select()
    .single();

  if (insertSimError || !simulation) {
    return NextResponse.json(
      { error: "Unable to initialize simulation record. Please try again." },
      { status: 500 }
    );
  }

  // 7. Execute the simulation engine with safe error containment
  const engine = new SimulationEngine(provider);

  try {
    const result = await engine.runSimulation(project);

    // 8. Store turns in simulation_turns table
    const turnsToInsert = result.turns.map((t) => ({
      simulation_id: simulation.id,
      user_id: user.id,
      turn_index: t.turnIndex,
      stage: t.stage,
      buyer_prompt: t.buyerPrompt,
      observed_response: t.observedResponse,
      brands: t.brands,
      citations: t.citations,
      insight: t.insight,
      classification: t.classification,
    }));

    const { error: turnsError } = await supabase
      .from("simulation_turns")
      .insert(turnsToInsert);

    if (turnsError) {
      throw new Error("Failed to persist simulation turns.");
    }

    // 9. Update simulation status and calculated metrics
    const { error: updateError } = await supabase
      .from("simulations")
      .update({
        status: "completed",
        visibility_rate: result.visibilityRate,
        shortlist_rate: result.shortlistRate,
        recommendation_rate: result.recommendationRate,
        elimination_rate: result.eliminationRate,
        completed_at: new Date().toISOString(),
      })
      .eq("id", simulation.id)
      .eq("user_id", user.id);

    if (updateError) {
      throw new Error("Failed to finalize simulation status.");
    }

    return NextResponse.json({
      success: true,
      simulationId: simulation.id,
      result,
    });
  } catch (err: unknown) {
    // Sanitize any potential provider or credential leaks
    let safeMessage = "Simulation execution encountered an error.";
    if (err instanceof Error) {
      safeMessage = err.message
        .replace(/AIza[0-9A-Za-z-_]{35}/g, "[REDACTED]")
        .slice(0, 300);
    }

    // Update simulation status to failed
    await supabase
      .from("simulations")
      .update({
        status: "failed",
        error_message: safeMessage,
      })
      .eq("id", simulation.id)
      .eq("user_id", user.id);

    return NextResponse.json({ error: safeMessage }, { status: 500 });
  }
}
