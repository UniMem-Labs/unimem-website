import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "UniMem — Evidence-based agent memory",
    short_name: "UniMem",
    description: "Experience, with evidence.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f8f6",
    theme_color: "#174437",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
