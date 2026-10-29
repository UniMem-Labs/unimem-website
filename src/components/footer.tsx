import Link from "next/link";
import { Mark, Arrow } from "./icons";
import { REPO } from "@/lib/site";
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div>
          <Link href="/" className="wordmark">
            <Mark />
            UniMem.
          </Link>
          <p>Memory your machines can trust.</p>
          <span className="eyebrow">UNIFIED MEMORY</span>
        </div>
        <div className="footer-links">
          <div>
            <span>Build</span>
            <Link href="/platform">Platform</Link>
            <Link href="/product">Memory loop</Link>
            <Link href="/developers">Developers</Link>
            <Link href="/docs">Documentation</Link>
            <Link href="/benchmarks">Benchmarks</Link>
            <a href={REPO}>
              Source on GitHub <Arrow diagonal />
            </a>
          </div>
          <div>
            <span>Explore</span>
            <Link href="/enterprise">Enterprise</Link>
            <Link href="/physical-ai">Physical AI</Link>
            <Link href="/use-cases/coding-agents">Coding agents</Link>
            <Link href="/use-cases/multi-agent-systems">
              Multi-agent systems
            </Link>
            <Link href="/learn">Learn</Link>
          </div>
          <div>
            <span>UniMem</span>
            <Link href="/about">About</Link>
            <Link href="/vision">Vision</Link>
            <Link href="/investors">Investors</Link>
            <Link href="/contact">Run a pilot</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} UniMem</span>
        <span className="footer-note">
          <i className="status-dot" /> Built for the long run.
        </span>
        <span>Local first. Evidence led.</span>
      </div>
    </footer>
  );
}
