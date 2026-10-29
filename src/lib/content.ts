export type Section = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  code?: string;
  codeLabel?: string;
  note?: string;
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
        id: "quickstart",
        title: "01 / Install from the product source.",
        paragraphs: [
          "Use Python 3.10 or later in a virtual environment. Install from the inspected source repository rather than relying on an unverified package-registry release. The base core needs PyYAML and does not require an LLM.",
          "Run these commands from your terminal. The final command asks the local store for the fact you just added. This proves the persistence and recall path; it does not yet establish that memory improves a task.",
        ],
        code: 'git clone https://github.com/varma61923/commontrace-v2.git\ncd commontrace-v2\npython -m venv .venv\nsource .venv/bin/activate\npython -m pip install -e .\n\nunimem init --dest ./mem\nunimem fact add "The launch checklist is stored in the blue folder." --dest ./mem\nunimem recall "Where is the launch checklist stored?" --dest ./mem',
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
    path: "/about",
    eyebrow: "ABOUT / UNIFIED MEMORY",
    title: "Experience should have a future.",
    description:
      "UniMem’s mission: give long-lived AI agents persistent, reviewable memory connected to evidence from future work.",
    lead: "We are building memory infrastructure for agents that return to the work—and need a way to learn what deserves to carry forward.",
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
