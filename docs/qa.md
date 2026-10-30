# Website verification

## Build and browser checks

The production build, ESLint, and TypeScript checks pass. All six contact boundary/delivery tests pass with provider calls mocked; no live email was sent.

The full browser suite passed all 42 checks across 21 content routes. It covers unique headings and metadata, canonicals, structured data, internal links, accessibility (WCAG 2 A/AA, 2.1 A/AA, 2.2 AA and best practices), seven viewport widths from 320 to 1920 pixels, mobile navigation, keyboard use, reduced motion, clipboard success/failure, and contact-draft validation. See [browser summary](evidence/browser-summary.json).

Four targeted browser checks also pass after the final mobile-graph and onboarding refinements: historical recall and all memory types including the mobile graph, OS/client command switching and copying, 320-pixel layout, and stable geometry/accessibility through all five memory-loop stages.

The contact test confirms preparing a draft makes no `/api/contact` request, preserves input, and creates a correctly addressed mailto link containing the entered inquiry. Sending and inbox receipt remain actions of the visitor’s email client. Server delivery remains conditional on the six documented credentials.

## Performance lab

One Lighthouse 13.5 mobile lab run against the local production build returned:

| Category / metric        | Result |
| ------------------------ | ------ |
| Performance              | 97     |
| Accessibility            | 100    |
| Best practices           | 100    |
| SEO                      | 100    |
| First contentful paint   | 0.91 s |
| Largest contentful paint | 2.43 s |
| Total blocking time      | 117 ms |
| Cumulative layout shift  | 0      |

This is a simulated-throttling lab result, not field Core Web Vitals or an INP guarantee. The raw metric summary is in [lighthouse-summary.json](evidence/lighthouse-summary.json). The site uses local fonts, static content generation, small client interaction boundaries, and no image/video framework or third-party search service.

## Visual evidence

- [Desktop hero](previews/hero-desktop.png) and [mobile hero](previews/hero-mobile.png).
- [Full desktop home](previews/home-desktop.png) and [full mobile home](previews/home-mobile.png).
- [Desktop benchmark explorer](previews/benchmarks-desktop.png) and [mobile benchmark explorer](previews/benchmarks-mobile.png).
- [Mobile graph](previews/graph-mobile.png), presented vertically so node labels remain readable.

The product source analysis, offline executable checks, feature boundaries, and benchmark qualifications are documented in [source-analysis.md](source-analysis.md). No claim is made that the complete upstream product test suite, external agent clients, optional model providers, PostgreSQL Hub, or hardware integrations were exercised for this website release.

## Deployment boundary

The intended destination is the existing `getunimem` Next.js project in the UniMem Vercel team, backed by `UniMem-Labs/unimem-website`, with `unimem.org` as canonical. Apex and www were already attached and verified. Deployment protection, DNS, and email records are not changed by this release. Analytics remain disabled unless explicitly configured.
