import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch simulation with ownership check
  const { data: simulation, error: simError } = await supabase
    .from("simulations")
    .select("*, projects(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (simError || !simulation) {
    return NextResponse.json({ error: "Simulation not found" }, { status: 404 });
  }

  // Fetch turns ordered by turn_index
  const { data: turns, error: turnsError } = await supabase
    .from("simulation_turns")
    .select("*")
    .eq("simulation_id", id)
    .eq("user_id", user.id)
    .order("turn_index", { ascending: true });

  if (turnsError) {
    return NextResponse.json({ error: turnsError.message }, { status: 500 });
  }

  return NextResponse.json({
    simulation,
    turns: turns || [],
  });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("simulations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
