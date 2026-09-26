import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateAndSanitizeUrl } from "@/lib/security/ssrf";
import { rateLimiter, RATE_LIMITS } from "@/lib/security/rate-limit";

// Strict input limits
const LIMITS = {
  MAX_NAME_LEN: 100,
  MAX_CATEGORY_LEN: 150,
  MAX_PERSONA_LEN: 1000,
  MAX_COMPETITORS: 10,
  MAX_COMPETITOR_LEN: 100,
  MAX_CONSTRAINTS: 10,
  MAX_CONSTRAINT_LEN: 200,
  MAX_PAYLOAD_SIZE: 50 * 1024, // 50 KB
};

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to retrieve projects." }, { status: 500 });
  }

  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Rate Limiting check
  const rateLimitResult = rateLimiter.check(
    `project-create:${user.id}`,
    RATE_LIMITS.PROJECT_CREATIONS.limit,
    RATE_LIMITS.PROJECT_CREATIONS.windowMs
  );

  if (!rateLimitResult.allowed) {
    const minutesLeft = Math.ceil(rateLimitResult.resetMs / 60000);
    return NextResponse.json(
      {
        error: `Project creation limit reached. Please wait ${minutesLeft} minute(s) before creating another brand project.`,
      },
      { status: 429 }
    );
  }

  // 2. Request body size check
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > LIMITS.MAX_PAYLOAD_SIZE) {
      return NextResponse.json({ error: "Request payload exceeds allowed limit (50 KB)." }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Payload must be a JSON object." }, { status: 400 });
  }

  const {
    name: rawName,
    website: rawWebsite,
    category: rawCategory,
    competitors: rawCompetitors,
    target_persona: rawPersona,
    constraints: rawConstraints,
  } = body as Record<string, unknown>;

  // 3. Validate Brand Name
  if (typeof rawName !== "string" || !rawName.trim()) {
    return NextResponse.json({ error: "Brand name is required." }, { status: 400 });
  }
  const name = rawName.trim().slice(0, LIMITS.MAX_NAME_LEN);
  if (name.length < 2) {
    return NextResponse.json({ error: "Brand name must be at least 2 characters." }, { status: 400 });
  }

  // 4. Validate Website URL with SSRF Protection
  if (typeof rawWebsite !== "string" || !rawWebsite.trim()) {
    return NextResponse.json({ error: "Brand website URL is required." }, { status: 400 });
  }
  const urlCheck = validateAndSanitizeUrl(rawWebsite);
  if (!urlCheck.isValid || !urlCheck.normalizedUrl) {
    return NextResponse.json(
      { error: urlCheck.error || "Please enter a valid, publicly reachable website URL." },
      { status: 400 }
    );
  }
  const website = urlCheck.normalizedUrl;

  // 5. Validate Category
  if (typeof rawCategory !== "string" || !rawCategory.trim()) {
    return NextResponse.json({ error: "Relevant category is required." }, { status: 400 });
  }
  const category = rawCategory.trim().slice(0, LIMITS.MAX_CATEGORY_LEN);
  if (category.length < 3) {
    return NextResponse.json({ error: "Category description must be at least 3 characters." }, { status: 400 });
  }

  // 6. Validate Competitors
  let competitors: string[] = [];
  if (Array.isArray(rawCompetitors)) {
    competitors = rawCompetitors
      .map((c) => (typeof c === "string" ? c.trim() : ""))
      .filter((c) => c.length > 0 && c.length <= LIMITS.MAX_COMPETITOR_LEN)
      .slice(0, LIMITS.MAX_COMPETITORS);
  }

  // 7. Validate Target Persona / ICP
  let target_persona = "";
  if (typeof rawPersona === "string") {
    target_persona = rawPersona.trim().slice(0, LIMITS.MAX_PERSONA_LEN);
  }

  // 8. Validate Constraints
  let constraints: string[] = [];
  if (Array.isArray(rawConstraints)) {
    constraints = rawConstraints
      .map((c) => (typeof c === "string" ? c.trim() : ""))
      .filter((c) => c.length > 0 && c.length <= LIMITS.MAX_CONSTRAINT_LEN)
      .slice(0, LIMITS.MAX_CONSTRAINTS);
  }

  // 9. Insert project scoped to user.id
  const { data: project, error: insertError } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name,
      website,
      category,
      competitors,
      target_persona,
      constraints,
    })
    .select()
    .single();

  if (insertError) {
    console.error("[Project Creation] insert failed", {
      code: insertError.code,
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint,
    });
    return NextResponse.json(
      { error: "Unable to save this brand project. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ project }, { status: 201 });
}
