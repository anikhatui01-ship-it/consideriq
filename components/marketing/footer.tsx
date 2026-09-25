import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface text-foreground py-12 md:py-16">
      <Container size="wide">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-2">
            <Logo size="default" />
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              An intelligence and research instrument for understanding AI-mediated buying decisions.
              Discover where your brand enters, survives, or disappears from consideration.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="outline" className="text-[11px] font-mono py-0.5">
                Private Research Beta
              </Badge>
              <span className="text-xs text-muted-foreground">
                Early access validation
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/features" className="hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-foreground transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/waitlist" className="hover:text-foreground transition-colors">
                  Request Beta Access
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Methodology
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/how-it-works#decision-trail" className="hover:text-foreground transition-colors">
                  Decision Trail
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#evidence" className="hover:text-foreground transition-colors">
                  Evidence Drawer
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#methodology" className="hover:text-foreground transition-colors">
                  Observed vs Inferred
                </Link>
              </li>
              <li>
                <Link href="/about#principles" className="hover:text-foreground transition-colors">
                  Research Principles
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Methodology Disclaimer & Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-muted-foreground">
          <p className="max-w-2xl leading-relaxed">
            Methodology notice: ConsiderIQ simulations are analytical simulations based on AI provider outputs and user-specified scenarios.
            They are not predictions of actual human purchases and do not guarantee provider rankings.
          </p>
          <p className="shrink-0">
            &copy; {currentYear} ConsiderIQ. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
