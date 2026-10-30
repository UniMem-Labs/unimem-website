# Vercel deployment and domain setup

## Deploy the separate website repository

1. Use `UniMem-Labs/unimem-website`, independently of the product repository, and select the website branch intended for deployment.
2. In the intended Vercel team/account, choose **Add New → Project**, connect the intended GitHub account, and import `unimem-website`.
3. Use the Next.js framework preset, the repository root, Node 22 or later, install `npm ci`, and build `npm run build`. Leave the output directory on the Next.js default; this is not a static export because `/api/contact` is a server endpoint.
4. Configure variables below in the appropriate Preview/Production environments. Vercel supplies `VERCEL` and `VERCEL_URL`; do not replace them with client-provided values.
5. Deploy a preview, verify the pages and form failure handling, then verify a real inquiry in the configured recipient inbox. Provider acceptance alone does not guarantee inbox delivery.
6. Complete legal review and confirm public content, then promote the reviewed deployment to production.

The website uses the native Vercel Next.js runtime; no custom server or output directory is needed. The existing project is `getunimem` (`prj_R5VkyUwpFtEPdiYXOofMkxZeYxAS`) in the UniMem team (`team_99A257FRlxFqwgfNTLSyhXiR`). Production tracks `main`. Reuse that project rather than provisioning a duplicate.

Product links and install examples target the verified `https://github.com/varma61923/unimem`. Evidence links pin revision `4b6463ef337e1dabbdd9c095e054a1c494d96533`. The website lives independently at `UniMem-Labs/unimem-website`.

## Environment variables

| Variable                       | Required for           | Meaning                                                                                                                        |
| ------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `RESEND_API_KEY`               | Contact delivery       | Server-only Resend API credential, preferably restricted to sending.                                                           |
| `CONTACT_FROM`                 | Contact delivery       | Resend-verified sender, such as an address on a verified domain. Configure an actual sender; no address is presumed verified.  |
| `CONTACT_TO`                   | Contact delivery       | The operator’s intended inquiry inbox. The website’s direct email link uses the connected account’s verified identity address. |
| `UPSTASH_REDIS_REST_URL`       | Contact abuse controls | HTTPS REST endpoint ending in `.upstash.io`.                                                                                   |
| `UPSTASH_REDIS_REST_TOKEN`     | Contact abuse controls | Server-only Redis REST credential with the script operations required below.                                                   |
| `CONTACT_RATE_LIMIT_SECRET`    | Contact abuse controls | Independent random HMAC secret; generate with `openssl rand -hex 32`.                                                          |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Optional               | `true` enables Vercel Web Analytics and Speed Insights; default is disabled. Public boolean only, never a credential.          |

Use Vercel’s encrypted environment configuration. Do not commit `.env.local`, screenshots of keys, or provider credentials. Redeploy after changing environment variables. Keep Preview credentials separate where possible.

## Contact behavior and optional delivery

Without all six delivery variables, the page composes a plain-text email draft in the browser. The visitor reviews the note, then opens their email app or copies it. No contact POST is made, no fields are persisted by the website, and no sent confirmation is shown. If the operator configures all delivery variables and rebuilds, the page uses the server endpoint below.

## Contact endpoint contract

`POST /api/contact` accepts only JSON and an allowed Origin: `https://unimem.org`, the exact deployment `VERCEL_URL`, or localhost in development. A persistent custom preview alias requires an explicit reviewed allowlist addition. The `www` host redirects to the canonical apex before normal page interaction.

The endpoint bounds the actual request body to 12,288 bytes, validates field types and lengths, rejects control characters/header-shaped names, and sends plain text. The invisible honeypot and minimum elapsed time are anti-bot hints, not authentication or the primary rate limit.

An atomic Upstash Redis Lua script limits an HMAC-hashed IP to 5 attempts per 10 minutes and the deployment to 500 attempts per UTC day. Redis keys expire. Vercel-owned proxy headers provide the production client IP; other production proxies fail closed until deliberately implemented. Do not expose this endpoint behind an untrusted proxy and treat arbitrary forwarded headers as verified identity. The global cap bounds provider abuse but can also cause legitimate inquiries to fail during abuse; monitor provider usage and use Vercel firewall controls as traffic grows.

Redis failures fail closed. Resend delivery uses a stable request UUID plus a digest of the submitted fields for idempotency: identical retries deduplicate, while corrected submissions have a distinct key. Upstream requests have bounded timeouts. Success appears only after a valid successful provider response. Errors preserve the form and offer the email link. No inquiry bodies or IPs are logged by this application; hosting/provider logs have their own policies.

Reference contracts: [Vercel request headers](https://vercel.com/docs/headers/request-headers), [Upstash REST](https://upstash.com/docs/redis/features/restapi), [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys). These sources were checked during implementation. Live account provisioning, delivery, and provider retention were not verified.

## Connect unimem.org without disrupting email

1. Add `unimem.org` and `www.unimem.org` in **Vercel Project → Settings → Domains**. Confirm ownership using the exact verification record Vercel shows, if requested.
2. At the DNS provider, add/change only the web records Vercel specifies for these hosts. Use the exact current A/ALIAS/CNAME targets from that project’s domain panel; do not rely on an old hard-coded Vercel IP.
3. Preserve existing MX, SPF, DKIM, DMARC, and other email or service records. Resolve conflicting web-host records deliberately; do not replace the entire DNS zone.
4. Configure `www.unimem.org` to redirect permanently to `https://unimem.org`. `next.config.ts` also provides a host-based 308 redirect while preserving paths and query parameters.
5. Wait for Vercel DNS verification and HTTPS certificate issuance. Verify apex HTTPS and a `www` deep link, then inspect canonical URLs, sitemap, robots, and share image on production.
6. Submit `https://unimem.org/sitemap.xml` through the operator’s search-console account after launch. Do not promise indexing or rankings.

The apex and www domains were already attached and verified in the project during this refresh; this task does not replace DNS records. All canonical URLs already use `https://unimem.org`. Vercel deployment protection should keep unreviewed previews private; canonical tags do not replace access control.

## Analytics, caching, and security

All content routes are statically generated; assets use framework caching and hashed bundles. `/api/contact` explicitly sends `Cache-Control: no-store`. There is no third-party animation, video, font service, or client secret. The font is local and preloaded through `next/font/local`.

Analytics is opt-in. Custom event names: `github_click`, `docs_click`, `quickstart_copy`, `pilot_cta`, `enterprise_navigation`, and accepted `contact_submission`. Events exclude form content. Extend events in `src/components/analytics.tsx`; review privacy implications first. Production or Vercel project controls may be needed for preview analytics.

Headers include MIME sniffing prevention, strict-origin referrer policy, frame denial, feature restrictions, HSTS, and a baseline CSP. The CSP permits inline scripts/styles needed by this static Next.js configuration; it is not a nonce-based strict CSP. If adding third-party scripts, review the policy instead of broadly allowing arbitrary origins. Run HTTPS behind Vercel; real infrastructure behavior still needs production verification.

## Current domain status

The production application is publicly available at https://getunimem.vercel.app. The intended canonical domain is attached and ownership-verified, but its authoritative external DNS still routes away from Vercel. Apply the exact current web records in [domain-handoff.md](domain-handoff.md); changing the non-authoritative Vercel DNS zone cannot fix that routing.
