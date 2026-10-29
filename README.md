# UniMem.org

A separate, Vercel-ready marketing website for UniMem. Next.js App Router, TypeScript, React, self-hosted Geist, static content pages, and small client interactions. Product source was analyzed at `varma61923/unimem@c9541a1` (formerly `commontrace-v2`); this repository does not contain or modify the product implementation.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. Node 22 or later is required. The lockfile pins dependency resolutions.

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

Browser QA after building:

```bash
npx playwright install chromium
npm run test:e2e
# Or use an installed Chromium:
CHROME_PATH=/usr/bin/chromium npm run test:e2e
```

## Included

- 18 substantive content routes: homepage, product, developers, enterprise, three use cases, docs index, learn index, three articles, benchmarks, investors, about, contact, privacy, and terms.
- `/benchmarks` publishes the product's LoCoMo, LongMemEval and BEAM results with baselines, sample sizes and caveats. `/investors` states the thesis, status (pre-launch, no revenue) and risks. Figures come from the product repository's `docs/memory-benchmarks.md` and README; update them when the product docs change.
- Explicitly simulated, interactive memory loop; real CLI/Python/MCP/HTTP interface examples; copy controls; responsive navigation.
- Per-page SEO, sitemap, robots, share PNG, favicon, manifest, breadcrumbs, and appropriate structured data.
- Bounded, validated contact endpoint with shared atomic rate limits, idempotent email delivery, and honest failure states.
- Opt-in Vercel analytics and Speed Insights. No tracking by default.
- Source assessment, positioning, design system, keyword map, editorial roadmap, deployment instructions, and QA evidence.

## Before launch

The pages render without environment variables. Contact delivery requires all server variables in [.env.example](.env.example), a verified Resend sender, and an Upstash Redis instance. Without configuration the form returns an explicit unavailable message and retains the visitor’s entries. An existing direct email link remains available. A live email was not sent during testing.

Privacy and terms are visibly labeled drafts for operator/legal review. Review them, deployment settings, and optional analytics before a public launch. DNS is not changed by this repository.

See [deployment and domain setup](docs/deployment.md), [QA and limitations](docs/qa.md), [source product assessment](docs/product-map.md), [positioning and design](docs/positioning-and-design.md), and [SEO and editorial strategy](docs/seo-and-content.md).

The [refinement review](docs/refinement-review.md) shows the visual and interaction changes from the second design pass.
