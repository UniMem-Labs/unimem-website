import type { Metadata } from "next";
import localFont from "next/font/local";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SiteAnalytics } from "@/components/analytics";
import { SITE } from "@/lib/site";
import { pages } from "@/lib/content";
import type { SearchItem } from "@/components/site-search";
import "./globals.css";
import "./experience.css";
const geist = localFont({
  src: "../../public/fonts/geist.woff2",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});
const searchNames: Record<string, string> = {
  "/developers": "Developers · quickstart & integrations",
  "/platform": "Platform · one governed memory system",
  "/product": "The memory loop · remember, measure, govern",
  "/physical-ai": "Physical AI · robots & fleets",
  "/benchmarks": "Benchmarks · evidence & methodology",
  "/docs": "Documentation · setup, interfaces & guarantees",
  "/enterprise": "Enterprise · deployment & governance",
  "/about": "About UniMem",
  "/vision": "Vision · memory for intelligent machines",
  "/investors": "Investor overview",
};
const searchItems: SearchItem[] = [
  ...pages
    .filter((p) => !p.legal)
    .map((p) => ({
      title: searchNames[p.path] || p.title,
      path: p.path,
      description:
        p.path === "/developers"
          ? "Install locally. Connect Codex, Claude Code, Cursor, Windsurf, Python, or HTTP."
          : p.description,
    })),
  {
    title: "Learn · field notes",
    path: "/learn",
    description: "Guides to agent memory, context, and evidence.",
  },
  {
    title: "Contact · explore a pilot",
    path: "/contact",
    description: "Bring one workflow and one real memory problem.",
  },
];
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "UniMem — The memory system for intelligent machines",
    template: "%s | UniMem",
  },
  description:
    "The complete memory system for AI agents and robots, with randomized evidence of which memories help and governed change.",
  applicationName: "UniMem",
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav searchItems={searchItems} />
        <main id="main">{children}</main>
        <Footer />
        <SiteAnalytics />
      </body>
    </html>
  );
}
