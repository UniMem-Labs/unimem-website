import type { MetadataRoute } from "next";
import { pages } from "@/lib/content";
import { SITE } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/learn", "/contact", ...pages.map((p) => p.path)].map(
    (path) => ({ url: SITE + (path === "/" ? "" : path) }),
  );
}
