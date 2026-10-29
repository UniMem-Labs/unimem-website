import type { Metadata } from "next";
export const SITE = "https://unimem.org";
export const REPO = "https://github.com/varma61923/unimem";
export const SOURCE = `${REPO}/blob/c9541a187b48093aa75d6cbb006eea007014efc5`;
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
