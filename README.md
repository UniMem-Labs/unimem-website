# UniMem website

The marketing website for UniMem: memory infrastructure for AI agents and robots. Built with Next.js App Router, React, TypeScript, and a self-hosted Geist font.

## Develop

Use Node.js 22 or later.

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

## Check and build

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

For browser and accessibility checks, install Chromium and run the existing suite:

```bash
npx playwright install chromium
npm run test:e2e
```

## Project structure

- `src/app`: pages, metadata, shared styles, and the contact API.
- `src/components`: navigation, interactive memory demo, code examples, and contact form.
- `src/lib`: content, site configuration, and contact validation.
- `public`: self-hosted font with its required license, plus security contact information.
- `tests`: contact boundary tests and browser/accessibility checks.
- `docs`: deployment instructions and the source claim map.

## Deploy

Import `UniMem-Labs/unimem-website` into Vercel. Set the server variables documented in [.env.example](.env.example) for contact delivery. Without them, the form reports that delivery is unavailable. Analytics are opt-in.

See [deployment instructions](docs/deployment.md) and the [product claim map](docs/product-map.md). Product links and installation examples target `UniMem-Labs/unimem`; complete the planned product repository move before launch. Review benchmark evidence, legal drafts, and production configuration before launch.
