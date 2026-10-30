"use client";
import { Analytics, track } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect } from "react";
export function event(name: string, properties?: Record<string, string>) {
  if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true")
    track(name, properties);
}
export function SiteAnalytics() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== "true") return;
    const handler = (e: MouseEvent) => {
      const link = e.target instanceof Element ? e.target.closest("a") : null;
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (href.includes("github.com")) event("github_click");
      if (href === "/docs") event("docs_click");
      if (href.startsWith("/contact")) event("pilot_cta");
      if (href === "/enterprise") event("enterprise_navigation");
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
  return process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true" ? (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  ) : null;
}
