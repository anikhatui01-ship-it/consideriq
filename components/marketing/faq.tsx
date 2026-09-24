"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/marketing/section-heading";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is ConsiderIQ and what problem does it solve?",
    answer:
      "ConsiderIQ is an AI Buyer Journey Simulator and brand-visibility intelligence tool. Rather than checking if your brand appears in a single static query, ConsiderIQ simulates multi-turn conversations where a realistic buyer specifies business requirements, eliminates unsuitable options, and asks for a final vendor recommendation.",
  },
  {
    question: "How is this different from traditional mention-counting or AI SEO trackers?",
    answer:
      "Most existing tools run single isolated prompts like 'What is the best CRM?' and count brand mentions. Real B2B buyers do not buy based on one prompt; they converse across multiple turns, adding constraints around security, budget, integration, and company size. ConsiderIQ tracks the full decision path to show the exact turn where your brand disappears and which competitor replaces you.",
  },
  {
    question: "Does ConsiderIQ guarantee AI search rankings or predict actual human purchases?",
    answer:
      "No. ConsiderIQ is an analytical research instrument, not a ranking guarantee. We do not claim to predict actual human purchasing decisions, nor do we claim to see hidden internal model reasoning. We provide empirical, inspectable data on how current AI models respond to realistic buyer prompts.",
  },
  {
    question: "What does 'Observed vs. Calculated vs. Inferred' mean?",
    answer:
      "This is our core data integrity principle: OBSERVED data is the verbatim, immutable text returned by the AI provider. CALCULATED data refers to measurable programmatic checks (e.g., survival rate across 10 runs). INFERRED data represents analytical interpretations regarding why a recommendation changed. We never disguise inferences as objective provider facts.",
  },
  {
    question: "Which AI providers and models are simulated?",
    answer:
      "In the beta release, simulation runs target leading conversational and search-enabled AI providers including Google Gemini, OpenAI (GPT-4o), and Anthropic Claude. Raw responses from each run are stored and inspectable in full.",
  },
  {
    question: "How do you handle privacy and data security?",
    answer:
      "You evaluate public brand presence using public website URLs and scenario criteria. We never require access to your internal customer CRM or sensitive corporate data. Furthermore, we maintain strict multi-tenant isolation and do not train models on your scenario configurations.",
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(0); // open first by default

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 md:py-24 border-t border-border bg-surface">
      <Container size="default">
        <SectionHeading
          badge="FAQ"
          title="Frequently asked questions"
          description="Clear answers about our simulation methodology, data principles, and capabilities."
        />

        <div className="max-w-3xl mx-auto divide-y divide-border border-y border-border">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            const contentId = `faq-content-${idx}`;
            const buttonId = `faq-header-${idx}`;

            return (
              <div key={idx} className="py-4 sm:py-5">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between text-left font-medium text-foreground hover:text-accent transition-colors gap-4 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1"
                >
                  <span className="text-base sm:text-lg font-semibold tracking-tight">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180 text-foreground"
                    )}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="pt-3 pb-1 text-sm sm:text-base text-muted-foreground leading-relaxed animate-in fade-in-0 slide-in-from-top-1 duration-150"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
