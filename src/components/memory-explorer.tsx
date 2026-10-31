"use client";

import { useId, useState } from "react";
import { MemoryGlyph } from "./icons";

const kinds = [
  {
    name: "Facts",
    symbol: "fact",
    subtitle: "What was true. And when.",
    type: "Bitemporal fact",
    title: "The right answer changes with time.",
    description:
      "Valid time records when a fact was true. Record time captures when your store learned it. Keep both, and a correction doesn’t have to erase history.",
    file: "facts / refund-policy",
    source: "Support handbook · revision 02",
  },
  {
    name: "Lessons",
    symbol: "lesson",
    subtitle: "Experience worth carrying forward.",
    type: "Reviewed lesson",
    title: "A lesson earns its place.",
    description:
      "Capture reusable guidance from experience. Bind review to the exact revision, measure its effect, and withdraw it when the evidence changes.",
    file: "lessons / verify-owner",
    source: "Reviewed support procedure",
  },
  {
    name: "Knowledge graph",
    symbol: "graph",
    subtitle: "The connections between the facts.",
    type: "Typed relationships",
    title: "Recall the relationship, too.",
    description:
      "Follow entities and relations across multiple hops. Validity windows and caller scope apply along the path, including intermediate facts.",
    file: "graph / payments-service",
    source: "Illustrative project graph",
  },
  {
    name: "Conversations",
    symbol: "conversation",
    subtitle: "Continuity beyond a single session.",
    type: "Conversation memory",
    title: "Pick up where the work left off.",
    description:
      "Keep conversations in their own spaces. Recall relevant history, summaries, and preferences within a token budget, instead of replaying everything.",
    file: "conversations / project-alpha",
    source: "Project workspace · private space",
  },
  {
    name: "Core blocks",
    symbol: "block",
    subtitle: "The context that stays close.",
    type: "Core memory block",
    title: "Some context belongs up front.",
    description:
      "Maintain bounded memory blocks for persistent agent context. Revisions and an audit log make changes inspectable.",
    file: "blocks / project-context",
    source: "Versioned project context",
  },
  {
    name: "Procedures",
    symbol: "procedure",
    subtitle: "A way to remember how.",
    type: "Procedural memory",
    title: "Carry a workflow into the next task.",
    description:
      "Record procedures your agent can replay, alongside curated knowledge pages and ordered incident narratives. Your application controls execution.",
    file: "procedures / release-check",
    source: "Reviewed release workflow",
  },
] as const;

function Graph() {
  return (
    <>
      <svg
        className="explorer-graph"
        viewBox="0 0 500 180"
        role="img"
        aria-label="Project Alpha uses the payments service, which implements refunds API v2."
      >
        <defs>
          <marker
            id="graph-arrow"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0 0 6 3 0 6" fill="#a7d0bc" />
          </marker>
        </defs>
        <path
          d="M145 91H211M332 91H383"
          stroke="#a7d0bc"
          strokeWidth="1.5"
          markerEnd="url(#graph-arrow)"
        />
        <g fill="#b8c5b8" fontSize="10" fontFamily="monospace">
          <text x="170" y="77">
            uses
          </text>
          <text x="337" y="77">
            calls
          </text>
        </g>
        {[
          { x: 10, w: 135, name: "Project Alpha", type: "Project" },
          { x: 218, w: 111, name: "Payments", type: "Service" },
          { x: 389, w: 105, name: "API v2", type: "Endpoint" },
        ].map((n) => (
          <g key={n.name}>
            <rect
              x={n.x}
              y="53"
              width={n.w}
              height="77"
              rx="3"
              stroke="#5b7260"
              fill="#235443"
            />
            <text
              x={n.x + 12}
              y="77"
              fill="#a7d0bc"
              fontSize="9"
              fontFamily="monospace"
            >
              {n.type}
            </text>
            <text x={n.x + 12} y="108" fill="#f4f7f0" fontSize="15">
              {n.name}
            </text>
          </g>
        ))}
      </svg>
      <div
        className="explorer-graph-mobile"
        role="img"
        aria-label="Project Alpha uses the payments service, which implements refunds API v2."
      >
        <div aria-hidden="true">
          <span>Project</span>
          <strong>Project Alpha</strong>
        </div>
        <p aria-hidden="true">uses ↓</p>
        <div aria-hidden="true">
          <span>Service</span>
          <strong>Payments</strong>
        </div>
        <p aria-hidden="true">calls ↓</p>
        <div aria-hidden="true">
          <span>Endpoint</span>
          <strong>API v2</strong>
        </div>
      </div>
    </>
  );
}

export function MemoryExplorer({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const [selected, setSelected] = useState(0);
  const [past, setPast] = useState(false);
  const id = useId();
  const kind = kinds[selected];
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="memory-explorer">
      <div
        className="explorer-menu"
        role="group"
        aria-label="Explore memory types"
      >
        {kinds.map((item, i) => (
          <button
            type="button"
            key={item.name}
            aria-pressed={selected === i}
            aria-controls={id}
            onClick={() => setSelected(i)}
          >
            <span className="explorer-glyph">
              <MemoryGlyph kind={item.symbol} />
            </span>
            <span>
              <strong>{item.name}</strong>
              <small>{item.subtitle}</small>
            </span>
          </button>
        ))}
      </div>
      <div
        className="explorer-detail"
        id={id}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="explorer-toolbar">
          <span>Project Alpha</span>
          <span>Illustrative store</span>
        </div>
        <div className="explorer-content" key={kind.name}>
          <span className="eyebrow">{kind.type}</span>
          <Heading className="explorer-title">{kind.title}</Heading>
          <p>{kind.description}</p>
          <div className="explorer-record">
            <div className="explorer-record-head">
              <span>{kind.file}</span>
            </div>
            {selected === 0 ? (
              <>
                <div
                  className="temporal-switch"
                  role="group"
                  aria-label="Recall fact at a point in time"
                >
                  <button
                    type="button"
                    aria-pressed={!past}
                    onClick={() => setPast(false)}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    aria-pressed={past}
                    onClick={() => setPast(true)}
                  >
                    As of Jan 2, 2026
                  </button>
                </div>
                <p className="record-question">How are refunds issued?</p>
                <p className="record-answer">
                  {past
                    ? "Through the v1 refunds endpoint."
                    : "Through the v2 payments API."}
                </p>
                <dl className="record-meta">
                  <div>
                    <dt>Valid from</dt>
                    <dd>{past ? "Jan 1, 2026" : "Jan 10, 2026"}</dd>
                  </div>
                  <div>
                    <dt>Recorded</dt>
                    <dd>{past ? "Jan 1, 2026" : "Jan 12, 2026"}</dd>
                  </div>
                </dl>
              </>
            ) : selected === 1 ? (
              <>
                <p className="record-answer">
                  Verify the account owner before any password reset.
                </p>
                <dl className="record-meta">
                  <div>
                    <dt>Review</dt>
                    <dd>Bound to revision 01</dd>
                  </div>
                  <div>
                    <dt>Lifecycle</dt>
                    <dd>Review → trial → evidence</dd>
                  </div>
                </dl>
              </>
            ) : selected === 2 ? (
              <Graph />
            ) : selected === 3 ? (
              <div className="record-conversation">
                <p>
                  <span>Yesterday</span>We’re moving refunds to the v2 API.
                </p>
                <p>
                  <span>Recalled today</span>The migration decision is available
                  in the next session.
                </p>
              </div>
            ) : selected === 4 ? (
              <>
                <p className="record-answer">
                  Project Alpha
                  <br />
                  <span className="record-muted">
                    Payments service · Python 3.12
                    <br />
                    Prefer small, reviewable changes.
                  </span>
                </p>
                <dl className="record-meta">
                  <div>
                    <dt>Block</dt>
                    <dd>project-context</dd>
                  </div>
                  <div>
                    <dt>Revision</dt>
                    <dd>03 · audit recorded</dd>
                  </div>
                </dl>
              </>
            ) : (
              <ol className="record-procedure">
                <li>Run the release checks.</li>
                <li>Verify the signed artifact.</li>
                <li>Request approval before deployment.</li>
              </ol>
            )}
          </div>
          <div className="explorer-source">
            <span>{kind.source}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
