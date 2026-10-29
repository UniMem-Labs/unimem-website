# Search intent, information architecture, and editorial roadmap

Research date: 2026-10-26. This is qualitative search-intent research; no paid keyword dataset, search-volume estimate, or ranking guarantee was used.

## Research and positioning context

Searches covered agent memory, persistent memory, outcome evaluation, governance, Mem0, Letta, and LangGraph. Primary references:

- [Mem0 open-source overview](https://docs.mem0.ai/open-source/overview): a memory engine and self-hosting options.
- [Letta stateful agents](https://docs.letta.com/v1-sdk/concepts/stateful-agents): persisted state and memory organization.
- [LangChain memory concepts](https://docs.langchain.com/oss/python/concepts/memory): thread-scoped state versus memory across threads.
- [UniMem source snapshot](https://github.com/varma61923/commontrace-v2/tree/c9541a187b48093aa75d6cbb006eea007014efc5): the basis for every UniMem feature claim.

The category has converging persistence, retrieval, state, and governance concepts. UniMem should communicate its specific measured-outcome and change-control entry point rather than claim exclusive ownership of governance. No competitor-bashing or keyword comparison pages are shipped. Search results were treated as research leads; product copy relies on inspected UniMem source and the primary documentation above. No broad landscape-completeness claim is made.

## Keyword-to-page map and route purpose

| Route                             | Primary intent / target                                | Distinct job                                                    |
| --------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------- |
| `/`                               | evidence-based agent memory; AI memory infrastructure  | Understand the company and memory loop quickly.                 |
| `/product`                        | governed agent memory; memory lifecycle                | Explain persistence, measurement, controls, and limits.         |
| `/developers`                     | UniMem quickstart; MCP memory; memory API              | Execute a first recall and connect the feedback path.           |
| `/enterprise`                     | enterprise agent memory governance; self-hosted memory | Evaluate deployment and a bounded pilot.                        |
| `/use-cases/coding-agents`        | persistent memory for coding agents                    | Connect project continuity to reviewed guidance.                |
| `/use-cases/multi-agent-systems`  | shared multi-agent memory                              | Explain scopes, conflicts, and local isolation limits.          |
| `/use-cases/enterprise-agents`    | operational agent memory                               | Make the pilot scenario and success definition concrete.        |
| `/docs`                           | UniMem documentation                                   | Curate exact source contracts without copying the whole manual. |
| `/learn`                          | agent memory education                                 | Discover three substantive cornerstone pieces.                  |
| `/learn/the-agent-memory-problem` | what is agent memory; long-term agent memory           | Define the category and persistence problem.                    |
| `/learn/memory-vs-context`        | memory vs context; agent context management            | Explain architecture and the delivery boundary.                 |
| `/learn/evaluating-agent-memory`  | agent memory evaluation; memory outcomes               | Explain design, missingness, uncertainty, and decisions.        |
| `/about`                          | UniMem company and mission                             | Explain the conviction without invented founder history.        |
| `/contact`                        | UniMem pilot; integrations; partners                   | Capture one useful workflow inquiry.                            |
| `/privacy`                        | website data handling                                  | Explicit draft notice; requires review.                         |
| `/terms`                          | website terms                                          | Explicit starter terms; requires review.                        |

Educational pages own broad definitional intent. Product pages own evaluation and implementation intent. Use cases own workflow-specific problems. This separation prevents every page from repeating “long-term memory for AI agents” in its H1.

All 16 content routes are statically rendered. Metadata has unique titles and descriptions, canonicals at `https://unimem.org`, Open Graph and social-card fields with no invented account handles. A generated 1200 × 630 PNG share image, SVG favicon, Apple PNG, manifest, sitemap, and robots are included. JSON-LD covers Organization, WebSite, SoftwareApplication without ratings/pricing, breadcrumbs, and educational Articles without invented publication dates.

Links connect home → product/use cases/articles, use cases → product/developers/enterprise, articles → related foundations and integration paths, and all routes → footer navigation. Legal pages remain visibly marked as drafts. No page claims a review or legal status it does not have.

## Next 20 pieces, in priority order

Publish only after there is enough source evidence, a runnable example, or a genuine methodological contribution. Each piece should answer one distinct question.

1. Instrument a memory experiment end to end — runnable example with assignments and complete outcomes.
2. Why missing outcomes bias memory evaluations — small reproducible dataset.
3. What an underpowered memory result means — uncertainty without statistical overclaims.
4. Keep coding-agent lessons current after a tool migration — versioned example.
5. Deploy a local UniMem pilot safely — operator checklist and test fixture.
6. Admission, retrieval, and delivery are different events — traced contract.
7. Design a success signal for support-agent memory — independent label boundaries.
8. Scope shared memory across agent handoffs — permitted and refused examples.
9. When a memory trial needs a cluster design — interference and washout.
10. Review a lesson before it becomes recurring guidance — configured policy walkthrough.
11. Promote and roll back a memory policy — exact canonical source workflow.
12. Valid time versus record time in agent facts — bitemporal worked example.
13. MCP memory transport trust boundaries — stdio, gateway, and Hub.
14. Wrap an existing retriever without replacing the store — CausalMemory integration.
15. Secret screening and redaction: what each does — safe artificial fixtures.
16. Detect stale generation in shared local memory — point-read race example.
17. Choosing a memory representation — lessons, facts, blocks, and conversations.
18. Memory benchmark methodology before scorecards — licensed dataset and reproducibility boundaries.
19. Plan a self-hosted Hub rollout — actual deployment, backups, and authorization checks.
20. A field report from an agreed pilot — publish only with permission and verified results.

Do not create thin pages per coding client or industry. Native-client claims require environment verification; live vendor compatibility, certification, and customer success require new evidence.
