# ConsiderIQ — Design System

## Goal
A serious research/intelligence product, not a generic “vibe-coded AI app”.

## Visual direction
- restrained
- fast
- evidence-first
- high information clarity
- one brand accent
- modern neutral typography

Avoid gradient-heavy AI clichés, glassmorphism everywhere, giant KPI walls, robot imagery, excessive rounded cards and decorative animation.

## UI stack
Tailwind + shadcn/ui + Radix primitives + Lucide icons. Use motion only when it clarifies state.

## Public site
Clear hero → problem → workflow → product evidence → FAQ → CTA.

## App
Desktop sidebar, responsive mobile navigation, 8px spacing system, tables for comparison, charts only when useful.

## Core screens
1. Landing
2. Waitlist/signup
3. Project setup
4. Persona/scenario builder
5. Running simulation
6. Results
7. Buyer journey
8. Scenario detail
9. Findings
10. History

## State design
Every async operation has loading/empty/error/success states. Never fake measured progress.

## Performance targets
- Lighthouse Performance ≥ 90 for the public landing page target
- minimize client JavaScript
- lazy-load heavy components
- optimize images
- minimize third-party scripts

## Brand voice
Analytical, clear, calm, evidence-oriented. Avoid hype such as “guaranteed”, “dominate AI”, “10x visibility”.
