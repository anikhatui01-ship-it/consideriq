"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What does ConsiderIQ do?",
    answer:
      "When people use AI assistants like ChatGPT, Claude, or Gemini to find business software, they rarely stop after one question. They ask for options, introduce constraints (like budget or security), and compare recommendations. ConsiderIQ models these multi-step conversations to show where your brand is included, where it gets dropped, and which competitor is recommended instead.",
  },
  {
    question: "Is ConsiderIQ live?",
    answer:
      "ConsiderIQ is currently in a Private Research Beta. We are validating our buyer-journey models and decision-trail methodology with early research participants before deploying the fully automated, self-serve simulation engine.",
  },
  {
    question: "Are the examples real?",
    answer:
      "No. The Decision Trail and Evidence Drawer shown on this site are illustrative examples designed to demonstrate our diagnostic methodology. They are clearly labeled as examples and do not show real customer data or live production runs.",
  },
  {
    question: "Does ConsiderIQ guarantee AI recommendations?",
    answer:
      "No. ConsiderIQ is an analytical research tool, not an optimization guarantee. We do not predict human sales or promise that an AI model will rank your product first. We measure and diagnose how AI models respond to realistic, multi-step buyer scenarios.",
  },
  {
    question: "Who is ConsiderIQ for?",
    answer:
      "ConsiderIQ is designed for B2B founders, product marketers, growth teams, and search practitioners who want to understand how their brand performs when prospective buyers consult AI models for software choices.",
  },
  {
    question: "How does the research work?",
    answer:
      "We define a realistic buyer profile (such as team size, technical stack, and compliance needs), generate the sequence of questions that buyer would naturally ask, evaluate how AI models respond at each turn, and record the exact points where vendors are shortlisted or eliminated.",
  },
  {
    question: "What happens in the private beta?",
    answer:
      "In the private beta, we work directly with selected research participants to configure custom buyer personas for their category, run scenario tests, and review their decision trails. Access is completely free during this research period.",
  },
  {
    question: "Do I need technical knowledge?",
    answer:
      "No. You only need to know your product, your website, your typical customer profile, and the competitors you most frequently encounter in real-world buying conversations.",
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(0); // open first item by default

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 md:py-24 border-t border-border bg-surface" id="faq">
      <Container size="default">
        <SectionHeading
          badge="FAQ"
          title="Questions? Here's the simple version."
          description="Straightforward answers about what ConsiderIQ is, how the research works, and what to expect during our private beta."
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
                  className="flex w-full items-center justify-between text-left font-medium text-foreground hover:text-primary transition-colors gap-4 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1 min-h-[44px]"
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
                    className="pt-2 pb-1 text-sm sm:text-base text-muted-foreground leading-relaxed animate-in fade-in-0 duration-150"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA block as requested in Part 10 */}
        <div className="mt-12 text-center max-w-md mx-auto space-y-3">
          <p className="text-sm text-muted-foreground">
            Still have a question?
          </p>
          <Button asChild size="default" className="gap-2">
            <Link href="/waitlist">
              <span>Request Beta Access</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
