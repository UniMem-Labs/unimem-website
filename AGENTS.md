<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Website skills

The project includes two upstream Anthropic skills under `.agents/skills`:

- Read [frontend-design](.agents/skills/frontend-design/SKILL.md) for visual design changes. Use the product's actual memory model and evidence in the design; preserve source-backed claims and accessible interactions.
- Read [webapp-testing](.agents/skills/webapp-testing/SKILL.md) for browser reconnaissance and verification. Run its `with_server.py --help` before using the helper, wait for network idle before inspecting dynamic pages, and capture screenshots for visual review.

The source revision and file hashes are recorded in `.agents/skills/anthropic-skills.lock.json`. Preserve the upstream skill files and their licenses. Project and user requirements take precedence over general examples in a skill. The normal TypeScript Playwright suite remains the CI gate; the Python browser workflow is an additional skill-driven check.
