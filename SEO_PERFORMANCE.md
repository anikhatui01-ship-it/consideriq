# ConsiderIQ — SEO & Performance Engineering Guide

**Purpose:** Give Antigravity explicit rules for building a public website that is crawlable, indexable, fast, accessible, and easy for Google to understand.

SEO improves technical eligibility and discoverability; it does not guarantee rankings or indexing.

## 1. Indexing policy

Index only genuinely useful public pages:

- `/`
- `/features`
- `/how-it-works`
- `/pricing`
- `/about`
- `/contact`
- `/blog/*`

Normally do not index:

- `/login`
- `/signup`
- `/forgot-password`
- `/app/*`
- private projects/results
- admin/settings
- temporary preview pages

Private content must remain protected by authentication even if robots rules disallow crawling.

## 2. Metadata contract

Every public page needs:

- unique `<title>`
- unique meta description
- one clear H1
- logical H2/H3 hierarchy
- canonical URL
- correct index/noindex state
- descriptive internal links
- meaningful body copy
- Open Graph metadata
- mobile-friendly layout

Examples:

Home: `ConsiderIQ — AI Buyer Journey Intelligence`

Feature: `AI Buyer Journey Simulator | ConsiderIQ`

Article: `How AI Buyers Evaluate Software | ConsiderIQ`

Do not keyword-stuff titles or descriptions.

## 3. Canonicals

Every indexable page should normally use a self-referencing canonical.

Normalize:

- HTTPS
- preferred host
- trailing-slash policy
- case
- tracking parameters

`?utm_source=reddit` must not become a separate canonical page.

## 4. Robots.txt

Create `app/robots.ts`.

Baseline:

```txt
User-agent: *
Allow: /

Disallow: /app/
Disallow: /api/
Disallow: /login
Disallow: /signup
Disallow: /settings

Sitemap: https://consideriq.com/sitemap.xml
```

Replace the hostname after the real domain is chosen. Never use robots.txt as an access-control mechanism.

## 5. XML sitemap

Create `app/sitemap.ts`.

Include only canonical, indexable public URLs. Exclude authenticated pages, APIs, redirects, noindex pages, duplicates and error pages.

Submit the production sitemap through Google Search Console after launch.

## 6. Structured data

Use JSON-LD only when it accurately describes visible page content.

Potential types:

- `Organization`
- `WebSite`
- `SoftwareApplication` when appropriate
- `Article`
- `BreadcrumbList`

Never fabricate reviews, ratings, prices, awards, customer counts or scores.

Validate markup with Google's Rich Results Test. Structured data can help Google understand pages, but it does not guarantee a rich result.

## 7. Public content architecture

Create useful, people-first content around genuine topics:

- AI buyer journey
- AI brand visibility
- LLM brand visibility
- AI search visibility
- GEO / AEO
- measuring AI recommendations
- AI-search competitor analysis

Do not mass-create thin keyword pages.

## 8. Internal linking

Use descriptive anchor text and build topic clusters.

Good: `learn how AI buyer visibility works`

Avoid: `click here`

## 9. Images

- Prefer WebP/AVIF where useful.
- Reserve width/height to prevent layout shift.
- Use descriptive alt text.
- Lazy-load below-the-fold images.
- Do not lazy-load the primary LCP image.
- Never put essential text only inside images.

## 10. JavaScript strategy

Prefer server-rendered HTML for public content. The title, H1, core copy, navigation and primary CTA must not depend on client-side JavaScript.

Avoid large client bundles for simple interactions.

## 11. Core Web Vitals targets

Engineering targets:

- LCP ≤ 2.5s
- INP ≤ 200ms
- CLS ≤ 0.1

Also target:

- Lighthouse Performance 90+
- Lighthouse Accessibility 95+
- minimal blocking JS
- optimized images
- fast mobile rendering

These are engineering targets, not ranking guarantees.

## 12. Performance rules

Prefer:

- server rendering
- caching stable content
- responsive images
- minimal font weights
- lazy-loading expensive application features
- code splitting
- tree shaking
- CSS for simple animations
- progressive hydration

Avoid:

- autoplay hero video
- multiple UI/icon libraries
- huge client-side tables
- duplicate server/client fetching
- excessive third-party scripts
- unnecessary animation libraries

## 13. Fonts

Use one primary family, preferably Geist or Inter.

Avoid many weights/styles. Prevent layout shifts during font loading.

## 14. URL rules

URLs must be lowercase, descriptive and stable.

Good: `/blog/ai-buyer-journey`

Bad: `/blog?id=381&cat=ai`

When changing an indexed URL: create a 301 redirect, update internal links, canonical and sitemap.

## 15. Search Console launch checklist

Before launch:

1. Verify domain.
2. Submit sitemap.
3. Inspect homepage.
4. Inspect important public pages.
5. Verify crawlability.
6. Check accidental `noindex`.
7. Verify canonicals.
8. Test mobile rendering.
9. Monitor indexing/crawl errors.

Allow time for Google to crawl and re-index new pages.

## 16. AI-search discoverability

Use clear, factual, structured public content. Do not try to manipulate AI systems with hidden instructions.

A future `llms.txt` may be maintained for other systems if useful, but Google says it is not required for Google Search and does not itself improve or hurt Google visibility.

Focus on useful original information, explicit definitions, structured content, strong brand identity and credible references.

## 17. CI checks

Antigravity should maintain automated checks for:

### Technical SEO
- metadata
- canonicals
- robots
- sitemap
- accidental noindex
- broken internal links
- redirects
- structured data

### Performance
- Lighthouse
- bundle size
- image sizes
- Core Web Vitals targets

### Accessibility
- keyboard navigation
- semantic structure
- labels
- contrast
- focus states

## 18. Required implementation files

```text
app/sitemap.ts
app/robots.ts
lib/seo/*
```

Create reusable metadata and JSON-LD helpers.

## 19. Official references

- Search Essentials: https://developers.google.com/search/docs/essentials
- SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Search appearance: https://developers.google.com/search/docs/appearance
- Structured data: https://developers.google.com/search/docs/appearance/structured-data/intro
- Page experience: https://developers.google.com/search/docs/appearance/page-experience
- Robots specification: https://developers.google.com/crawling/docs/robots-txt/robots-spec
- Search Console: https://search.google.com/search-console

When SEO advice conflicts with outdated internet folklore, prefer current Google documentation.
