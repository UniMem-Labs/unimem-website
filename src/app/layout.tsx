import type { Metadata } from "next";
import localFont from "next/font/local";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SiteAnalytics } from "@/components/analytics";
import { SITE } from "@/lib/site";
import "./globals.css";
import "./refinements.css";
const geist = localFont({
  src: "../../public/fonts/geist.woff2",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});
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
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <SiteAnalytics />
      </body>
    </html>
  );
}
