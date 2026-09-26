import { NextRequest, NextResponse } from "next/server";
import { validateAndSanitizeUrl } from "@/lib/security/ssrf";
import { rateLimiter, RATE_LIMITS, getClientIp } from "@/lib/security/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PAYLOAD_SIZE = 25 * 1024; // 25 KB

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Check by Client IP
    const clientIp = getClientIp(request.headers);
    const rateLimitResult = rateLimiter.check(
      `waitlist:${clientIp}`,
      RATE_LIMITS.WAITLIST_SUBMISSIONS.limit,
      RATE_LIMITS.WAITLIST_SUBMISSIONS.windowMs
    );

    if (!rateLimitResult.allowed) {
      const minutesLeft = Math.ceil(rateLimitResult.resetMs / 60000);
      return NextResponse.json(
        {
          success: false,
          error: `Too many submissions. Please wait ${minutesLeft} minute(s) before submitting again.`,
        },
        { status: 429 }
      );
    }

    // 2. Payload size check
    let body: unknown;
    try {
      const text = await request.text();
      if (text.length > MAX_PAYLOAD_SIZE) {
        return NextResponse.json(
          { success: false, error: "Payload exceeds size limit." },
          { status: 413 }
        );
      }
      body = JSON.parse(text);
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

    // 3. Validate Email
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

    // 4. Validate Company Website with SSRF Protection
    if (typeof rawWebsite !== "string" || !rawWebsite.trim()) {
      return NextResponse.json(
        { success: false, error: "Company website is required." },
        { status: 400 }
      );
    }
    const urlCheck = validateAndSanitizeUrl(rawWebsite);
    if (!urlCheck.isValid || !urlCheck.normalizedUrl) {
      return NextResponse.json(
        { success: false, error: urlCheck.error || "Please enter a valid company website URL." },
        { status: 400 }
      );
    }
    const company_website = urlCheck.normalizedUrl;

    // 5. Validate Role
    if (typeof rawRole !== "string" || !rawRole.trim()) {
      return NextResponse.json(
        { success: false, error: "Your role is required." },
        { status: 400 }
      );
    }
    const role = rawRole.trim().slice(0, 120);

    // 6. Validate Optional Fields
    let research_question: string | null = null;
    if (typeof rawQuestion === "string" && rawQuestion.trim()) {
      research_question = rawQuestion.trim().slice(0, 1000);
    }

    let heard_about_us: string | null = null;
    if (typeof rawHeardAboutUs === "string" && rawHeardAboutUs.trim()) {
      heard_about_us = rawHeardAboutUs.trim().slice(0, 100);
    }

    // 7. Connect to Supabase REST endpoint safely
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
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
