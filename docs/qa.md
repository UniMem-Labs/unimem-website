# Website verification

## Build and browser checks

The production build, ESLint, and TypeScript checks pass. All six contact boundary/delivery tests pass with provider calls mocked; no live email was sent.

The full browser suite passed all 42 checks across 21 content routes. It covers unique headings and metadata, canonicals, structured data, internal links, accessibility (WCAG 2 A/AA, 2.1 A/AA, 2.2 AA and best practices), seven viewport widths from 320 to 1920 pixels, mobile navigation, keyboard use, reduced motion, clipboard success/failure, and contact-draft validation. See [browser summary](evidence/browser-summary.json).

The installed Anthropic testing workflow also passes at four widths (1440, 768, 390, and 320 pixels). It covers memory lifecycle, historical recall, the mobile graph, OS/client instructions, keyboard search, benchmark scope, a local contact draft without a server request, and horizontal layout. See [Python browser summary](evidence/anthropic-browser-summary.json) and [skill installation and use](anthropic-skills.md).

The search regression check covers Escape while the search input contains text, focus restoration, and opening search over the mobile menu. The main suite also checks stable geometry/accessibility through all five memory-loop stages.

Production verification also caught a stale `/apple-icon.png` URL in the manifest. It now references the generated `/apple-icon` route. The metadata test fetches every manifest icon and checks its status and media type, preventing that silent 404 from returning.

The contact test confirms preparing a draft makes no `/api/contact` request, preserves input, and creates a correctly addressed mailto link containing the entered inquiry. Sending and inbox receipt remain actions of the visitor’s email client. Server delivery remains conditional on the six documented credentials.

## Performance lab

The final Lighthouse 13.5 mobile lab run against the local production build returned:

| Category / metric        | Result |
| ------------------------ | ------ |
| Performance              | 96     |
| Accessibility            | 100    |
| Best practices           | 100    |
| SEO                      | 92     |
| First contentful paint   | 0.94 s |
| Largest contentful paint | 2.62 s |
| Total blocking time      | 70 ms  |
| Cumulative layout shift  | 0      |

The full run reported a failed fetch of `robots.txt`, lowering SEO to 92. Direct HTTP, Node, and browser requests returned valid rules with HTTP 200, and a separate SEO-only diagnostic scored 100 without any application change. Both measurements are retained in the summary.

This is a simulated-throttling lab result, not field Core Web Vitals or an INP guarantee. The raw metric summary is in [lighthouse-summary.json](evidence/lighthouse-summary.json). The site uses local fonts, static content generation, small client interaction boundaries, and no image/video framework or third-party search service.

## Visual evidence

- [Desktop hero](previews/hero-desktop.png) and [mobile hero](previews/hero-mobile.png).
- [Full desktop home](previews/home-desktop.png) and [full mobile home](previews/home-mobile.png).
- [Desktop benchmark explorer](previews/benchmarks-desktop.png) and [mobile benchmark explorer](previews/benchmarks-mobile.png).
- [Mobile graph](previews/graph-mobile.png), presented vertically so node labels remain readable.

The product source analysis, offline executable checks, feature boundaries, and benchmark qualifications are documented in [source-analysis.md](source-analysis.md). No claim is made that the complete upstream product test suite, external agent clients, optional model providers, PostgreSQL Hub, or hardware integrations were exercised for this website release.

## Deployment boundary

The intended destination is the existing `getunimem` Next.js project in the UniMem Vercel team, backed by `UniMem-Labs/unimem-website`, with `unimem.org` as canonical. Apex and www were already attached and verified. Deployment protection, DNS, and email records are not changed by this release. Analytics remain disabled unless explicitly configured.

[GitHub CI](https://github.com/UniMem-Labs/unimem-website/actions) runs the build, lint, type, contact, and browser checks on production pushes. The public Vercel alias serves the production build. The canonical domain’s external DNS remains pending; see [domain-handoff.md](domain-handoff.md).
