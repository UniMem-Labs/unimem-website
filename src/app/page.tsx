import Link from "next/link";
import { Arrow } from "@/components/icons";
import { MemoryDemo } from "@/components/memory-demo";
import { CodeExample } from "@/components/code-example";
import { metadata as meta, REPO, SITE } from "@/lib/site";
export const metadata = meta(
  "Evidence-based memory for AI agents",
  "Give agents persistent memory. Measure which memories improve future work, withdraw harmful guidance, and govern changes with UniMem.",
  "/",
);
const loop = [
  [
    "Recall what matters.",
    "Retrieve lessons, facts, and prior experience within the caller’s scope. Connect your existing retriever or start with the local store.",
  ],
  [
    "Measure what helps.",
    "Withhold eligible memories across a controlled share of tasks. Report outcomes so usefulness can be tested, rather than inferred from retrieval counts.",
  ],
  [
    "Make change reviewable.",
    "Check the evidence before acting. Withdraw harmful guidance under a configured policy; review, promote, or roll back changes through explicit controls.",
  ],
];
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${SITE}/#organization`,
                name: "UniMem",
                url: SITE,
                description:
                  "Evidence-based memory infrastructure for AI agents.",
              },
              {
                "@type": "WebSite",
                name: "UniMem",
                url: SITE,
                publisher: { "@id": `${SITE}/#organization` },
              },
              {
                "@type": "SoftwareApplication",
                name: "UniMem",
                applicationCategory: "DeveloperApplication",
                operatingSystem: "Python 3.10+",
                url: `${SITE}/product`,
                description:
                  "Local-first agent memory with randomized outcome measurement and governed change.",
              },
            ],
          }),
        }}
      />
      <section className="hero container">
        <div className="hero-topline">
          <span className="eyebrow">
            <i className="status-dot" /> EVIDENCE-BASED AGENT MEMORY
          </span>
          <span className="hero-index">01 / REMEMBER WITH REASON</span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1>
              <span className="hero-line">Memory should</span>{" "}
              <span className="hero-line">earn your</span>{" "}
              <span className="hero-line">
                agent’s <span className="accent-word">trust.</span>
              </span>
            </h1>
            <p>
              Give agents persistent memory. Measure what helps, and govern what
              stays in use.
            </p>
            <div className="hero-actions">
              <Link href="/developers" className="button">
                Try UniMem <Arrow />
              </Link>
              <Link href="/product" className="text-link">
                Explore the product <Arrow />
              </Link>
            </div>
            <div className="hero-footnote">
              <span>Local-first</span>
              <i />
              <span>Open source</span>
              <i />
              <span>MCP · HTTP · Python</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-label">
              <span>EXPERIENCE → EVIDENCE</span>
              <span>[ INTERACTIVE ]</span>
            </div>
            <MemoryDemo />
          </div>
        </div>
        <div className="hero-bottom">
          <span>FOR AGENTS THAT DO MORE THAN ONE TASK.</span>
          <a href="#why-memory" className="scroll-link">
            A better memory loop <span>↓</span>
          </a>
        </div>
      </section>
      <section className="integration-band">
        <div className="container">
          <span className="eyebrow">
            MEET YOUR AGENT
            <br />
            WHERE IT WORKS
          </span>
          <div className="integration-names">
            <span>Claude Code</span>
            <span>Cursor</span>
            <span>Codex</span>
            <span>Windsurf</span>
            <span>
              Any MCP client <span aria-hidden="true">↗</span>
            </span>
          </div>
        </div>
      </section>
      <section className="container problem-section section" id="why-memory">
        <div className="section-rail">
          <span className="eyebrow">01 / THE MEMORY PROBLEM</span>
          <span className="rail-line" />
        </div>
        <div className="problem-grid">
          <h2>
            Remembering more
            <br />
            is only the beginning.
          </h2>
          <div className="problem-copy">
            <p>
              An agent forgets a decision, so it makes it again. You add memory.
              Now it remembers an outdated decision—and keeps using it.
            </p>
            <p>
              Persistence solves forgetting. It also gives mistakes a longer
              life.
            </p>
            <p className="statement">
              The next question is whether a memory deserves to influence the
              next task.
            </p>
            <Link href="/learn/the-agent-memory-problem" className="text-link">
              The agent memory problem <Arrow />
            </Link>
          </div>
        </div>
        <div className="comparison">
          <div>
            <span className="eyebrow">RETRIEVAL ASKS</span>
            <p>“Is this relevant?”</p>
          </div>
          <div className="comparison-arrow">→</div>
          <div>
            <span className="eyebrow">UNIMEM ADDS</span>
            <p>“Did this help?”</p>
          </div>
          <span className="comparison-note">
            A better question.
            <br />A measurable answer.
          </span>
        </div>
      </section>
      <section className="how-section">
        <div className="container section">
          <div className="section-rail">
            <span className="eyebrow">02 / HOW IT WORKS</span>
            <span className="eyebrow">EXPERIENCE, WITH A FEEDBACK LOOP.</span>
          </div>
          <div className="how-grid">
            <div>
              <h2>
                Experience.
                <br />
                Evidence.
                <br />
                <span className="muted">Better decisions.</span>
              </h2>
              <p className="section-intro">
                UniMem connects persistent memory to what happens next. Your
                workflow defines success. The evidence informs what stays in
                use.
              </p>
              <Link href="/product" className="text-link">
                Inside the memory loop <Arrow />
              </Link>
              <div className="loop-stamp" aria-hidden="true">
                <svg viewBox="0 0 160 140">
                  <path d="M35 40a50 50 0 1 1-5 58M35 40v30H5" />
                  <circle cx="80" cy="70" r="8" />
                </svg>
                <span>
                  RECALL
                  <br />
                  OBSERVE
                  <br />
                  REFINE
                </span>
              </div>
            </div>
            <div className="loop-steps">
              {loop.map(([title, text], i) => (
                <article key={title}>
                  <span className="step-number">0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                  <span className="step-symbol" aria-hidden="true">
                    {["↗", "±", "↺"][i]}
                  </span>
                </article>
              ))}
              <p className="small-note">
                Controlled trials require reliable outcomes and valid
                experimental assumptions. Insufficient evidence stays
                insufficient.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="container section developer-section">
        <div className="developer-copy">
          <span className="eyebrow">03 / MADE TO BE USED</span>
          <h2>
            Your agent.
            <br />
            Your stack.
            <br />
            Your memory.
          </h2>
          <p className="section-intro">
            Start with one local store. Add a fact and recall it. Then connect
            your agent through a real interface.
          </p>
          <Link href="/developers" className="text-link">
            Build your first memory loop <Arrow />
          </Link>
          <a href={REPO} className="subtle-link">
            View the product source <Arrow diagonal />
          </a>
        </div>
        <CodeExample />
      </section>
      <section className="container section usecases-section">
        <div className="section-rail">
          <span className="eyebrow">04 / LONGER-LIVED AGENTS</span>
          <span className="rail-line" />
        </div>
        <div className="section-heading">
          <h2>
            Context for today.
            <br />
            Experience for what’s next.
          </h2>
          <p>
            For teams whose agents return to the work,
            <br />
            and need more than a fresh start.
          </p>
        </div>
        <div className="usecase-list">
          {[
            [
              "01",
              "Coding agents",
              "Carry project decisions across sessions. Review lessons before they become recurring guidance.",
              "/use-cases/coding-agents",
              "{ }",
            ],
            [
              "02",
              "Multi-agent systems",
              "Share scoped context. Detect stale point reads before they turn into another agent’s write.",
              "/use-cases/multi-agent-systems",
              "↗↙",
            ],
            [
              "03",
              "Enterprise workflows",
              "Keep deployment, access, review, and memory change under your team’s control.",
              "/use-cases/enterprise-agents",
              "⊞",
            ],
          ].map(([n, title, text, href, symbol]) => (
            <Link href={href} key={title} className="usecase-row">
              <span className="usecase-symbol" aria-hidden="true">
                {symbol}
              </span>
              <span className="eyebrow">{n}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <Arrow diagonal />
            </Link>
          ))}
        </div>
      </section>
      <section className="trust-section">
        <div className="container section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">05 / CONTROL IS PART OF MEMORY</span>
              <h2>
                A memory layer.
                <br />
                On your terms.
              </h2>
            </div>
            <Link href="/enterprise" className="text-link">
              Explore deployment & governance <Arrow />
            </Link>
          </div>
          <div className="trust-grid">
            <article>
              <span className="trust-icon" aria-hidden="true">
                ⌘
              </span>
              <h3>Start local. Stay in control.</h3>
              <p>
                The core runs offline without an LLM. Local JSONL, Markdown, and
                SQLite keep the first memory loop close to your workflow.
              </p>
            </article>
            <article>
              <span className="trust-icon" aria-hidden="true">
                ⌑
              </span>
              <h3>Give memory boundaries.</h3>
              <p>
                Scope retrieval and writes. Configure review policy and
                screening. Deploy the Hub when you need organization-level
                identity and access.
              </p>
            </article>
            <article>
              <span className="trust-icon" aria-hidden="true">
                ↶
              </span>
              <h3>Make change reviewable.</h3>
              <p>
                Content-bound review receipts, recorded evidence, and explicit
                rollback make memory changes something your team can inspect.
              </p>
            </article>
          </div>
          <p className="trust-caveat">
            Controls depend on deployment and configuration. No certification or
            compliance claim is implied.
          </p>
        </div>
      </section>
      <section className="container final-cta section">
        <div>
          <span className="eyebrow">THE NEXT TASK IS AN OPPORTUNITY.</span>
          <h2>
            Give your agent
            <br />
            something to build on.
          </h2>
          <p>Start small. Remember deliberately. Measure what changes.</p>
        </div>
        <div className="cta-stack">
          <Link className="button" href="/developers">
            Start building <Arrow />
          </Link>
          <Link className="button button-outline" href="/contact?intent=pilot">
            Test one workflow with us <Arrow />
          </Link>
          <span>Start with a local store. Add your workflow when ready.</span>
        </div>
      </section>
    </>
  );
}
