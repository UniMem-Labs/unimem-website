# UniMem production domain

Verified on 2026-10-31: `https://unimem.org` serves successfully over HTTPS. `https://www.unimem.org/developers` redirects to the apex and preserves the path. Vercel reports the apex as correctly configured.

The project is `getunimem` in the UniMem team. Production tracks `UniMem-Labs/unimem-website` on `main`. The Vercel alias remains https://getunimem.vercel.app.

The authoritative zone remains at the external provider (`ns1.systemdns.com`, `ns2.systemdns.com`, `ns3.systemdns.com`). The apex now uses Vercel's recommended A records `216.198.79.1` and `64.29.17.1`. No DNS records were changed during this production-readiness update.

`NEXT_PUBLIC_SITE_URL` defaults to `https://unimem.org` and controls canonical URLs, structured data, robots, sitemap, and contact origin checks. Set it to another verified HTTPS origin when deliberately moving the site, update the security.txt canonical URL, and rebuild. Preserve existing mail records when managing DNS.

Contact currently composes an email in the visitor's browser. Server delivery remains disabled until the documented provider credentials are configured.
