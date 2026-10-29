# QA report and remaining limits

Verified 2026-10-26 against the final local production build. Environment: Node 24.19.0, npm 11.9.0, Next.js 16.4.3, React 19.3.1, TypeScript, Chromium through Playwright. Deployment target is Vercel; the website has not been deployed to Vercel in this session.

## Results

| Check                           | Result                                                                                                                                                                                                          |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Production build                | Passed; 16 statically generated content routes, one dynamic contact endpoint, framework metadata/image routes.                                                                                                  |
| TypeScript                      | `npm run typecheck` passed.                                                                                                                                                                                     |
| Lint                            | `npm run lint` passed with zero warnings.                                                                                                                                                                       |
| Contact unit and boundary suite | 6 tests passed, including multi-case invalid inputs, actual streamed byte bounds, origin/media checks, unconfigured failure, shared-limit failure, delivery failure, idempotency, and plain-text payload.       |
| Browser suite                   | All 33 tests passed against `npm start`.                                                                                                                                                                        |
| Per-page accessibility          | Axe WCAG 2 A/AA, 2.1 A/AA, 2.2 AA, and best-practice checks found no violations in the scanned initial state of all 16 pages. This is not a full accessibility conformance audit.                               |
| Responsive                      | All 16 routes fit at 320 and 768 px. Home, developers, and contact also fit at 375, 430, 1024, 1440, and 1920 px. Homepage screenshots at all seven widths were inspected.                                      |
| Navigation                      | All main-content internal links resolve; primary destination routes tested; mobile menu opens, navigates, and closes.                                                                                           |
| Keyboard                        | Skip link receives first Tab focus; menu, demo, code controls, and form have native keyboard-operable elements and visible focus.                                                                               |
| Motion                          | Reduced-motion emulation verifies non-smooth scrolling; CSS disables transitions and animation. No autoplay animation exists.                                                                                   |
| Demo                            | Five stages work; configured withdrawal illustration is visible; simulation labeling remains present.                                                                                                           |
| Code examples                   | Tab switching and clipboard copy verified in Chromium. Actual product quickstart separately executed.                                                                                                           |
| Form                            | Required fields focus and show errors; actual unavailable endpoint returns a visible failure and retains values. Browser test routes the canonical Origin to the local production endpoint. No live email sent. |
| Metadata                        | One H1 per page, branded title, description, canonical URL, share-image field, social-card field, and parseable JSON-LD verified. Titles/descriptions are distinct by content definition.                       |
| Robots, sitemap, manifest       | Return successfully; sitemap uses the canonical production host.                                                                                                                                                |
| Social image                    | Generated 1200 × 630 PNG returns successfully; visual layout inspected. No official social account is asserted.                                                                                                 |
| Error handling                  | Unknown route returns HTTP 404 and custom recovery links; client error boundary included.                                                                                                                       |
| Headers                         | MIME sniffing prevention and frame denial verified; additional headers configured in `next.config.ts`.                                                                                                          |
| Console                         | Browser page-error collection found no exceptions or hydration errors on checked pages.                                                                                                                         |
| Runtime dependencies            | `npm audit --omit=dev` reported 0 vulnerabilities at the time of the check. This is advisory coverage, not proof of zero defects.                                                                               |
| Source repository               | Original product working tree remains clean.                                                                                                                                                                    |

During iteration, accessibility checks identified low-contrast diagram labels, a skipped heading level in the demo, and a mobile menu accessible-name mismatch. These were corrected and the final full browser suite passed.

## Lighthouse mobile lab result

Final production-local run with Lighthouse 13.5.0 and mobile simulated throttling:

| Category / metric        | Result |
| ------------------------ | -----: |
| Performance              |     98 |
| Accessibility            |    100 |
| Best practices           |    100 |
| SEO                      |    100 |
| First Contentful Paint   |  0.8 s |
| Largest Contentful Paint |  2.3 s |
| Cumulative Layout Shift  |      0 |
| Total Blocking Time      |  90 ms |

Exact values are in `lighthouse-summary.json`. This is one local synthetic run of the refined design, not a production Core Web Vitals claim. Real INP, network conditions, regional latency, Vercel hosting behavior, and field percentiles are unmeasured. Review real user performance after launch. Framework JavaScript still includes code the single-page audit marks unused; no large presentation library or third-party imagery is added.

Reproduce on a running production server:

```bash
CHROME_PATH=/usr/bin/chromium npx lighthouse http://127.0.0.1:3000 \
  --chrome-flags='--headless --no-sandbox' \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output-path=./lighthouse.json
```

## Source-product verification

The source checkout is `commontrace-v2@c9541a187b48093aa75d6cbb006eea007014efc5`. All 1,521 tracked files are inventoried with hashes. The claim-focused assessment and qualifications are in `product-map.md`; this is not an exhaustive six-pass audit of every source line.

Executed:

```bash
python -m pip install -e .
python scripts/first_recall_smoke.py
python -m pytest tests/test_measure.py tests/test_promotion.py tests/test_memory_guard.py -q
```

The offline smoke returned the seeded fact exactly. The focused suite passed **67 tests** with one upstream `pydantic_settings` incomplete forward-reference warning in the MCP capture path. The test run did not provision the Hub, external vendors, hardware, or benchmark datasets. Full product CI was not rerun. No measured product performance claim appears on the website.

## Remaining launch work

1. **GitHub destination:** connected account `pavan-unimem` was verified, but the connected tools lack repository creation and the terminal is authenticated as `varma61923`. No alternate-account repository was created. The local website is initialized as its own Git repository with the intended remote; pushing requires an accessible destination under the intended account. An empty private `pavan-unimem/unimem-website` repository was requested from the user.
2. **Vercel:** import the destination repo into the intended Vercel account; no deployment credential was configured here. Verify the actual deployment, environment variables, redirects, HTTPS, and analytics behavior.
3. **Email and abuse service:** provision Resend and Upstash, set server variables, and verify a real inbox delivery. Upstream success/failure was mocked in tests. Unconfigured delivery fails explicitly.
4. **Legal and operations:** the legal pages intentionally remain labeled drafts. Confirm legal operator details, inquiry retention, deletion procedure, provider terms, and any consent requirements before public launch.
5. **DNS:** connect apex and www manually with the exact Vercel project records, preserving email DNS. No DNS changes were made.
6. **Manual coverage:** Chromium was used; Safari, Firefox, physical devices, screen readers, live external-client integration, and production field metrics were not tested.
7. **Source evolution:** product claims are pinned to the inspected source snapshot. Review source changes before updating site claims; the repository’s metadata and README have inconsistent release-stage labels, so the website avoids claiming general production maturity.

Desktop and mobile homepage captures are included as `preview-home-desktop.png` and `preview-home-mobile.png`. Browser-generated per-width evidence is reproducible with `npm run test:e2e` and is intentionally ignored by Git except for these selected review artifacts.

## Second design pass

See [the refinement review](refinement-review.md) for fresh before/after captures and numbered findings. Browser checks now cover menu Escape/outside dismissal, mobile outline disclosure, scroll position tracking, clipboard fallback and feedback reset, live field correction, optional notes, all memory stages without layout movement, and all routes at narrow widths. Contact retry tests also verify identical retries deduplicate and edited payloads receive distinct keys.
