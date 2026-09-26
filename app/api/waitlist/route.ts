import { NextRequest, NextResponse } from "next/server";

// Standard RFC 5322 simplified email regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  let urlWithProtocol = trimmed;
  if (!/^https?:\/\//i.test(trimmed)) {
    urlWithProtocol = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(urlWithProtocol);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }
    // Must have at least a dot in hostname and reasonable length
    if (!parsed.hostname.includes(".") || parsed.hostname.length < 3) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Request payload must be an object." },
        { status: 400 }
      );
    }

    const {
      email: rawEmail,
      company_website: rawWebsite,
      role: rawRole,
      research_question: rawQuestion,
      heard_about_us: rawHeardAboutUs,
    } = body as Record<string, unknown>;

    // 1. Validate Email
    if (typeof rawEmail !== "string" || !rawEmail.trim()) {
      return NextResponse.json(
        { success: false, error: "Work email is required." },
        { status: 400 }
      );
    }
    const email = rawEmail.trim().toLowerCase();
    if (!EMAIL_REGEX.test(email) || email.length > 254) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid work email address." },
        { status: 400 }
      );
    }

    // 2. Validate Company Website
    if (typeof rawWebsite !== "string" || !rawWebsite.trim()) {
      return NextResponse.json(
        { success: false, error: "Company website is required." },
        { status: 400 }
      );
    }
    const company_website = normalizeUrl(rawWebsite);
    if (!company_website || company_website.length > 500) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid company website URL." },
        { status: 400 }
      );
    }

    // 3. Validate Role
    if (typeof rawRole !== "string" || !rawRole.trim()) {
      return NextResponse.json(
        { success: false, error: "Your role is required." },
        { status: 400 }
      );
    }
    const role = rawRole.trim();
    if (role.length > 120) {
      return NextResponse.json(
        { success: false, error: "Role description must be under 120 characters." },
        { status: 400 }
      );
    }

    // 4. Validate Optional Research Question
    let research_question: string | null = null;
    if (typeof rawQuestion === "string" && rawQuestion.trim()) {
      research_question = rawQuestion.trim().slice(0, 1000);
    }

    // 5. Validate Optional Heard About Us
    let heard_about_us: string | null = null;
    if (typeof rawHeardAboutUs === "string" && rawHeardAboutUs.trim()) {
      heard_about_us = rawHeardAboutUs.trim().slice(0, 100);
    }

    // 6. Connect to Supabase REST endpoint
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // Server misconfiguration - don't expose details
      return NextResponse.json(
        { success: false, error: "Waitlist submissions are temporarily unavailable. Please try again shortly." },
        { status: 503 }
      );
    }

    const endpoint = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/waitlist_submissions`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        email,
        company_website,
        role,
        research_question,
        heard_about_us,
      }),
    });

    if (response.status === 201) {
      return NextResponse.json(
        {
          success: true,
          message: "Your beta access request has been received.",
        },
        { status: 201 }
      );
    }

    if (response.status === 409) {
      return NextResponse.json(
        {
          success: false,
          error: "You've already requested beta access with this email.",
        },
        { status: 409 }
      );
    }

    // Parse potential database error for duplicate key code
    const errorBody = await response.text();
    if (errorBody.includes("23505") || errorBody.toLowerCase().includes("unique")) {
      return NextResponse.json(
        {
          success: false,
          error: "You've already requested beta access with this email.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unable to submit your request at this moment. Please try again.",
      },
      { status: 500 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
