import type { Metadata } from "next";
const configuredSite = process.env.NEXT_PUBLIC_SITE_URL || "https://unimem.org";
const siteUrl = new URL(configuredSite);
if (
  siteUrl.protocol !== "https:" ||
  siteUrl.pathname !== "/" ||
  siteUrl.search ||
  siteUrl.hash ||
  siteUrl.username ||
  siteUrl.password
)
  throw new Error(
    "NEXT_PUBLIC_SITE_URL must be an HTTPS origin without a path or credentials.",
  );
export const SITE = siteUrl.origin;
export const REPO = "https://github.com/varma61923/unimem";
export const SOURCE_COMMIT = "4b6463ef337e1dabbdd9c095e054a1c494d96533";
export const SOURCE = `${REPO}/blob/${SOURCE_COMMIT}`;
export const CONTACT = "Pavan.Mudunuri@unimem.org";
export function metadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title: { absolute: `${title} | UniMem` },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | UniMem`,
      description,
      url: path,
      siteName: "UniMem",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | UniMem`,
      description,
      images: ["/opengraph-image"],
    },
  };
}
