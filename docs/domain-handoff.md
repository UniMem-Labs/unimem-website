# Connect the canonical UniMem domain

The website is live at **https://getunimem.vercel.app** in the existing UniMem Vercel project `getunimem`. Production application commit: `6c508436bd4c16d2db82e64e2e9760ba7be815e7`. GitHub CI for that commit passed.

`unimem.org` and `www.unimem.org` are attached to that project and ownership-verified, but Vercel reports both as **misconfigured**. Ownership verification does not establish that public DNS reaches the deployment.

## Observed external DNS

The authoritative nameservers are `ns1.systemdns.com`, `ns2.systemdns.com`, and `ns3.systemdns.com`. This zone is not hosted by the connected Vercel account (`serviceType: external`, `zone: false`). Changing Vercel DNS would not change these authoritative answers.

| Host             | Current web record        | Observed response                                   |
| ---------------- | ------------------------- | --------------------------------------------------- |
| `unimem.org`     | A `64.99.64.37`           | Connection timeout / HTTP 503 from this environment |
| `www.unimem.org` | CNAME `zhs.zohosites.in.` | Zoho Sites 404                                      |

## Exact project recommendations

At the provider that manages that DNS zone, replace the existing web records with Vercel’s rank-1 recommendations returned for this specific project:

| Type  | Name / host | Value                                 |
| ----- | ----------- | ------------------------------------- |
| A     | `@`         | `216.198.79.1`                        |
| A     | `@`         | `64.29.17.1`                          |
| CNAME | `www`       | `e654c151d060245a.vercel-dns-017.com` |

Add both recommended apex A values. Replace the old apex web address and the Zoho Sites `www` CNAME. Preserve MX and email-related TXT records, including SPF, DKIM, and DMARC. No nameserver transfer or full-zone replacement is needed.

These values came from the connected Vercel project’s live domain configuration check on 2026-10-30. Recheck the domain panel if applying them substantially later rather than assuming the recommendation is permanent.

## Verify after the update

1. In Vercel → UniMem team → `getunimem` → Settings → Domains, refresh the configuration checks until the domain is no longer misconfigured and HTTPS is ready.
2. Open `https://unimem.org`, `/developers`, `/benchmarks`, and `/contact`.
3. Confirm `https://www.unimem.org/developers` redirects to the apex while preserving the path. That redirect is already configured in Vercel.
4. The site’s canonical URLs and sitemap already target `https://unimem.org`; no application rebuild is required for this DNS update.

The connected GitHub and Vercel accounts cannot update this external authoritative zone. The Vercel URL remains available while DNS is corrected. Contact currently prepares a local email draft; direct server delivery requires the credentials described in [deployment.md](deployment.md).
