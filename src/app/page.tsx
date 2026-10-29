import Link from "next/link";
import { Arrow } from "@/components/icons";
import { MemoryDemo } from "@/components/memory-demo";
import { CodeExample } from "@/components/code-example";
import { metadata as meta, REPO, SITE } from "@/lib/site";
export const metadata = meta(
  "The memory system for intelligent machines",
  "UniMem is the complete memory system for AI agents and robots: lessons, time-aware facts, knowledge graphs and conversations, with randomized evidence of which memories improve outcomes. Open source, local first.",
  "/",
);
const memoryKinds = [
  [
    "Lessons",
    "Reusable guidance distilled from agent traces, admitted through review receipts bound to exact content.",
  ],
  [
    "Time-aware facts",
    "Propositions with valid time and record time. Ask what was true then, and what the store believed then.",
  ],
  [
    "Knowledge graph",
    "Typed entities and relations with validity windows, entity resolution, communities and multi-hop walks.",
  ],
  [
    "Conversations",
    "Per-space conversation memory with summaries, profiles and time-aware recall across long histories.",
  ],
  [
    "Memory blocks",
    "Character-limited core memory with revisions and an audit log, always in the agent’s context.",
  ],
  [
    "Procedures",
    "Recorded workflows an agent can replay, plus curated knowledge pages and incident narratives.",
  ],
];
const demoOutput = `$ unimem demo

1/3 REMEMBER  facts that know when they were true
    Q: How are refunds issued?
    today            → v2 payments API
    as of 2026-01-02 → v1 refunds endpoint

2/3 MEASURE   1,000 tickets; each memory withheld on half
    integrity audit: SOUND
    memory               planted  measured  verdict
    verify-owner            +20%      +20%  HELPS
    retry-429                +0%       +1%  NO EFFECT
    legacy-refund-api       -20%      -23%  HURTS

3/3 GOVERN    the evidence changes what the agent sees
    withdrawn   legacy-refund-api
    graduated   verify-owner
    under test  retry-429`;
const horizon = [
  [
    "Coding agents",
    "Project decisions and conventions carried across sessions, with stale guidance caught before it repeats.",
    "/use-cases/coding-agents",
  ],
  [
    "Enterprise agents",
    "Support, operations and workflow agents with scoped memory, review and an audit trail.",
    "/use-cases/enterprise-agents",
  ],
  [
    "Multi-agent teams",
    "Shared memory with isolation, stale-read detection and measured writer contributions.",
    "/use-cases/multi-agent-systems",
  ],
  [
    "Robots and fleets",
    "Planner context, in-loop working memory, site memory and a shield on memory-derived actions.",
    "/physical-ai",
  ],
];
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
                  "The memory system for AI agents and robots, with randomized evidence of which memories help.",
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
                  "Complete, local-first memory for AI agents and robots with randomized outcome measurement and governed change.",
              },
            ],
          }),
        }}
      />
      <section className="hero container">
        <div className="hero-topline">
          <span className="eyebrow">
            <i className="status-dot" /> MEMORY FOR AGENTS AND ROBOTS
          </span>
          <span className="hero-index">01 / REMEMBER WITH REASON</span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1>
              <span className="hero-line">Memory your</span>{" "}
              <span className="hero-line">machines can</span>{" "}
              <span className="hero-line">
                <span className="accent-word">trust.</span>
              </span>
            </h1>
            <p>
              A complete memory system for AI agents and robots that measures
              which memories improve outcomes, withdraws the ones that hurt, and
              keeps every change reviewable.
            </p>
            <div className="hero-actions">
              <Link href="/developers#demo" className="button">
                Run the 30-second demo <Arrow />
              </Link>
              <Link href="/platform" className="text-link">
                Explore the platform <Arrow />
              </Link>
            </div>
            <div className="hero-footnote">
              <span>Local-first</span>
              <i />
              <span>Open source</span>
              <i />
              <span>MCP · HTTP · Python · ROS 2</span>
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
          <span>FOR MACHINES THAT LEARN FROM WHAT THEY DO.</span>
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
      <section className="proof-band" aria-label="Measured results">
        <div className="container proof-inner">
          <div className="proof-intro">
            <span className="eyebrow">MEASURED, NOT CLAIMED</span>
            <p>
              Benchmarked end to end on LoCoMo, LongMemEval and BEAM. Baselines,
              sample sizes and caveats published.
            </p>
            <Link href="/benchmarks" className="text-link">
              See the methodology <Arrow />
            </Link>
          </div>
          <dl className="proof-stats">
            <div>
              <dt>Gold evidence delivered, LoCoMo</dt>
              <dd>
                0.82 <span aria-hidden="true">→</span> 0.95
                <small>all 1,540 questions</small>
              </dd>
            </div>
            <div>
              <dt>Answer accuracy, LoCoMo sample</dt>
              <dd>
                68% <span aria-hidden="true">→</span> 87%
                <small>n=100, paired 95% CI +11 to +27 pts</small>
              </dd>
            </div>
            <div>
              <dt>Served recall latency</dt>
              <dd>
                152 ms<small>p50 over HTTP, CPU only</small>
              </dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="container section platform-section" id="platform">
        <div className="section-rail">
          <span className="eyebrow">01 / A COMPLETE MEMORY SYSTEM</span>
          <span className="rail-line" />
        </div>
        <div className="section-heading">
          <h2>
            One memory system.
            <br />
            Every kind of experience.
          </h2>
          <p>
            Not a vector index with a name.
            <br />
            The full memory an agent needs, in one store.
          </p>
        </div>
        <div className="memory-grid">
          {memoryKinds.map(([title, text], i) => (
            <article key={title}>
              <span className="eyebrow">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="retrieval-strip">
          <span className="eyebrow">ONE RECALL, ONE TOKEN BUDGET</span>
          <p>
            Hybrid lexical and dense retrieval, ten named retrievers including
            multi-hop graph walks and question decomposition, local or hosted
            rerankers, and the same scope, time and authority checks on every
            path.
          </p>
          <Link href="/platform" className="text-link">
            Inside the platform <Arrow />
          </Link>
        </div>
      </section>
      <section className="container problem-section section" id="why-memory">
        <div className="section-rail">
          <span className="eyebrow">02 / THE MEMORY PROBLEM</span>
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
            <span className="eyebrow">03 / HOW IT WORKS</span>
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
      <section className="container section demo-section" id="demo">
        <div className="demo-copy">
          <span className="eyebrow">04 / SEE IT IN 30 SECONDS</span>
          <h2>
            Remember.
            <br />
            Measure.
            <br />
            <span className="muted">Govern.</span>
          </h2>
          <p className="section-intro">
            One command runs the whole loop on your machine, offline, with no
            LLM and no API key. A simulated agent has planted effects, so you
            can check what UniMem measures against the ground truth.
          </p>
          <Link href="/developers#demo" className="text-link">
            Run it yourself <Arrow />
          </Link>
        </div>
        <figure className="terminal">
          <div className="code-bar">
            <span>TERMINAL · REAL OUTPUT, ABRIDGED</span>
            <span>unimem demo</span>
          </div>
          <pre tabIndex={0} aria-label="Output of the unimem demo command">
            <code>{demoOutput}</code>
          </pre>
          <figcaption>
            Simulated agent and outcomes. Real store, randomization, integrity
            audit, analysis and withdrawal.
          </figcaption>
        </figure>
      </section>
      <section className="container section developer-section">
        <div className="developer-copy">
          <span className="eyebrow">05 / MADE TO BE USED</span>
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
          <span className="eyebrow">06 / FROM AGENTS TO ROBOTS</span>
          <span className="rail-line" />
        </div>
        <div className="section-heading">
          <h2>
            Every machine that acts
            <br />
            will need a memory.
          </h2>
          <p>
            One memory model and one evidence engine,
            <br />
            from a coding agent to a robot fleet.
          </p>
        </div>
        <div className="usecase-list">
          {horizon.map(([title, text, href], i) => (
            <Link href={href} key={title} className="usecase-row">
              <span className="usecase-symbol" aria-hidden="true">
                {["{ }", "⊞", "↗↙", "◎"][i]}
              </span>
              <span className="eyebrow">0{i + 1}</span>
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
              <span className="eyebrow">07 / CONTROL IS PART OF MEMORY</span>
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
            Become a design partner <Arrow />
          </Link>
          <span>
            Pre-launch. Start with a local store, or{" "}
            <Link href="/investors">read the investor overview</Link>.
          </span>
        </div>
      </section>
    </>
  );
}
