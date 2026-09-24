# ConsiderIQ — UI/UX & Visual Product Design Guide

**Purpose:** Give Antigravity a concrete visual and interaction system so ConsiderIQ feels intentionally designed by a strong product team rather than generated from a generic SaaS template.

## 1. Product personality

ConsiderIQ should feel like:

**A modern research instrument for understanding AI-mediated buying decisions.**

Desired feelings:

1. Clarity — “I immediately understand what happened.”
2. Curiosity — “I want to inspect why the result changed.”
3. Confidence — “I can trace this conclusion back to evidence.”

Avoid the feel of:

- generic AI wrapper
- noisy SEO dashboard
- developer admin panel
- sci-fi AI website
- template SaaS

## 2. Psychological design principles

Use psychology to reduce cognitive load and improve comprehension, never to trick users.

### Progressive disclosure

Show the conclusion first, then evidence, then raw conversation/details.

### Recognition over recall

Explain metrics inline. Do not force users to remember terminology.

### Signal before detail

First show:

> You disappeared when enterprise-security requirements were introduced.

Then show sample size/evidence and allow inspection.

### Chunking

Group information into:

- outcome
- journey
- competitors
- evidence
- next investigations

### Spatial hierarchy

The visual story should be:

```text
WHAT HAPPENED
      ↓
WHY IT CHANGED
      ↓
WHERE YOU LOST
      ↓
WHAT TO INSPECT NEXT
```

## 3. Emotional arc of a simulation

### Anticipation

“Let's see what happens.”

### Discovery

Show the buyer conversation unfolding.

### Tension

Reveal where the brand starts losing.

### Explanation

Show the observable change and supporting evidence.

### Agency

End with things the user can investigate or test next.

Do not end with a meaningless score.

## 4. Visual language

Use a restrained, editorial interface:

- warm/off-white or light neutral base
- near-black primary text
- one distinctive brand accent
- muted semantic colors
- subtle borders
- restrained shadows

Avoid:

- purple/blue AI gradients everywhere
- rainbow charts
- glowing cards
- glassmorphism on every section
- giant shadows
- decorative AI imagery

## 5. Typography

Use Geist or Inter.

Suggested scale:

```text
Display: 56/1.05
H1: 44/1.10
H2: 32/1.15
H3: 22/1.25
Body: 16/1.60
Small: 14/1.50
Micro: 12/1.40
```

Adjust responsively.

## 6. Grid

Marketing:

- max width around 1200–1280px
- 12-column desktop grid
- generous margins
- all major sections aligned to the same grid

Application:

- compact sidebar
- main content
- optional detail panel

Consistency of alignment matters more than decoration.

## 7. Spacing

Use an 8px rhythm:

```text
4 8 12 16 24 32 40 48 64 80 96 128
```

Do not scatter arbitrary values throughout components.

## 8. Shape and shadows

Suggested radii:

- controls: 8px
- cards: 12–16px
- major containers: 20–24px

Not every section needs a card.

Use whitespace, typography and dividers for hierarchy too.

Shadows should be subtle. Floating elements may have slightly stronger elevation.

## 9. Navigation

Desktop:

```text
┌─────────────────────────────────────────────┐
│ Logo                         Project  User  │
├────────────┬────────────────────────────────┤
│ Overview   │                                │
│ Projects   │             Content            │
│ Personas   │                                │
│ Scenarios  │                                │
│ Simulations│                                │
│ Findings   │                                │
│ History    │                                │
│            │                                │
│ Settings   │                                │
└────────────┴────────────────────────────────┘
```

Keep the sidebar calm and compact. Use icons as reinforcement, never as the only meaning.

## 10. Landing page

Do not use a generic:

Hero → 3 cards → pricing → FAQ → gradient

Instead:

### Hero

**See how AI buyers evaluate your brand.**

Subheadline:

**Simulate realistic buyer journeys and discover where your brand enters, survives, or disappears from the shortlist.**

CTA:

**Run a buyer simulation**

Secondary:

**See how it works**

Immediately show the actual product concept.

## 11. Hero visual

Do not use an abstract AI illustration.

Show the decision path:

```text
BUYER
“Best project-management tool for a 25-person SaaS?”
             ↓
AI SHORTLIST
You · Competitor A · Competitor B · Competitor C
             ↓
BUYER ADDS
“Security is important.”
             ↓
Competitor C eliminated
             ↓
FINAL QUESTION
“Which would you choose?”
             ↓
FINAL SHORTLIST
Competitor A · You
```

This communicates the product without a wall of copy.

## 12. CTA design

Prefer specific verbs:

**Run a buyer simulation**

Avoid vague:

- Get Started
- Explore AI
- Discover
- Learn More

## 13. Onboarding

Keep first-run onboarding to 3–4 steps:

1. Brand
2. Buyer
3. Competitors
4. Run simulation

Use sensible defaults. Allow skipping nonessential fields.

Do not make users fill 25 fields before the first result.

## 14. Simulation screen

Show real state only:

```text
Simulating buyer journey

Persona: Startup Founder
Scenario: 3 of 10

Conversation
─────────────
Buyer: ...
AI: ...
Buyer: ...
```

Never fake progress percentages.

If exact progress is unknown, use:

`Running analysis…`

## 15. Results hierarchy

First viewport should answer:

**What happened?**

Example:

> **Your brand was shortlisted in 6 of 10 scenarios.**

Then:

> **You most often disappeared when enterprise-security requirements were introduced.**

Then concise metrics:

```text
Discovery       6/10
Shortlisted     5/10
Recommended     4/10
Final choice    2/10
```

Do not put 20 KPIs above the key explanation.

## 16. Signature component: Decision Trail

Create a reusable component:

`<DecisionTrail />`

Concept:

```text
START
  │
  ▼
General need
5 brands considered
  │
  ▼
Budget constraint
Competitor C eliminated
  │
  ▼
Security constraint
Your brand drops
  │
  ▼
Integration requirement
Competitor A survives
  │
  ▼
FINAL RECOMMENDATION
Competitor A
```

The trail is the visual identity of the product.

## 17. Elimination moments

Give meaningful emphasis to the moment a brand drops:

```text
⚠ You disappeared here

Buyer requirement:
“Must have enterprise SSO.”

Your brand:
No longer shortlisted

Competitor A:
Remained in consideration

[Inspect evidence]
```

Do not make normal competitive loss look like a catastrophic error state.

## 18. Competitor comparison

Prefer focused comparisons over giant tables.

```text
                 You    Competitor A
Discovery        6/10       8/10
Shortlist        5/10       7/10
Final choice     2/10       5/10
```

Then make “where they outperform” expandable.

## 19. Evidence panel

Use explicit methodological labels:

**OBSERVED**
What the provider actually returned.

**CALCULATED**
What the application measured.

**INFERRED**
A cautious interpretation based on the data.

Example:

```text
Why did this result change?

OBSERVED
Competitor A remained recommended after the
enterprise-security requirement was added.

ASSOCIATED EVIDENCE
Review source
Industry article
Comparison page

INTERPRETATION
These sources may be contributing to the
competitor's stronger presence in this scenario.
```

Never present inference as hidden model reasoning.

## 20. Uncertainty

Make uncertainty visible:

- `10 runs`
- `Recommendation varied in 4 of 10 runs`
- `Citation metadata unavailable`
- `Likely contributing factor`

Uncertainty is a trust signal.

## 21. Empty states

Bad:

`Nothing here.`

Better:

```text
No simulations yet

Create your first buyer scenario to see how
your brand behaves across AI-assisted
recommendation journeys.

[Create simulation]
```

Every empty state should explain:
1. what happened
2. why it matters
3. the next action

## 22. Error states

Bad:

`ERROR 500`

Better:

```text
We couldn't complete this scenario.

Possible cause:
The provider timed out.

[Retry scenario] [View details]
```

Be specific and recoverable.

## 23. Loading states

Use skeletons where the final layout is known.

For AI generation, combine skeletons with meaningful status text.

Never use decorative fake percentage progression.

## 24. Motion

Motion communicates state and continuity, not spectacle.

Suggested durations:

```text
micro: 100–160ms
standard: 180–240ms
emphasis: 280–400ms
```

Use subtle opacity/translate/scale transitions. Respect `prefers-reduced-motion`.

## 25. Micro-interactions

Every interaction should acknowledge completion:

`Copy` → `Copied`

`Save changes` → `Saved`

`Run simulation` → `Running…` → `Simulation complete`

## 26. Data visualization

Charts are allowed only when they reveal a meaningful pattern:

- recommendation frequency
- run-to-run change
- provider comparison
- persona comparison
- elimination funnel

For small datasets, prefer a sentence or focused table.

## 27. Mobile

Do not simply stack desktop cards.

Mobile priority:

1. result
2. explanation
3. buyer journey
4. evidence
5. details

Use expandable sections/bottom sheets where appropriate.

Important information should remain understandable without horizontal scrolling.

## 28. Accessibility

Target WCAG 2.2 AA where practical:

- keyboard navigation
- visible focus
- adequate contrast
- semantic headings
- form labels
- accessible dialogs
- descriptive links
- reduced motion
- screen-reader-friendly states

Color must never be the only signal.

## 29. Creative differentiation

Build a consistent visual motif around:

```text
QUESTION
   ↓
CONSTRAINT
   ↓
SHORTLIST
   ↓
ELIMINATION
   ↓
RECOMMENDATION
```

Reuse that motif in the hero, onboarding, simulation, results, blog visuals and screenshots.

## 30. Evidence Drawer

Create:

`<EvidenceDrawer />`

Sections:

1. observed response
2. evidence/citations
3. classification
4. interpretation
5. methodology

Open it without navigating the user away from the current scenario.

## 31. Design tokens

Centralize tokens instead of scattering values:

```css
--radius-sm
--radius-md
--radius-lg

--space-1
--space-2
--space-3
--space-4
--space-6
--space-8
--space-12
--space-16

--text-primary
--text-secondary
--text-muted

--surface
--surface-raised
--border

--accent
--success
--warning
--danger
--info
```

## 32. Component rules for Antigravity

Before creating a new component:

1. Search existing components.
2. Reuse tokens.
3. Reuse existing primitives.
4. Check responsive behavior.
5. Check loading/empty/error states.
6. Check keyboard accessibility.
7. Check reduced-motion behavior.

Prefer consistency over novelty.

## 33. Vibe-coded smell checklist

Reject implementations with:

- every element inside a rounded card
- purple gradients everywhere
- random glassmorphism
- oversized icons
- fake animated counters
- excessive shadows
- inconsistent radii
- inconsistent spacing
- duplicate buttons
- random font sizes
- huge empty areas
- charts with no insight
- fake testimonials/logos/counts
- generic “AI powered” copy
- dead buttons
- lying loading states

## 34. Final visual acceptance test

### Homepage, 5 seconds
A new visitor should understand:

1. what ConsiderIQ is
2. who it is for
3. what it simulates
4. why it is different from a simple visibility score
5. what to do next

### Results page, 5 seconds
A user should understand:

1. whether the brand survived
2. where it lost
3. which competitor replaced it
4. what requirement changed the outcome

If these answers require opening five menus, simplify the interface.

## 35. Product feeling

Do not make the product “look AI.”

Make it feel:

**precise, calm, intelligent, trustworthy, and slightly intriguing.**

The interface should feel like a strong analyst sitting beside the user and saying:

> “Here is what happened. Here is exactly where it changed. Let's inspect why.”
