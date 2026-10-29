# UniMem: product understanding and claim map

Source: `https://github.com/varma61923/commontrace-v2`, commit `c9541a187b48093aa75d6cbb006eea007014efc5`.

The original checkout is separate from this website. No product files were changed. `source-inventory.json` inventories all 1,521 tracked files and hashes. This is a claim-focused product assessment, not a completed line-by-line, six-pass security audit of all 1,521 files. Reading selected source, tracing contracts, and running focused tests do not establish that the full product is defect-free.

## Product model

UniMem provides local persistent memory, retrieval, randomized eligible-memory holdouts, task outcomes, evidence interpretation, and governed change. It also includes a self-hosted multi-tenant Hub and a broader collection of governance and robotics interfaces. The website focuses on agent memory because it is the clearest demonstrable entry point.

The strongest distinction from a vector database is the outcome and change-control loop. Vector search selects related information; it does not, by itself, estimate the task effect of delivering a specific memory, review lesson activation, or revoke a policy promotion. This describes responsibilities, not a claim that competing products lack governance.

The distinction from generic long-term agent memory is a defensible question: did using the memory improve future work, and what should change as a result? Do not promise universal causal identification, semantic truth, or autonomous self-improvement.

## Claim-to-implementation map

| Website statement                                                 | Evidence inspected                                                                           | Qualification                                                                                                    |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Local Python core; Python 3.10+; minimal base dependency          | `pyproject.toml`; offline first-recall smoke                                                 | Optional models and providers change dependencies and data boundaries.                                           |
| Stable-ID retrieval wrapper and outcome recording                 | `unimem/measure.py:86–231`                                                                   | Caller must honor delivered items and record real complete outcomes.                                             |
| Deterministic randomized eligible-memory holdout                  | `unimem/experiment.py:33–51`; `measure.py:206–219`                                           | Valid design, stable occasion IDs, logged propensities, and appropriate assumptions required.                    |
| Distinct HELPS, HURTS, NO_MEASURABLE_EFFECT, UNDERPOWERED results | `unimem/experiment.py:468–471`; analysis contract                                            | Mode-specific inference qualifications apply; adaptive coverage is not an unconditional finite-sample guarantee. |
| Configured harmful-memory withdrawal                              | `measure.py:154–164`; evidence/harm policy call path                                         | Configurable and periodically refreshed; not automatic deletion of every questionable memory.                    |
| Policy preregistration, certification, rollback                   | `unimem/promotion.py:78–244`; `docs/promotion.md`                                            | Canonical full trial, immutable criteria, assumptions, support, and revocation freshness matter.                 |
| Review policy can require independent or human approval           | `unimem/approval.py:28–67`; MCP approval contract                                            | Two-person review and human-only review are not universal defaults.                                              |
| Local screening for known secret, PII, injection patterns         | `unimem/memory_guard.py`; focused regressions                                                | Pattern screening is not an exhaustive guarantee; PII redaction is configurable.                                 |
| Scopes and source-bound authority                                 | `unimem/memory_control.py`; `memory_authority.py`; store admission                           | Authenticated caller context is part of the trust boundary.                                                      |
| JSONL/Markdown stores; SQLite facts; rebuildable indexes          | `unimem/store.py`; `fact_store.py`; README storage                                           | Legacy stores retain their format until migration. Do not promise every store is SQLite by default.              |
| MCP, HTTP, Python, CLI integration                                | `mcp_server.py` transport/approval contracts; `openapi/gateway.json`; `measure.py`; `cli.py` | Stdio OS permissions, network tokens, and Hub organization boundaries differ.                                    |
| Supported coding-agent installer targets                          | `unimem/commands/install_cmd.py:10–11`                                                       | Configuration support is not a partnership or proof of live provider compatibility.                              |
| Opt-in multi-agent stale-generation checks                        | `docs/team-isolation.md`; team isolation source/test inventory                               | Point-read declaration, common local lock domain; no predicate locking or distributed consensus.                 |
| Organization roles, scopes, identity integrations in Hub          | `hub/auth.py`; `rbac.py`; `scopes.py`; SSO/SCIM module inventory and documentation           | Requires configured deployment. Real PostgreSQL, OIDC, SCIM, and KMS were not provisioned here.                  |

## What exists, and what to avoid overstating

**Demonstrated now:** source installation, local initialization, fact addition, offline recall, stable measurement wrapper behavior, promotion regressions, and screening regressions. The offline smoke returned the exact seeded fact. The focused product suite passed 67 tests; this is not the full suite.

**Implemented but configuration-dependent:** review separation, withdrawal policy, team isolation, optional retrieval providers, Hub authentication and governance controls. Website copy describes these as choices to configure and validate.

**Newer or partial across tiers:** the contextual causal gate is newer; README states the Hub does not record all per-assignment rates or contexts needed for the local gate. TypeScript SDK is described as 0.1; other language SDKs and JetBrains are described as thin clients. No website stability guarantee is attached to them.

**Experimental/reference/deployment interfaces:** federation noise and some exploration/replay estimates; CPU training reference; hardware appraisal adapters; physical action safety; vendor sandboxes; two-server recall privacy. These are intentionally absent from the marketing narrative beyond source documentation links.

**Not established:** hosted service SLAs, independent security audits, certifications, real customer deployments, traction, live vendor interoperability, full benchmark reproducibility, and universal model learning. No such claims are published.

`pyproject.toml` uses version 1.0.0 while README calls the project pre-1.0 and actively developed. The website avoids a release-stage assertion and says components differ in maturity. Source history includes recent rebranding, retrieval/benchmark changes, and Hub/SDK hardening in #130, #144, and #145.

## Immediate audience and integration work

The immediate fit is an infrastructure or AI-native team with repeated tasks, candidate memories, and an observable success signal. A local developer can prove persistence quickly. Measuring utility needs meaningful traffic, complete outcome capture, and a sound design; there is no one-week or universal sample-size promise.

The measurement integration needs stable memory IDs, actual delivery of the returned set, stable task IDs, final outcome reporting, and monitoring of missingness and scorer changes. Enterprise pilots additionally need explicit data, access, deployment, review, retention, and operator boundaries.

## Public disclosure discipline

Public copy explains interfaces and high-level behavior, not internal thresholds or algorithmic recipes. The animated-looking graph is a small browser interaction with simulated outcomes, not a fabricated product console. No benchmark, customer, performance, partner, or compliance numbers appear as marketing proof. The exact real GitHub repository is linked; no organization or social handles were invented.
