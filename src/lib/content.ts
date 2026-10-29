export type Section = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  code?: string;
  codeLabel?: string;
  note?: string;
  table?: { caption: string; head: string[]; rows: string[][] };
  source?: [string, string];
};
export type ContentPage = {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  lead: string;
  sections: Section[];
  related: string[];
  article?: boolean;
  legal?: boolean;
  cta?: string;
};
export const pages: ContentPage[] = [
  {
    path: "/product",
    eyebrow: "THE PRODUCT / MEMORY WITH A FEEDBACK LOOP",
    title: "Remember. Measure. Reconsider.",
    description:
      "How UniMem connects persistent agent memory to randomized outcome measurement, review, withdrawal, promotion, and rollback.",
    lead: "A persistent memory layer that asks what happened after a memory was used—and gives your team controls for what happens next.",
    sections: [
      {
        id: "memory",
        title: "A place for experience to persist.",
        paragraphs: [
          "UniMem is evidence-based memory infrastructure for AI agents. It stores reusable lessons, time-aware facts, and other forms of context, and connects memory use to task outcomes.",
          "Lessons capture reusable guidance. Atomic facts carry both valid time and record time, so a workflow can distinguish what was true from what the store believed at a particular point. Conversations, memory blocks, and knowledge graphs serve different kinds of continuity.",
          "The local core uses JSONL, Markdown, and SQLite. Start without an embedding service or an LLM; optional providers add semantic retrieval and reranking. A vector index helps find information, while admission and lifecycle controls determine whether it may be used.",
        ],
        source: ["Memory model and storage", "README.md#whats-inside"],
      },
      {
        id: "measurement",
        title: "Usefulness is a testable question.",
        paragraphs: [
          "A memory appearing in successful tasks is not enough to show it helped. It may simply appear in easy tasks—or be retrieved most often when the task is unusually difficult.",
          "In a configured experiment, UniMem assigns eligible memories to shown or withheld arms for each task. A stable occasion ID links assignment to the success or failure reported by your workflow. Repeated retrieval on the same occasion does not become a new independent task.",
          "The report compares outcomes and checks experiment integrity. Results distinguish evidence of help, evidence of harm, no measurable effect, and an underpowered experiment. The last of these means the experiment cannot answer yet.",
        ],
        bullets: [
          "Define the task outcome before interpreting the trial.",
          "Honor withheld memories and report outcomes for every assigned occasion.",
          "Keep memory revisions, experimental design, and outcome scoring consistent.",
          "Reserve protected safety guidance from ordinary memory experiments.",
        ],
        source: ["Measurement interface", "unimem/measure.py"],
      },
      {
        id: "governance",
        title: "Evidence can inform an explicit change.",
        paragraphs: [
          "With a configured harm policy, UniMem can stop delivering memories with measured evidence of harm. That is different from assuming every unhelpful-looking memory should be deleted.",
          "A separate change-control workflow preregisters candidate and incumbent policies, support requirements, and an acceptance margin before observing outcomes. Certification requires canonical trial records and a passing integrity audit. Rollback records revoke the certificate.",
          "Lesson admission also has a review path. Content-bound receipts connect approval to the reviewed revision. Two-person and human-required review are deployment choices your operator must configure.",
        ],
        source: ["Promotion and rollback workflow", "docs/promotion.md"],
        note: "A certificate covers a measured policy under stated assumptions. It is not a guarantee of truth, safety, or performance on an unseen workflow.",
      },
      {
        id: "integrate",
        title: "Fit the loop around your workflow.",
        paragraphs: [
          "Use the CLI for a first local store, MCP for an attached agent, the HTTP gateway for a language-independent interface, or Python to wrap a retrieval callable. The measurement wrapper can work around an existing store when returned memories have stable identities.",
          "A useful first integration has three responsibilities: retrieve admitted candidates, give the agent only the delivered set, and record the final outcome. UniMem cannot manufacture a trustworthy success signal for your business process.",
          "The contextual causal gate is newer functionality. The source documents that the Hub does not yet retain all per-assignment rates and contexts required for the local gate. Evaluate this boundary before choosing a deployment.",
        ],
        source: ["Status and limitations", "README.md#project-status"],
      },
    ],
    related: ["/developers", "/enterprise", "/learn/evaluating-agent-memory"],
  },
  {
    path: "/developers",
    eyebrow: "DEVELOPERS / FIRST RECALL TO FIRST EXPERIMENT",
    title: "Start with one memory.",
    description:
      "Run the UniMem local quickstart, connect through MCP or HTTP, and instrument a first memory experiment with Python.",
    lead: "One local store. A real recall. Then a measured loop around the agent you already run.",
    sections: [
      {
        id: "demo",
        title: "00 / See the whole loop in 30 seconds.",
        paragraphs: [
          "Before wiring anything, run the built-in demo. It creates a temporary store, writes facts with validity windows and recalls them at two points in time, runs 1,000 simulated support tickets through a randomized holdout, audits the experiment, and lets the evidence withdraw a harmful memory and graduate a helpful one.",
          "The agent and its outcomes are simulated with planted effects, so the measured effects can be checked against ground truth. The store, randomization, integrity audit, analysis and withdrawal are the real product. It needs no LLM, no API key and no network.",
        ],
        code: "git clone https://github.com/varma61923/unimem.git\ncd unimem\npython -m venv .venv && source .venv/bin/activate\npython -m pip install -e .\n\nunimem demo                 # add --keep ./demo-store to inspect it afterwards",
        codeLabel: "Terminal · macOS / Linux",
        source: ["Demo command", "README.md#see-the-whole-loop-in-30-seconds"],
      },
      {
        id: "quickstart",
        title: "01 / Install from the product source.",
        paragraphs: [
          "Use Python 3.10 or later in a virtual environment. Install from the inspected source repository rather than relying on an unverified package-registry release. The base core needs PyYAML and does not require an LLM.",
          "Run these commands from your terminal. The final command asks the local store for the fact you just added. This proves the persistence and recall path; it does not yet establish that memory improves a task.",
        ],
        code: 'git clone https://github.com/varma61923/unimem.git\ncd unimem\npython -m venv .venv\nsource .venv/bin/activate\npython -m pip install -e .\n\nunimem init --dest ./mem\nunimem fact add "The launch checklist is stored in the blue folder." --dest ./mem\nunimem recall "Where is the launch checklist stored?" --dest ./mem',
        codeLabel: "Terminal · macOS / Linux",
        note: "Windows: activate with .venv\\Scripts\\Activate.ps1 in PowerShell. Source access follows the repository’s GitHub permissions.",
        source: [
          "Executable first-recall smoke check",
          "scripts/first_recall_smoke.py",
        ],
      },
      {
        id: "experiment",
        title: "02 / Give the memory loop an outcome.",
        paragraphs: [
          "Configure a trial before running the Python example. Here, a small retrieval function stands in for your own retriever. Each returned memory has a stable ID and text. The task-1042 occasion ID must identify one actual task.",
          "Only pass the returned shown list into your agent. Report the final result using a real success criterion, including failures and escalations. One task will not produce a meaningful effect estimate.",
        ],
        code: "unimem experiment --configure --rate 0.5 --dest ./mem",
        codeLabel: "Terminal · configure eligible-memory holdouts",
        source: ["Python measurement wrapper", "unimem/measure.py"],
      },
      {
        id: "python",
        title: "03 / Wrap a retrieval callable.",
        paragraphs: [
          "Save this as example.py in the product checkout. The printed result may be empty because the one memory can be withheld. Replace the illustrative outcome with the result of your workflow before using this for a real experiment.",
        ],
        code: 'from unimem.measure import CausalMemory\n\ndef retrieve(task):\n    return [{"id": "retry-429",\n             "text": "On HTTP 429, back off and retry."}]\n\nmemory = CausalMemory(retrieve, root="./mem")\nshown = memory.recall("Handle a rate limit",\n                      occasion_id="task-1042")\nprint(shown)\n# Run the actual agent here with only shown memories.\n# Illustrative label: replace with the actual final outcome.\nmemory.record_outcome("task-1042", succeeded=True)',
        codeLabel: "Python · illustrative task",
        note: "After collecting real outcomes, run unimem experiment --dest ./mem. Configure withdrawal separately with unimem retrieval --on-harm withdraw --dest ./mem. Start on a low-risk workflow.",
      },
      {
        id: "mcp",
        title: "04 / Connect a coding agent or MCP client.",
        paragraphs: [
          "Install the optional serve dependency for MCP. A stdio client launches the process locally; it operates with that process’s OS permissions. Network transports and the multi-tenant Hub have different authentication boundaries.",
          "The installer contains targets for Claude Code, Cursor, Windsurf, Codex, Copilot, Gemini, Devin, OpenCode, and generic MCP configuration. The installer writes configuration; provider behavior still needs validation in your environment.",
        ],
        code: "python -m pip install -e '.[serve]'\nunimem serve --transport stdio --dest ./mem\n\n# Or generate a supported coding-agent configuration:\nunimem install --target codex",
        codeLabel: "Terminal · MCP",
        source: [
          "Supported installer targets",
          "unimem/commands/install_cmd.py",
        ],
      },
      {
        id: "http",
        title: "05 / Use HTTP from your own runtime.",
        paragraphs: [
          "Run unimem up --dest ./mem and use the private gateway bearer token provided at startup. The local gateway defaults to port 8787. Keep the token on the server or in your local environment.",
          "The recall endpoint accepts candidate items and an occasion ID. Deliver only the returned memory set, then send the final outcome to /v1/outcome. Consult the OpenAPI contract for response fields, protected items, limits, and policy errors.",
        ],
        code: 'curl http://localhost:8787/v1/outcome \\\n  -H "Authorization: Bearer $UNIMEM_TOKEN" \\\n  -H \'Content-Type: application/json\' \\\n  -d \'{"occasion_id":"task-1042","succeeded":true}\'',
        codeLabel: "Terminal · report an actual completed task",
        source: ["Gateway OpenAPI contract", "openapi/gateway.json"],
      },
    ],
    related: ["/docs", "/product", "/learn/evaluating-agent-memory"],
    cta: "Have one workflow in mind?",
  },
  {
    path: "/enterprise",
    eyebrow: "ENTERPRISE / MEMORY UNDER YOUR CONTROL",
    title: "Give persistent agents a reviewable memory layer.",
    description:
      "Explore UniMem local and self-hosted deployment, scoped memory, configurable review, and a focused enterprise pilot.",
    lead: "Decide where memory lives, who can use it, and what evidence is required before it changes.",
    sections: [
      {
        id: "deployment",
        title: "Start at the deployment boundary.",
        paragraphs: [
          "The local core runs offline without an LLM. Your first evaluation can use local files and SQLite in a controlled environment. Optional model providers, storage adapters, and network services change the data boundary and should be reviewed separately.",
          "For shared organization workflows, the repository includes a PostgreSQL-backed Hub and Docker Compose, Kubernetes, Helm, and cloud deployment assets. These are self-hosting starting points, not a managed-service availability promise.",
          "Choose an initial deployment around the information your agent is permitted to retain. Confirm backups, deletion, secret management, and operator ownership before admitting real sensitive data.",
        ],
        source: [
          "Hub and deployment overview",
          "README.md#the-hub-multi-tenant-server",
        ],
      },
      {
        id: "access",
        title: "Connect access to memory use.",
        paragraphs: [
          "Local memory records carry scope and visibility information. The Hub adds organization identity, OIDC SSO, SCIM provisioning, roles, audit export, retention controls, and configuration for customer-held key services.",
          "A local MCP stdio process inherits the caller’s OS access. A network gateway token and the Hub’s tenant model are different boundaries. Choose the model that matches your trust requirements instead of treating all interfaces as interchangeable.",
          "Scope labels are not a substitute for a sound identity deployment. Validate the exact credentials, role mappings, default policies, and backend behavior used in your pilot.",
        ],
        source: ["Hub access controls", "hub/auth.py"],
      },
      {
        id: "review",
        title: "Make recurring guidance a reviewed change.",
        paragraphs: [
          "Lesson activation uses content-bound review receipts. The operator can configure two-person review and human-required approval. Those settings matter: independent review is not an unconditional default in every local store.",
          "Screening detects known patterns for secrets, personal information, and prompt injection. Detection and optional redaction reduce particular risks; they do not establish that arbitrary memory is safe or free of sensitive data.",
          "Policy promotion and rollback retain an explicit evidence path. Use these controls alongside your existing incident handling and human escalation procedures.",
        ],
        source: ["Review policy implementation", "unimem/approval.py"],
        note: "UniMem does not claim SOC 2, ISO 27001, HIPAA certification, or regulatory compliance. Assess suitability and configure controls for your own obligations.",
      },
      {
        id: "pilot",
        title: "Test one agent workflow.",
        paragraphs: [
          "A useful pilot begins with one repeatable workflow and one outcome your team can verify. Coding-task completion, reviewed support resolution, or another bounded business result can be a starting point; the right choice depends on your traffic and risk.",
          "Agree which memories are eligible for withholding and which instructions must remain protected. Record every assignment and outcome. Check integrity before interpreting any change in results.",
          "The deliverable is a decision: continue collecting evidence, revise the memory, withdraw it, or investigate the workflow. Timing and sample requirements depend on traffic and effect size; there is no guaranteed one-week answer.",
        ],
        bullets: [
          "One named workflow and a responsible operator.",
          "A data boundary and explicit access policy.",
          "A stable, independently checkable success definition.",
          "A plan for missing outcomes, harmful results, and rollback.",
        ],
        source: [
          "Experimental assumptions and guarantees",
          "docs/guarantees.md",
        ],
      },
    ],
    related: [
      "/use-cases/enterprise-agents",
      "/learn/evaluating-agent-memory",
      "/contact",
    ],
    cta: "Put one workflow under the microscope.",
  },
  {
    path: "/use-cases/coding-agents",
    eyebrow: "USE CASE / CODING AGENTS",
    title: "The next session should inherit the lesson.",
    description:
      "Use UniMem for persistent coding-agent context, reviewed project lessons, and outcome measurement across repeated engineering tasks.",
    lead: "Keep project decisions and reusable guidance available across sessions. Measure whether that guidance earns its place.",
    sections: [
      {
        id: "workflow",
        title: "From repeated rediscovery to reusable experience.",
        paragraphs: [
          "A coding agent discovers a repository convention, a test command, or the reason behind an architectural choice. A later session starts without that context and spends another turn finding it—or chooses a path the team already rejected.",
          "UniMem can retain atomic facts and reviewed lessons outside the current context window. A fact records a proposition. A lesson expresses reusable guidance with an applicability condition. Neither should become permanent instruction merely because an agent once wrote it.",
          "Start with a narrowly scoped project store. Keep instructions tied to the repository and task family they concern, and review changes before allowing them to become recurring guidance. This scenario illustrates an integration pattern, not measured customer results.",
        ],
      },
      {
        id: "integration",
        title: "Attach to the tools you use.",
        paragraphs: [
          "The repository includes configuration targets for Claude Code, Cursor, Windsurf, Codex, Copilot, Gemini, Devin, OpenCode, and generic MCP clients. The local MCP server exposes memory operations without requiring the agent to run a shell command for every interaction.",
          "Install into a disposable project first and inspect the generated configuration. Client-specific permissions, hooks, and invocation behavior still belong to the client’s environment. A supported installer target does not imply a commercial partnership.",
          "Use an existing project fact as your first recall check, then make the agent’s use of the delivered context observable before introducing a memory experiment.",
        ],
        code: "unimem init --dest ./mem\nunimem install --target cursor\n# Other supported target: codex, claude-code, windsurf",
        codeLabel: "Terminal · inspect generated client configuration",
        source: ["Coding-agent installation", "unimem/commands/install_cmd.py"],
      },
      {
        id: "evaluate",
        title: "A convention can help—and later become stale.",
        paragraphs: [
          "Suppose a lesson tells the agent how to run a test suite. After a tool migration, that once-useful instruction may cause repeat failures. Persistent storage alone will not identify the change.",
          "On eligible, low-risk tasks, a controlled memory trial can compare results with and without the lesson. Report an independently verified result, such as the agreed test-and-review outcome. A single successful run does not establish an effect.",
          "Use evidence to inform withdrawal or a reviewed update. Keep critical security rules outside ordinary withholding. The newer causal gate can use context labels, but deployment support and the experimental assumptions need review before relying on it.",
        ],
        source: ["Memory measurement", "unimem/measure.py"],
      },
    ],
    related: ["/developers", "/product", "/learn/memory-vs-context"],
  },
  {
    path: "/use-cases/multi-agent-systems",
    eyebrow: "USE CASE / MULTI-AGENT SYSTEMS",
    title: "Shared memory needs shared boundaries.",
    description:
      "Scope shared agent memory, review conflicting changes, and use opt-in stale-generation checks in UniMem multi-agent workflows.",
    lead: "Give agents a common place for experience without making every memory visible—or every write unconditional.",
    sections: [
      {
        id: "scope",
        title: "Share what belongs together.",
        paragraphs: [
          "In a multi-agent workflow, one agent’s result may become another agent’s input. A shared store can preserve decisions between handoffs, but it also introduces questions about ownership, visibility, and conflicting updates.",
          "UniMem records scopes and applies admission controls to reads and writes. Shared memory still requires your team to define which principal may act for which workflow. An unrestricted local process should not be mistaken for an organization-isolated deployment.",
          "Use separate project or tenant boundaries where information must remain separate. Test both permitted retrieval and refusals with the credentials that will actually run the agents.",
        ],
        source: ["Memory scope implementation", "unimem/memory_control.py"],
      },
      {
        id: "conflicts",
        title: "Detect when an agent’s premise has changed.",
        paragraphs: [
          "An agent can read a fact, generate an update, and discover that another agent changed the fact before the write. UniMem’s opt-in team isolation supports declared point-read versions and commit-time stale-generation checks.",
          "Snapshot, serializable, and sequenced modes have different contracts. Sequenced work also uses an exclusive work-item lease and fencing token. A stale write can return STALE_GENERATION rather than commit its generated fact.",
          "A proposed semantic merge creates a review item while preserving source facts. It does not silently resolve a semantic conflict with last-write-wins.",
        ],
        note: "These guarantees require a complete declared point-read set and one shared local lock domain. They do not provide predicate locking or multi-host consensus.",
        source: ["Team isolation guarantees", "docs/team-isolation.md"],
      },
      {
        id: "effects",
        title: "Measure the team, not just the retrieval count.",
        paragraphs: [
          "A memory that helps one task family may distract another. Context labels make that distinction available to the local measurement workflow and the newer contextual allocation gate.",
          "Shared environments also create interference: one agent’s actions can change another agent’s outcome. Independent-task assumptions may then fail. Decide whether tasks, teams, or other clusters form the appropriate unit of evaluation before making a causal claim.",
          "Start with a bounded handoff, observable inputs, and a final result you can attribute to the workflow. Expand only after your team understands missing outcomes, cross-agent effects, and the limits of the chosen design.",
        ],
        source: [
          "Interference and experimental design",
          "docs/interference.md",
        ],
      },
    ],
    related: ["/enterprise", "/developers", "/learn/evaluating-agent-memory"],
  },
  {
    path: "/use-cases/enterprise-agents",
    eyebrow: "USE CASE / ENTERPRISE AGENTS",
    title: "Persistent context. Accountable change.",
    description:
      "Plan a bounded UniMem pilot for enterprise agents with local deployment, reviewed memory, access boundaries, and verified outcomes.",
    lead: "For recurring operational workflows where an outdated instruction can matter as much as a forgotten one.",
    sections: [
      {
        id: "scenario",
        title: "Give a recurring workflow continuity.",
        paragraphs: [
          "Consider a support workflow that repeatedly encounters a known failure mode. A reviewed lesson can preserve the resolution path. A time-aware fact can record when the underlying policy changed.",
          "The useful question is whether this context improves the actual workflow result. More retrievals and longer prompts do not answer it. UniMem links eligible memory delivery to the final outcome your process reports.",
          "This is an illustrative workflow, not a customer deployment or a promised improvement. Your team defines the success criterion and the authority of the source material.",
        ],
      },
      {
        id: "controls",
        title: "Keep the data and review boundaries explicit.",
        paragraphs: [
          "Begin locally when a single controlled store fits the evaluation. Consider the self-hosted Hub when organization identity, role-based access, retention, and audit export are needed.",
          "Configure lesson review to match the risk of the recurring instruction. Two-person and human-required policies are available, but must be enabled where required. Verify screening and redaction behavior with representative non-sensitive fixtures before ingesting real records.",
          "A memory’s existence is not permission to act. Your agent still needs application authorization, business policy checks, and a human escalation route for consequential decisions.",
        ],
        source: [
          "Enterprise deployment architecture",
          "README.md#the-hub-multi-tenant-server",
        ],
      },
      {
        id: "pilot-design",
        title: "Agree on what a useful pilot would prove.",
        paragraphs: [
          "Choose one repeatable workflow with enough traffic to evaluate and a result that can be checked independently. Separate experimental guidance from mandatory instructions. Decide how abandoned tasks and delayed outcomes will be recorded.",
          "Review integrity first, effects second. An underpowered result is a valid reason to keep measuring. Evidence of harm is a reason to investigate and, under the configured policy, withdraw the memory.",
          "Document where optional providers send data, who owns the store, and how a memory can be reviewed, revised, or removed. A pilot should leave your team with an operational decision and a clear account of the remaining uncertainty.",
        ],
        bullets: [
          "Define the data that may be remembered.",
          "Set the review and access policy.",
          "Choose eligible memories and final outcome signals.",
          "Plan withdrawal, rollback, and operator escalation.",
        ],
        source: ["Promotion and rollback", "docs/promotion.md"],
      },
    ],
    related: ["/enterprise", "/contact", "/learn/evaluating-agent-memory"],
  },
  {
    path: "/docs",
    eyebrow: "DOCUMENTATION / A PATH THROUGH THE SOURCE",
    title: "Build a memory loop you can inspect.",
    description:
      "A curated UniMem documentation index for local setup, measurement, promotion, team isolation, safety, and deployment guarantees.",
    lead: "Start with the quickstart. Follow the source documentation when you need the exact contract.",
    sections: [
      {
        id: "start",
        title: "Start with a local recall.",
        paragraphs: [
          "The developer quickstart walks through installation, a local fact, and retrieval without an LLM. It then adds a configured experiment and a Python wrapper around a retrieval callable.",
          "The repository README describes the wider memory model and deployment options. Use a virtual environment, inspect optional dependencies, and validate the interface you intend to deploy.",
        ],
        source: ["Product README", "README.md"],
      },
      {
        id: "measurement",
        title: "Understand what the evidence means.",
        paragraphs: [
          "Read the measurement wrapper for the callable contract: stable memory IDs, optional content revisions, a stable occasion ID, and outcome recording. Inspect the experiment and integrity modules when validating the design.",
          "Keep a record of the assumptions behind any conclusion: task independence, outcome completeness, scoring consistency, randomized eligibility, and the chosen estimation mode.",
        ],
        source: ["Measurement wrapper", "unimem/measure.py"],
      },
      {
        id: "change",
        title: "Review promotion and rollback.",
        paragraphs: [
          "Change-control documentation describes immutable preregistration, canonical logged trial rows, support requirements, certification, and revocation. It also explains what an offline signature can and cannot establish.",
          "Use these contracts to plan a change review. Do not substitute a favorable average, a simulated result, or a new policy configuration for the trial that the certificate actually covers.",
        ],
        source: ["Change-control documentation", "docs/promotion.md"],
      },
      {
        id: "teams",
        title: "Read the isolation boundary.",
        paragraphs: [
          "Team isolation documentation explains point-read snapshots, stale-generation checks, work leases, reviewable merges, and exact limits. It is particularly useful before allowing multiple writers to share a store.",
          "The local guarantees assume a common lock domain and declared dependencies. Distributed deployments need a coordination design appropriate to their own topology.",
        ],
        source: ["Team isolation documentation", "docs/team-isolation.md"],
      },
      {
        id: "guarantees",
        title: "Use the assumptions as part of the API.",
        paragraphs: [
          "The guarantees document separates implemented behavior, reference adapters, deployment assumptions, and experimental claims. Treat this as required reading before a serious evaluation.",
          "The website summarizes selected capabilities from a pinned source snapshot. The source repository remains the reference for precise configuration and evolving implementation details.",
        ],
        source: ["Guarantees and deployment assumptions", "docs/guarantees.md"],
      },
      {
        id: "contracts",
        title: "Integrate against an explicit contract.",
        paragraphs: [
          "The gateway OpenAPI document describes local HTTP requests, responses, limits, authentication, and errors. The Hub has a separate OpenAPI contract and generated client libraries.",
          "Use the contract belonging to the server you actually deploy. A local gateway example does not imply that the Hub supports every newer local allocation feature.",
        ],
        source: ["Gateway OpenAPI", "openapi/gateway.json"],
      },
    ],
    related: ["/developers", "/product", "/learn/evaluating-agent-memory"],
  },
  {
    path: "/learn/the-agent-memory-problem",
    article: true,
    eyebrow: "FIELD NOTES / FOUNDATIONS",
    title: "The agent memory problem.",
    description:
      "Why persistence and retrieval are only part of agent memory, and why long-lived agents need a feedback loop for remembered experience.",
    lead: "An agent can forget something useful. It can also remember something wrong for a very long time. Both belong in the design of memory.",
    sections: [
      {
        id: "definition",
        title: "What is agent memory?",
        paragraphs: [
          "Agent memory is information retained beyond the immediate task and made available to influence later agent behavior. It can include facts, decisions, instructions, interaction history, or reusable lessons.",
          "That definition contains two distinct decisions: what to retain, and what to let influence the next task. A system can be good at the first and still make poor choices about the second.",
          "A context window carries information into a model invocation. A memory system preserves and selects information across invocations. Increasing the window does not by itself settle provenance, currentness, access, or usefulness.",
        ],
      },
      {
        id: "persistence",
        title: "Persistence preserves mistakes, too.",
        paragraphs: [
          "An instruction may have been correct for a previous API, customer policy, or project structure. Persistence lets the agent reuse it after the circumstances change. Retrieval can make the problem worse by ranking the familiar instruction highly.",
          "The issue is not that persistent storage is undesirable. It is that storage does not supply a lifecycle. A memory needs a way to be reviewed, revised, scoped, expired, or withdrawn.",
          "A practical design asks who authored a memory, what source supports it, when it applied, which principal may see it, and whether its guidance should still be active. These questions belong alongside recall quality.",
        ],
      },
      {
        id: "relevance",
        title: "Relevance and usefulness are different measurements.",
        paragraphs: [
          "Retrieval asks which stored information matches the current query or task. A highly relevant memory can still be stale, misleading, or counterproductive. A retrieval score does not establish what would have happened without it.",
          "Similarly, observing that a memory appeared in successful tasks can be confounded by task selection. The memory may be used only on easy work. Or it may look bad because it is retrieved for the hardest tasks.",
          "A controlled comparison can address a more specific question: for the eligible task population and experimental design, how did outcomes differ when this memory was delivered or withheld? The answer remains conditional on reliable assignment and outcome collection.",
        ],
      },
      {
        id: "loop",
        title: "Close the loop around future work.",
        paragraphs: [
          "UniMem connects persistent memory to randomized eligible-memory holdouts and recorded task outcomes. It checks trial integrity before interpreting effects and distinguishes evidence from insufficient data.",
          "The integration must deliver only the admitted, non-withheld memories and record every assigned task’s final result. If failed tasks disappear from the dataset, an apparently favorable effect can be misleading.",
          "Governance completes the loop: configured harm withdrawal, content-bound lesson review, and separate promotion and rollback workflows provide ways to act on evidence. None of these turns arbitrary remembered text into verified truth.",
        ],
        source: ["UniMem measurement implementation", "unimem/measure.py"],
      },
      {
        id: "starting",
        title: "Start with a smaller, better question.",
        paragraphs: [
          "Instead of asking whether an agent “has memory,” choose one recurring workflow and one type of remembered guidance. Decide what success means, what may be withheld, and which rules must stay protected.",
          "First verify persistence and recall. Then verify the feedback path. Only then ask whether the guidance improves outcomes. An honest answer may be that more observations are needed.",
          "The objective is deliberate continuity: preserve experience, inspect its influence, and retain the ability to reconsider it.",
        ],
      },
    ],
    related: [
      "/learn/memory-vs-context",
      "/learn/evaluating-agent-memory",
      "/product",
    ],
  },
  {
    path: "/learn/memory-vs-context",
    article: true,
    eyebrow: "FIELD NOTES / ARCHITECTURE",
    title: "Memory and context do different jobs.",
    description:
      "Understand context windows, persistent agent memory, retrieval, and the lifecycle controls needed between storage and agent behavior.",
    lead: "Context is what the model receives for a task. Memory is what a system carries forward—and must choose whether to put back into context.",
    sections: [
      {
        id: "context",
        title: "Context is a working input.",
        paragraphs: [
          "A model invocation receives instructions, messages, tool results, and other selected material within its context. That input is the model’s immediate working material.",
          "An agent framework may persist conversation state or checkpoints and restore them later. This makes a session resumable, but does not automatically give every retained statement the authority of a reviewed instruction.",
          "Longer context can reduce the need to discard working material. It still requires decisions about what is current, permitted, and worth including. Token availability is only one constraint.",
        ],
      },
      {
        id: "memory",
        title: "Memory is continuity across work.",
        paragraphs: [
          "Persistent memory retains information across tasks or sessions. A project decision, a time-bounded fact, a user preference, and a reusable procedure all have different lifecycles even when each can be represented as text.",
          "A single vector representation does not erase those differences. A preference may require consent and revision. A historical fact may need both valid and recorded time. A lesson may require independent review before activation.",
          "Choose a representation and policy around the kind of continuity required. In UniMem, lessons, atomic facts, conversations, and core-memory blocks are distinct product concepts rather than one undifferentiated list of embeddings.",
        ],
        source: ["UniMem memory model", "README.md#memory-model"],
      },
      {
        id: "retrieval",
        title: "Retrieval is a bridge, not the entire lifecycle.",
        paragraphs: [
          "Retrieval selects candidate material for the present task. Lexical, semantic, graph, and reranking techniques can improve that selection. Admission checks must then enforce scope, time, and authority.",
          "After delivery, a different question becomes possible: did the selected memory help? Retrieval quality and downstream task success can be measured separately, because an agent can find the right passage and still use it incorrectly.",
          "Keep this separation visible in instrumentation. Record candidate selection, delivered memory identities, and outcomes without assuming one is a substitute for the others.",
        ],
      },
      {
        id: "architecture",
        title: "Design the boundary deliberately.",
        paragraphs: [
          "A useful architecture can preserve canonical records, maintain rebuildable indexes, admit only visible and current information, deliver a bounded context, and connect that delivery to later outcomes.",
          "UniMem can start as a local store or wrap an existing retrieval callable through its Python measurement interface. This offers a way to evaluate guidance without requiring an immediate replacement of every storage component.",
          "The first practical question is what crosses the boundary into the agent’s working context. The second is how you will learn whether that inclusion was useful. Both deserve an explicit contract.",
        ],
        source: ["CausalMemory interface", "unimem/measure.py"],
      },
    ],
    related: ["/learn/the-agent-memory-problem", "/developers", "/product"],
  },
  {
    path: "/learn/evaluating-agent-memory",
    article: true,
    eyebrow: "FIELD NOTES / EVALUATION",
    title: "Evaluate what memory changes.",
    description:
      "A practical guide to evaluating agent memory with stable task IDs, eligible-memory holdouts, complete outcomes, and integrity checks.",
    lead: "A retrieved memory is an input. A successful task is an outcome. A useful evaluation connects them without confusing correlation for evidence.",
    sections: [
      {
        id: "question",
        title: "Specify the decision before the experiment.",
        paragraphs: [
          "Choose what you intend to learn: whether one lesson improves a task family, whether an update should replace existing guidance, or whether a policy change clears an agreed margin.",
          "Define eligible traffic, stable task identities, the final outcome, and the treatment. Decide which guidance can be withheld and which mandatory instructions or protected safety memories must remain available.",
          "Do not alter success criteria after seeing a favorable result. A change-control trial has a stronger contract when its acceptance criteria and rollback plan were fixed in advance.",
        ],
        source: ["UniMem promotion workflow", "docs/promotion.md"],
      },
      {
        id: "assignments",
        title: "Make assignment and delivery agree.",
        paragraphs: [
          "A memory-level holdout assigns an eligible memory to shown or withheld for an occasion. The agent must actually receive the shown set and must not recover the withheld instruction through a second path.",
          "Use an occasion ID for a real task, not every retriever call. Retries of the same task should not be presented as independent experiments. Stable memory identities and revision tracking prevent unrelated content from being pooled under one label.",
          "When multiple agents share state, outcomes may interfere. Task-level randomization may no longer match the causal question. Investigate clustered or other appropriate designs instead of assuming independence.",
        ],
      },
      {
        id: "outcomes",
        title: "Missing outcomes are part of the experiment.",
        paragraphs: [
          "Record the result of every assigned task, including failures, timeouts, escalations, and abandoned work according to the agreed definition. If the harder arm loses more outcomes, the comparison can be biased.",
          "A model-generated judgment is not automatically a reliable final label. Calibrate it against independent evidence, separate surrogate signals from final outcomes, and keep simulated observations separate from real ones.",
          "The instrumented path should make it possible to reconcile assignments with outcomes. In UniMem, integrity checks examine issues such as attrition, imbalance, changed randomization, scorer drift, and edited memory revisions.",
        ],
      },
      {
        id: "interpret",
        title: "Read uncertainty as part of the result.",
        paragraphs: [
          "An effect estimate without uncertainty can look more decisive than the data supports. The interpretation also depends on the estimation mode and the assumptions behind it.",
          "UniMem reports distinct verdicts for help, harm, no measurable effect, and underpowered evidence. Underpowered is not proof of no effect. Repeated inspection and adaptive allocation need methods appropriate to those choices; the source documents mode-specific qualifications.",
          "Avoid turning an internal trial into a universal benchmark claim. The result concerns the measured population, memory revision, assignment process, and outcome definition. A new workflow or deployment can require a new evaluation.",
        ],
        source: ["Estimator modes and qualifications", "unimem/experiment.py"],
      },
      {
        id: "act",
        title: "Use the result to make a reviewable decision.",
        paragraphs: [
          "A useful evaluation ends with an operational choice. Continue collecting evidence when it is insufficient. Investigate and withdraw harmful guidance under the configured policy. Review a replacement rather than silently editing the treatment mid-trial.",
          "For policy promotion, preregister the candidate and incumbent, drain outstanding outcomes, and evaluate the exact canonical trial. Keep the rollback route available after release.",
          "Memory evaluation is ongoing engineering work. It should make the next decision better informed and easier to inspect, while leaving uncertainty visible.",
        ],
      },
    ],
    related: ["/product", "/enterprise", "/developers"],
  },
  {
    path: "/platform",
    eyebrow: "PLATFORM / ONE MEMORY SYSTEM, END TO END",
    title: "Everything an agent remembers, in one governed system.",
    description:
      "The UniMem platform: lessons, bitemporal facts, knowledge graph, conversations, memory blocks and procedures; hybrid multi-hop retrieval; randomized evidence; governance; MCP, HTTP, Python and ROS 2 interfaces.",
    lead: "UniMem is not a vector index with a name. It is the complete memory an agent or robot needs: what to remember, how to recall it, whether it helps, and who may change it.",
    sections: [
      {
        id: "memory",
        title: "A memory model for every kind of experience.",
        paragraphs: [
          "Different experience needs different structure. UniMem keeps each kind in a form suited to it, in one store, under one set of scope, time and authority rules.",
        ],
        bullets: [
          "Lessons: reusable guidance distilled from traces, activated only through review receipts bound to their exact content, and durably revocable.",
          "Atomic facts: propositions with valid time and record time, so you can ask what was true then and what the store believed then. Contradictions are detected at write time and near-duplicates consolidated.",
          "Knowledge graph: typed nodes and edges with validity windows, entity resolution, communities, and a code-structure graph for Python and TypeScript.",
          "Conversations: per-space memory with summaries, profiles and time-aware recall.",
          "Memory blocks: character-limited core memory with revisions and an audit log.",
          "Procedural memory, knowledge pages and sagas: replayable workflows, curated versioned pages, and ordered narratives of incidents and migrations.",
          "Forgetting: TTLs, evidence decay, invalidation, and erasure of a subject’s local history.",
        ],
        source: ["Memory model", "README.md#whats-inside"],
      },
      {
        id: "retrieval",
        title: "Recall that reaches the right evidence.",
        paragraphs: [
          "Recall fuses lessons, facts, graph relations and conversations under one token budget. Hybrid lexical retrieval (BM25, Unicode and CJK aware) and dense retrieval run with local or hosted embedders; local cross-encoders, hosted rerankers or an LLM listwise reranker can refine the ranking, and a failed reranker keeps the original order.",
          "Ten named retrievers cover different questions: hybrid, decomposition, graph completion, natural-language query, planned, multi-round, multi-hop, personalized PageRank, expanded and HyDE. Multi-hop reasoning walks the fact and entity graph with explicit evidence paths.",
          "Every retriever applies the same checks. A fact the caller cannot see is never used, not even as an intermediate hop.",
        ],
        note: "On LoCoMo, the served gateway delivers the gold evidence for 95.8 percent of 1,540 questions at 152 ms p50 on CPU. See the benchmarks page for baselines and caveats.",
        source: ["Retrieval", "README.md#retrieval"],
      },
      {
        id: "evidence",
        title: "An evidence engine built into memory.",
        paragraphs: [
          "Each eligible memory is shown or withheld on each task by a deterministic hash, so the split is random, reproducible and stable under retries. Outcomes in the two arms give a causal estimate per memory, with confidence sequences that remain valid however often you look.",
          "An integrity audit runs before any effect is shown: differential attrition, sample-ratio mismatch, reshuffled randomization, scorer drift, mid-run edits and censoring. A compromised run is reported as compromised.",
          "The evidence acts. Harmful memories can be withdrawn, proven ones graduated, and a contextual causal gate learns where each memory helps, publishing its allocation as hash-chained schedules.",
        ],
        source: [
          "Measurement and the causal gate",
          "README.md#prove-that-memory-helps",
        ],
      },
      {
        id: "governance",
        title: "Governance and security at the record level.",
        paragraphs: [
          "Tenant scopes, write-time origin binding and visibility rules apply to every record. Lesson admission uses review receipts and HMAC-authenticated curated records designed against memory-poisoning attacks. Screening covers secrets, PII and prompt injection.",
          "Change control preregisters candidate and incumbent policies before outcomes are observed; certification needs canonical trial records and a passing audit; rollback revokes the certificate. Signed Merkle transparency logs, lineage and subject-key erasure make history inspectable.",
          "The self-hosted Hub adds OIDC single sign-on, SCIM 2.0 provisioning, role-based access, audit export, rate limiting, retention policies and envelope encryption with customer-held keys.",
        ],
        source: ["Guarantees and assumptions", "docs/guarantees.md"],
      },
      {
        id: "interfaces",
        title: "Meet every agent and robot where it runs.",
        bullets: [
          "MCP server with 60+ tools over stdio, SSE or streamable HTTP.",
          "One-command installs for Claude Code, Cursor, Windsurf, Codex, Copilot, Gemini, Devin and OpenCode.",
          "Native middleware for LangGraph, OpenAI Agents SDK, Pydantic AI, Google ADK and Microsoft Agent Framework, plus tool factories for LangChain, CrewAI, LlamaIndex, AutoGen and Strands.",
          "HTTP gateway with a published OpenAPI contract, and TypeScript, Go, Rust and JVM clients.",
          "A ROS 2 bridge and robot SDK for planner context, outcomes and action shields.",
        ],
        paragraphs: [
          "Adapters for existing memory stores mean the evidence engine can measure memories that live elsewhere, as long as they have stable identities.",
        ],
        source: ["Connect your agent", "README.md#connect-your-agent"],
      },
      {
        id: "deploy",
        title: "Local first. Scales to an organization.",
        paragraphs: [
          "The core is pure Python with one runtime dependency, runs offline and needs no LLM. JSONL and Markdown are canonical, with SQLite in WAL mode for facts. PostgreSQL with pgvector, LanceDB, Neo4j and FalkorDB are optional backends; the graph databases mirror an authoritative local graph.",
          "Docker, Helm, Kubernetes and Terraform assets ship with the source. The project is pre-1.0: the local store, retrieval, MCP server, gateway and holdout experiment are marked stable and covered by about 8,000 tests in CI; newer areas are labeled in the status table.",
        ],
        source: ["Project status", "README.md#project-status"],
      },
    ],
    related: ["/benchmarks", "/developers", "/physical-ai"],
    cta: "See the whole loop on your machine.",
  },
  {
    path: "/physical-ai",
    eyebrow: "PHYSICAL AI / MEMORY FOR ROBOTS AND FLEETS",
    title: "Memory a robot can be trusted to act on.",
    description:
      "UniMem for physical AI: planner context and durable outcomes for robots, in-loop working memory, a bounded STL shield on memory-derived actions, collective site memory and living safety cases.",
    lead: "Robots that learn from deployment need what agents need, under harder constraints: fast recall, durable outcomes over bad networks, and a gate between remembered experience and physical action.",
    sections: [
      {
        id: "bridge",
        title: "Planner context in, outcomes out.",
        paragraphs: [
          "A robot bridge labels each episode by embodiment, site and skill, asks the gateway for context, and reports the outcome. If the network drops, a signed durable outcome queue survives restarts and retries with the same occasion, and conflicting final outcomes are refused.",
          "Because outcomes flow back, the same randomized evidence that measures an agent’s memories measures a robot’s: which recovery hints, site notes and skill lessons actually improve success for this embodiment at this site.",
        ],
        code: 'from unimem.robotics.bridge import HTTPGateway, RobotBridge\nfrom unimem.robotics.edge import OutcomeQueue\n\nrobot = RobotBridge(\n    HTTPGateway("http://127.0.0.1:8787", token),\n    embodiment="parallel-jaw", site="depot", skill="grasp", robot="robot7",\n    outcome_queue=OutcomeQueue("/var/lib/unimem-edge"),\n)\ncontext = robot.start("episode-42", "Recover the dropped object")\nrobot.finish("episode-42", succeeded=True)',
        codeLabel: "Python · robot bridge",
        source: ["Physical-AI integration", "docs/physical-ai.md"],
      },
      {
        id: "working-memory",
        title: "Working memory inside the control loop.",
        paragraphs: [
          "In-process working memory holds bounded vectors and keyframe metadata with local cosine ranking and a 5 ms default budget. It returns the best result found so far, marks overruns, and makes no network or persistence calls in the retrieval path.",
          "Safety keyframes stay protected under eviction. At episode end only predictive keyframes are consolidated into long-term memory, with lineage and an append-only audit record.",
        ],
        note: "5 ms is a design target with a separate wall-clock benchmark gate. Integrators must benchmark their own hardware and vector dimensions.",
        source: ["Robot working memory", "docs/robot-working-memory.md"],
      },
      {
        id: "shield",
        title: "A shield between memory and motion.",
        paragraphs: [
          "Every proposed memory-derived action can be checked against a bounded Signal Temporal Logic specification registered to the memory that suggested it. Missing memory, missing or out-of-order telemetry, and negative robustness hold the action. The bridge fails closed when no shield or no recalled memory is present.",
          "The shield never sends motor commands. It complements, and never replaces, the robot’s safety-rated controller, emergency stop and risk assessment.",
        ],
        source: ["Memory-to-action shield", "docs/robot-shield.md"],
      },
      {
        id: "fleet",
        title: "What one robot learns, the site can know.",
        paragraphs: [
          "Collective site memory ingests a VDA 5050 subset and an Open-RMF adapter boundary into vendor-neutral, bitemporal site events. Scene graphs keep sensor source, event time and record time; conflicting observations stay visible instead of being silently merged.",
          "A signed mesh lets robots share memory peer to peer. Conflicting concurrent values become explicit contradictions, safety additions cannot be removed, and forged or revoked peers are rejected. Signed edge updates carry protected hazards and proven facts with Merkle consistency proofs.",
        ],
        source: ["Collective site memory", "docs/site-memory.md"],
      },
      {
        id: "safety-case",
        title: "Living safety cases from real evidence.",
        paragraphs: [
          "A digest-bound claim and evidence graph tracks which safety claims rest on which memories and outcomes, flags evidence that has gone stale, and mines reproducible scenarios, so a safety case can change as the fleet learns rather than drift silently out of date.",
          "These are engineering aids with stated limits. They are not certification, and robot motion and routing stay under the fleet’s certified control stack.",
        ],
        source: ["Living safety cases", "docs/safety-case.md"],
      },
    ],
    related: ["/platform", "/vision", "/contact"],
    cta: "Bring one robot workflow.",
  },
  {
    path: "/vision",
    eyebrow: "VISION / WHY UNIMEM EXISTS",
    title: "Experience is the next dataset.",
    description:
      "Why every agent and robot will need a governed memory, why that memory must prove it helps, and what UniMem is building toward.",
    lead: "Models are trained once. Machines that act in the world learn every day. Whoever governs what they keep from that experience holds the most important record in AI.",
    sections: [
      {
        id: "shift",
        title: "From trained once to learning in deployment.",
        paragraphs: [
          "A model’s weights capture what was known when it was trained. An agent fixing a codebase, answering a customer or picking up a part learns things no training set contained: this repository’s conventions, this customer’s history, this gripper’s quirks at this site.",
          "That experience is valuable precisely because it is specific. It is also dangerous for the same reason. It goes stale, it can be wrong, and it can be planted. A machine that remembers more without knowing what deserves to be remembered just repeats its mistakes for longer.",
        ],
      },
      {
        id: "record",
        title: "Memory becomes the system of record.",
        paragraphs: [
          "Every application that keeps state needs a database. Every machine that learns from what it does will need a memory, and that memory will hold the most consequential data an organization has about its AI: what its agents and robots believe, where it came from, who approved it, and what happened when it was used.",
          "That is why memory cannot be a cache. It needs time, provenance, scope, review, erasure and an audit trail. UniMem was built that way from the first record.",
        ],
      },
      {
        id: "evidence",
        title: "Memory must prove that it helps.",
        paragraphs: [
          "Retrieval answers whether a memory is relevant. It cannot answer whether using it made the outcome better. That is a causal question, and the only honest way to answer it is to compare outcomes with and without the memory on comparable tasks.",
          "UniMem runs that comparison continuously, for every memory, on live work, and refuses to report a result from a broken experiment. Over time, evidence about which kinds of memory help in which contexts becomes the asset: it tells a new deployment what to trust before it has learned anything itself.",
        ],
      },
      {
        id: "horizon",
        title: "One memory for every intelligent machine.",
        paragraphs: [
          "The same memory model and evidence engine already extends beyond memories: to skills, to optimizer edits, to the writers that create memories, and to robot fleets sharing what each robot learns. The aim is a single, governed layer between experience and action for any machine that learns from what it does.",
          "We are early. UniMem has not launched publicly and has no revenue. The product is real, open source and documented with its limits, because the company that asks machines to earn trust has to earn it first.",
        ],
      },
    ],
    related: ["/investors", "/platform", "/physical-ai"],
    cta: "Build the memory layer with us.",
  },
  {
    path: "/benchmarks",
    eyebrow: "BENCHMARKS / MEASURED, WITH THE CAVEATS",
    title: "Show the numbers. Show the limits.",
    description:
      "UniMem conversation memory measured end to end on LoCoMo, LongMemEval and BEAM: retrieval, answer accuracy, serving latency, reproduction commands and honest caveats.",
    lead: "A memory product that asks agents to earn trust should earn yours first. These are the measurements, how to reproduce them, and what they do not show.",
    sections: [
      {
        id: "method",
        title: "Measured end to end, on the official data.",
        paragraphs: [
          "Every conversation is written through the product’s own write path, exactly as an agent would write it. Every question is answered from what recall delivers, by a model, and graded with the benchmark’s own judge protocol. Datasets are pinned to a published revision and verified by SHA-256 before use.",
          "Two kinds of number are reported. Retrieval uses no model and covers every question: the share of gold evidence turns that reach the delivered context, and what that context costs in tokens. Answer accuracy uses a model as reader and judge, on a stratified sample when model quota does not allow every question.",
          "Result files record hashes of the dataset, harness, judges, reader prompt and product source. The harness refuses to drop a question that fails, rather than score only the survivors.",
        ],
        source: ["Methodology and results", "docs/memory-benchmarks.md"],
      },
      {
        id: "retrieval",
        title: "Gold evidence reaches the reader far more often.",
        paragraphs: [
          "The baseline is a fixed 1,500-token recall. The improved arm is an adaptive recall of 6,000 tokens that grows to 16,000 for summaries, orderings, counts and lists. Store, embeddings, judge code and generation settings are identical between the arms.",
          "The gain is not free. Delivered context grows from about 1,450 to between 6,000 and 10,000 tokens on average, which is 6 to 30 percent of each conversation history. Two cheaper levers, a larger embedding model and a graph walk, were measured and rejected because they did not pay for themselves.",
        ],
        table: {
          caption: "Share of gold evidence delivered to the reader",
          head: ["Benchmark", "Questions", "Baseline", "Improved"],
          rows: [
            ["LoCoMo, all categories", "1,540", "0.823", "0.950"],
            ["LongMemEval-S, stratified", "150", "0.820", "0.949"],
            ["BEAM 100K, all categories", "400", "0.724", "0.859"],
          ],
        },
      },
      {
        id: "accuracy",
        title: "Answer accuracy rises with it.",
        paragraphs: [
          "On a 100-question stratified LoCoMo sample, graded with the binary judge used in published Mem0 and EverOS comparisons, overall accuracy rose from 68.0 to 87.0 percent. The paired bootstrap 95 percent interval for the difference is +11.0 to +27.0 points.",
          "Most baseline misses were refusals: the reader said it had no information because the evidence never arrived. That is a retrieval failure, and the improved arm fixes much of it. Remaining misses are mostly loose date arithmetic and commonsense inferences the reader still declines.",
        ],
        table: {
          caption: "LoCoMo answer accuracy, Gemma 4 31B as reader and judge",
          head: ["Category", "Questions", "Baseline %", "Improved %"],
          rows: [
            ["Single-hop", "26", "76.9", "96.2"],
            ["Multi-hop", "26", "76.9", "92.3"],
            ["Temporal", "25", "76.0", "84.0"],
            ["Open-domain", "23", "39.1", "73.9"],
            ["Overall", "100", "68.0", "87.0"],
          ],
        },
      },
      {
        id: "serving",
        title: "The deployed gateway returns the same answers, fast.",
        paragraphs: [
          "A separate gateway process on a fresh store ingested all ten LoCoMo conversations over HTTP and answered all 1,540 questions through the HTTP recall endpoint, four clients at a time, on a shared 16-core CPU host. Every served context was byte-identical to in-process recall.",
        ],
        table: {
          caption: "Gateway serving measurements, CPU only",
          head: ["Measure", "Result"],
          rows: [
            [
              "Served contexts identical to in-process recall",
              "1,540 of 1,540",
            ],
            ["Recall latency, p50 / p95", "152 ms / 283 ms"],
            [
              "Recall throughput, 4 concurrent clients",
              "20.0 queries per second",
            ],
            ["Write latency, p50 / p95", "780 ms / 1,149 ms"],
            ["Gold evidence delivered", "0.958"],
          ],
        },
      },
      {
        id: "limits",
        title: "What these numbers do not show.",
        paragraphs: [
          "The same model is reader and judge in the answer-accuracy runs. Published leaderboards mostly judge with other models, so absolute numbers are only approximately comparable to them. The two arms share the judge, so the difference between them is exact. Answer accuracy uses stratified samples; retrieval uses every question.",
          "Benchmarks test recall of conversation facts. They cannot tell you whether a memory improved your agent’s outcomes on your tasks. That is a different, causal question, and it is why UniMem ships randomized per-memory holdouts. The example verdict tables in the project README come from a synthetic run and are labeled as such.",
          "LoCoMo is licensed CC BY-NC 4.0. None of the datasets is redistributed with the product; a script downloads each from its publisher at the pinned revision.",
        ],
        note: "We publish baselines, sample sizes and judge caveats on purpose. If a number here cannot be reproduced from the commands below, treat that as a bug and tell us.",
      },
      {
        id: "reproduce",
        title: "Reproduce the retrieval result.",
        paragraphs: [
          "The retrieval measurement needs no model and no API key. Download the pinned datasets, install the CPU embedding extra, and run the harness over every LoCoMo question.",
        ],
        code: "python scripts/fetch_memory_benchmarks.py --dest data/benchmarks --merge-beam-10m\npip install -e '.[fastembed]'\n\npython benchmarks/conversation_bench.py --dataset locomo \\\n  --data data/benchmarks/locomo10.json \\\n  --budget 6000 --adaptive-budget --max-budget 16000",
        codeLabel: "Terminal · from the product checkout",
        source: ["Benchmark harness", "benchmarks/conversation_bench.py"],
      },
    ],
    related: ["/product", "/learn/evaluating-agent-memory", "/docs"],
    cta: "Run it on your own memory.",
  },
  {
    path: "/investors",
    eyebrow: "INVESTORS / THESIS, STATUS, AND RISKS",
    title: "The memory system for intelligent machines.",
    description:
      "UniMem’s investor overview: the thesis, why now, what exists today, the business model, honest pre-launch status, risks, and how to start a conversation.",
    lead: "Every agent and robot that learns from its work will need a memory. UniMem is a complete memory system that also proves which memories help. We would rather show you the evidence and the gaps than a deck of adjectives.",
    sections: [
      {
        id: "thesis",
        title: "Memory is becoming infrastructure. Trust decides who owns it.",
        paragraphs: [
          "Agents are moving from single sessions to persistent work, and robots are starting to learn in deployment. Every one of them will need memory, the way every application needs a database. Persistence solves forgetting and gives mistakes a longer life: a stale convention, a bad lesson or a poisoned memory is delivered with confidence to every future task.",
          "UniMem is a complete memory system: lessons, bitemporal facts, a temporal knowledge graph, conversations, core-memory blocks and procedures, with hybrid and multi-hop retrieval that delivers the gold evidence for 95.8 percent of LoCoMo questions at 152 ms. Built into it is what, in our read of the category, memory products do not ship: a randomized evidence engine that measures whether each memory improved outcomes, then withdraws harmful ones and graduates proven ones.",
          "The category is real and funded: several memory-layer companies have raised seed and Series A rounds. We are not asking you to believe machines need memory. Our claim is that memory which cannot prove it helps, and cannot be audited, will not be allowed to touch consequential work, and that the memory which can will become the system of record.",
        ],
      },
      {
        id: "why-now",
        title: "Why now.",
        paragraphs: [
          "Coding and support agents already return to the same work daily, so memory is shipping in products people use. Memory poisoning is a documented attack class in the research literature. Enterprises deploying persistent agents will ask for audit, review and rollback before they ask for more recall.",
          "Evaluation of memory is still mostly retrieval benchmarks and anecdote. A product that produces per-memory causal evidence from live traffic can become the system of record for whether an agent’s experience is helping.",
        ],
      },
      {
        id: "today",
        title: "What exists today.",
        paragraphs: [
          "Per the project README and repository: a local-first Python core with one runtime dependency, a CLI, an MCP server with more than 60 tools, an HTTP gateway, framework middleware and one-command installs for coding agents, and a multi-tenant Hub with SSO, SCIM, role-based access, audit export and envelope encryption. CI runs about 8,000 tests and the Hub is tested against real PostgreSQL.",
          "The measured retrieval and answer-accuracy results are on the benchmarks page, with their caveats. The randomized measurement, integrity audit, change control and evidence-proof machinery are implemented and documented with their assumptions. A physical-AI layer (robot bridge, in-loop working memory, action shield, site memory) extends the same model to robots.",
          "Anyone can verify the core loop in 30 seconds: `unimem demo` runs remember, measure and govern offline, against a simulated agent with planted effects, and shows the measured effects next to the ground truth.",
        ],
        bullets: [
          "Source is public under AGPL-3.0-only; the product is pre-1.0 and says so.",
          "The contextual causal gate runs on the local store and gateway; the Hub does not yet record all per-assignment data it needs.",
          "Several areas, including federation noise and some physical-AI integrations, are labeled experimental in the source.",
        ],
        source: ["Project status table", "README.md#project-status"],
      },
      {
        id: "model",
        title: "How this becomes a business.",
        paragraphs: [
          "The open local core is the adoption surface. The commercial surface is the layer teams need once memory matters: the hosted or self-hosted Hub, organization identity and access, governance, audit and retention, and a commercial license for organizations that cannot use AGPL software.",
          "The Hub already contains plan entitlements (free, team and scale) and billing integration. Because UniMem measures causal effect, it can also support outcome-linked pricing: a share of value only where an effect is established. That component exists in the Hub code. It has not been charged to any customer.",
          "Cross-customer evidence is the long-term moat we are designing for. Pooled, privacy-preserving evidence about which kinds of memory help in which contexts gives every new deployment a better starting prior. This is designed and partly implemented. It is not yet proven at scale.",
        ],
      },
      {
        id: "status",
        title: "Honest status.",
        paragraphs: [
          "UniMem has not launched publicly and has no revenue and no paying customers. We are looking for a small number of design partners: teams running a persistent coding or support agent who want to find out which of its memories help and which hurt, with a result their team can verify.",
          "We will share more than this page can: a technical memo, the architecture, the benchmark artifacts, and a live walkthrough of the product on a seeded workflow.",
        ],
      },
      {
        id: "risks",
        title: "Risks we would raise ourselves.",
        paragraphs: [
          "Breadth: the product surface is wide, from conversation memory to physical-AI governance. The early commercial wedge is narrower, and we are sequencing accordingly. Competition: well-funded teams are building memory layers and can add measurement. Our lead depends on making causal evidence easy enough to adopt.",
          "Dependence on outcome signals: measurement is only as good as the success signal a customer can supply. Licensing: AGPL protects the project and complicates some enterprise adoption, which is the reason for a commercial license. Evidence is conditional: every guarantee in the product states its assumptions, and none is a claim of safety or compliance.",
        ],
      },
      {
        id: "contact",
        title: "Start a conversation.",
        paragraphs: [
          "If you invest in developer infrastructure, AI infrastructure or agent safety, or you run an agent that should be a design partner, write to us. Tell us what you would need to see in the next 90 days.",
        ],
      },
    ],
    related: ["/vision", "/benchmarks", "/platform"],
    cta: "Tell us what you would need to see.",
  },
  {
    path: "/about",
    eyebrow: "ABOUT / UNIFIED MEMORY",
    title: "Experience should have a future.",
    description:
      "UniMem’s mission: give long-lived AI agents persistent, reviewable memory connected to evidence from future work.",
    lead: "We are building the memory system for agents and robots that return to the work—and need a way to learn what deserves to carry forward.",
    sections: [
      {
        id: "conviction",
        title: "Continuity needs judgment.",
        paragraphs: [
          "UniMem means Unified Memory. The product begins with a simple conviction: persistent agents need more than a place to put information. They need boundaries for what enters memory, evidence about what helps, and a way to reconsider what no longer belongs.",
          "A useful memory can save repeated discovery. An outdated memory can preserve a mistake. Both should be visible to the team responsible for the agent.",
          "Our focus is evidence-based agent memory: local-first persistence, outcome measurement, and governed change. The aim is to make remembered experience something builders can inspect and improve.",
        ],
      },
      {
        id: "building",
        title: "A product you can examine.",
        paragraphs: [
          "The source includes a local Python core, CLI, MCP server, HTTP gateway, and a self-hosted multi-tenant Hub. The project is under active development. Individual components differ in maturity and deployment requirements.",
          "We prefer specific capabilities and explicit limits to blanket promises. Benchmarks, simulated examples, experimental adapters, and production guarantees are different kinds of evidence and should be labeled accordingly.",
          "The product source is licensed AGPL-3.0-only. Review the license and optional integration terms when considering your deployment.",
        ],
        source: ["Product source and status", "README.md#project-status"],
      },
      {
        id: "partners",
        title: "Build the next loop with us.",
        paragraphs: [
          "The most useful next conversation starts with a real workflow: an agent that repeats a mistake, rediscovers context, or needs a reviewed way to update recurring guidance.",
          "We welcome pilot inquiries, integration discussions, and conversations with researchers, investors, and strategic partners. Bring the task, the data boundary, and what a useful result would mean for your team.",
        ],
      },
    ],
    related: ["/contact", "/product", "/learn/the-agent-memory-problem"],
    cta: "Bring one real memory problem.",
  },
  {
    path: "/privacy",
    legal: true,
    eyebrow: "PRIVACY / STARTER NOTICE",
    title: "A deliberate approach to your information.",
    description:
      "Draft UniMem website privacy notice covering inquiries, optional analytics, deployment providers, and local product data boundaries.",
    lead: "This starter notice describes the website’s intended data handling. It requires operator and legal review before public launch.",
    sections: [
      {
        id: "scope",
        title: "Website and product have different boundaries.",
        paragraphs: [
          "This notice concerns the UniMem marketing website. A self-hosted or local UniMem product deployment is operated in its own environment and follows that operator’s configuration and policies.",
          "Trying the interactive demonstration does not upload agent memories or run a real memory experiment. The demonstration changes browser state only. The website has no user account or customer-memory upload feature.",
        ],
      },
      {
        id: "inquiries",
        title: "Information you choose to submit.",
        paragraphs: [
          "The inquiry form collects your name, email, company, workflow description, memory problem, and an optional message. It sends this information to the configured UniMem contact recipient through Resend when the server integration is enabled.",
          "Do not include credentials, customer records, or sensitive agent traces. A server-side anti-abuse service stores a keyed hash of the request IP address with a short expiration; the application does not send the raw IP to Redis.",
          "The operator must establish inquiry access and deletion procedures, a retention schedule, and any required regional transfer terms before launch. Contact Pavan.Mudunuri@unimem.org for questions or deletion requests.",
        ],
      },
      {
        id: "analytics",
        title: "Optional analytics and service providers.",
        paragraphs: [
          "Analytics is disabled by default in the repository. An operator can enable Vercel Web Analytics and Speed Insights to measure site use, performance, and events such as GitHub clicks, documentation visits, copied examples, and accepted inquiries.",
          "The website does not send form fields, agent memories, or email addresses in custom analytics events. Hosting and service providers may process technical connection data under their own terms.",
          "Before enabling analytics, the operator must review provider behavior, retention, notice, and consent requirements for the intended visitors. No advertising or cross-site profiling integration is included in this implementation.",
        ],
      },
      {
        id: "review",
        title: "Before this notice is published as policy.",
        paragraphs: [
          "Confirm the legal operator, postal contact, applicable privacy rights, lawful processing basis, exact provider contracts, international transfer mechanism, and retention periods. Add jurisdiction-specific disclosures where required.",
          "This page is an implementation starter and is not legal advice or a claim that privacy compliance has been established.",
        ],
      },
    ],
    related: ["/contact", "/terms", "/enterprise"],
  },
  {
    path: "/terms",
    legal: true,
    eyebrow: "TERMS / STARTER TERMS",
    title: "Clear expectations, from the start.",
    description:
      "Draft UniMem website terms covering informational content, illustrative demonstrations, product licensing, and launch review requirements.",
    lead: "These starter terms require review by the website operator and qualified counsel before they are adopted.",
    sections: [
      {
        id: "website",
        title: "An informational website.",
        paragraphs: [
          "This website describes selected UniMem capabilities and provides developer examples and an inquiry route. It does not itself provide a hosted agent-memory service or establish a commercial service agreement.",
          "Illustrative demonstrations do not report customer performance or benchmark results. Technical examples need adaptation and validation for the environment where you run them. Availability and suitability are not guaranteed by this draft.",
        ],
      },
      {
        id: "license",
        title: "Product source has its own license.",
        paragraphs: [
          "The product repository is licensed AGPL-3.0-only, with notices for relevant third-party components. Review those actual license files for rights and obligations; website wording does not replace them.",
          "Optional integrations and external services may have separate terms. A pilot, commercial support arrangement, or other engagement should use an explicit agreement with the relevant parties.",
        ],
      },
      {
        id: "use",
        title: "Use the website responsibly.",
        paragraphs: [
          "Do not attempt unauthorized access, disrupt the website, submit abusive material, or put secrets and sensitive customer records into the inquiry form. Only share information you are authorized to disclose.",
          "Links to external documentation and source repositories are provided for reference. Their content and availability can change independently of this website.",
        ],
      },
      {
        id: "review",
        title: "Required before adoption.",
        paragraphs: [
          "The operator and counsel must confirm the legal entity, contact information, governing law, dispute procedure, intellectual-property terms, warranties, liability allocation, accessibility obligations, and any jurisdiction-specific provisions.",
          "These draft terms are not legal advice and should not be treated as an executed customer or pilot agreement. Questions can be sent to Pavan.Mudunuri@unimem.org.",
        ],
      },
    ],
    related: ["/privacy", "/contact", "/about"],
  },
];
export function getPage(path: string) {
  return pages.find((p) => p.path === path);
}
