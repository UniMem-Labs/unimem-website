# Product review and website decisions

Reviewed product: [varma61923/unimem](https://github.com/varma61923/unimem), revision `4b6463ef337e1dabbdd9c095e054a1c494d96533`. The checkout contains 1,547 tracked files and 442 files under the Python package. This is a product analysis for website accuracy, not an exhaustive repository security audit.

The connected GitHub account was renamed from `pavan-unimem` to `UniMem-Labs`; its numeric account identity and existing website repository are unchanged. The product repository remains under `varma61923`. A planned `UniMem-Labs/unimem` URL returned 404 during this review. Install examples now target the real product repository; evidence links pin the reviewed revision.

## What the product is

UniMem is a local-first memory system with a causal feedback loop. The memory model matters as much as the feedback loop: lessons, bitemporal facts, typed graphs, conversations, core blocks, and procedures serve different kinds of continuity. Recall combines relevant experience under a caller budget. Randomized delivery and withholding, canonical outcomes, and integrity checks provide evidence about a memory’s effect. Review, configured withdrawal, graduation, and policy promotion/rollback govern changes.

The website gives visitors three concrete ways to understand that system: explore memory records, inspect the cost and scope of published results, and run the local product. The interactive records are illustrations, not a browser-hosted Python runtime. The memory-loop illustration now follows the actual default CLI demo’s memory names and lifecycle results.

## Evidence map

| Website claim                                     | Inspected source                                                   | Boundary                                                                                                    |
| ------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Python 3.10+, local base core with PyYAML         | `pyproject.toml`, `scripts/first_recall_smoke.py`                  | Optional semantic retrieval, MCP, Hub, and provider integrations add dependencies.                          |
| Time-aware facts and historical recall            | `unimem/hierarchical.py`, `unimem/pack_demos.py`, fact command     | Valid time and record time are different. Illustrative UI dates are labeled as an example store.            |
| Graph relations and multi-hop traversal           | `unimem/graph.py`, README memory model                             | Scope comes from authenticated application context; this is not an LLM sandbox.                             |
| Persistent conversations, core blocks, procedures | README memory model, conversation/block command surfaces           | They are different memory forms, not an unconditional guarantee that an agent follows them.                 |
| Stable-ID recall wrapper and outcomes             | `unimem/measure.py`                                                | The application must honor returned assignments and report complete, meaningful outcomes.                   |
| HELPS, HURTS, NO_MEASURABLE_EFFECT, UNDERPOWERED  | experiment analysis and CLI demo                                   | Small estimates and non-significance are not proof of equivalence or safety.                                |
| Harm withdrawal and helpful-memory graduation     | `HarmWatch`, `CausalMemory`, default demo                          | Configuration and evidence thresholds determine behavior.                                                   |
| Preregistration, promotion and rollback           | `unimem/promotion.py`, `docs/promotion.md`                         | Certificates cover a specified policy comparison under declared assumptions.                                |
| Client configurations                             | `unimem/commands/install_cmd.py`                                   | Installer output must be reviewed; a config target is not a vendor partnership or live vendor verification. |
| Retrieval benchmark results                       | `docs/memory-benchmarks.md`, benchmark harness and judge contracts | Published results, not independently rerun for this website. Retrieval is not answer accuracy.              |
| Physical AI                                       | `docs/physical-ai.md`, `docs/guarantees.md`                        | Hardware, ROS execution, actuation, and fleet safety were not exercised here.                               |

All 47 product file citations in the page content were checked against the checkout and exist. Their web links are pinned by `SOURCE_COMMIT` in `src/lib/site.ts`.

## Reproduced locally

- Installed the exact source in its own Python virtual environment with the base dependencies.
- Ran `unimem demo --json` offline: 1,000 simulated occasions, integrity `SOUND`, `verify-owner` helpful and graduated, `legacy-refund-api` harmful and withdrawn, `retry-429` still under test. The raw result is [offline-demo.json](evidence/offline-demo.json). Outcomes are simulated; the storage, assignment, analysis, and lifecycle operations are real.
- Ran `scripts/first_recall_smoke.py`: returned the exact seeded launch-checklist fact offline.
- Ran the five installer targets shown by the quickstart (`codex`, `claude-code`, `cursor`, `windsurf`, `generic-mcp`) against separate temporary project directories. All completed and generated configuration files. The onboarding also explains merging the generated MCP fragments and making the virtual environment’s executable available to the client.
- Did not run hardware interfaces, cloud providers, external agent clients, PostgreSQL Hub, or the complete upstream CI suite. Windows activation syntax is documented, not executed on this Linux worker.

## Benchmark presentation

The interactive chart uses the published retrieval table: LoCoMo 82.3% → 95.0%, LongMemEval-S 82.0% → 94.9%, and BEAM 100K 72.4% → 85.9%. It carries category breakdowns, sample sizes, baseline settings, and the larger adaptive context costs beside the scores. The separate LoCoMo answer-quality comparison uses 100 questions, the same reader/judge model, and a paired bootstrap interval. It is not a competitor ranking, field performance guarantee, or causal estimate of a single retrieval change. The served-gateway 95.8% result is a separate run from the in-process 95.0% result.

## Design decisions

- Preserve UniMem's forest-green identity and editorial hierarchy. The skill-driven refinement uses a light paper field, sea-glass active states, self-hosted IBM Plex Sans, and SVG icons; see [the design plan](anthropic-skills.md).
- Put a useful product interaction in place of a static six-card catalog. Keep the two temporal clocks visible.
- Prefer developer and evidence routes in primary navigation. Vision and investor material remain available in the footer and dedicated pages.
- Make OS activation and client targets explicit. Copy the complete commands without line-number or display artifacts.
- Use a native modal for search, preserve the opener’s focus and scroll position, and support keyboard navigation and a useful empty state.
- Make the primary closing action a working local first run. Do not introduce market-size, valuation, customer, funding, or compliance claims.

## Contact and data

Vercel had no project environment variables or integrations configured when inspected. The contact page therefore prepares a draft locally and opens the visitor’s own mail client only after explicit review. It never labels a draft as a sent inquiry and does not send the form fields to the server in that mode. The existing rate-limited server delivery endpoint remains for configured deployments; enabling it requires the documented credentials and a rebuild. Analytics stay opt-in and disabled. The website notices describe the deployed website behavior; they do not claim regulatory certification or cover a separate commercial agreement.
