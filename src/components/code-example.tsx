"use client";
import { useEffect, useRef, useState } from "react";
import { event } from "./analytics";
import { REPO } from "@/lib/site";
export const examples = {
  CLI: `git clone ${REPO}.git\ncd unimem\npython -m pip install -e .\n\nunimem init --dest ./mem\nunimem fact add "Use exponential backoff on 429." --dest ./mem\nunimem recall "How should we handle rate limits?" --dest ./mem`,
  Python: `from unimem.measure import CausalMemory\n\n# First configure an experiment with the CLI.\ncandidates = [\n    {"id": "retry-429", "text": "Back off on 429."}\n]\nmemory = CausalMemory(\n    lambda task, **_: candidates, root="./mem"\n)\nshown = memory.recall(\n    "Handle a rate limit", occasion_id="task-1042"\n)\n# Run your agent using only the returned memories.\nmemory.record_outcome("task-1042", succeeded=True)`,
  MCP: `# Install the optional MCP dependency first.\npython -m pip install -e '.[serve]'\n\n# Connect a client to this stdio server.\nunimem serve --transport stdio --dest ./mem\n\n# Or write a supported coding-agent configuration.\nunimem install --target claude-code`,
  HTTP: `# Start with: unimem up --dest ./mem\n# Use the private gateway token shown at startup.\ncurl http://localhost:8787/v1/recall \\\n  -H "Authorization: Bearer $UNIMEM_TOKEN" \\\n  -H 'Content-Type: application/json' \\\n  -d '{"occasion_id":"task-1042","items":[\n    {"id":"retry-429","text":"Back off on 429."}\n  ]}'`,
};
export function CopyCode({
  code,
  label = "Example",
}: {
  code: string;
  label?: string;
}) {
  const [state, setState] = useState("Copy");
  const pre = useRef<HTMLPreElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setState("Copied");
      event("quickstart_copy", { example: label });
    } catch {
      const selection = window.getSelection();
      if (selection && pre.current) {
        const range = document.createRange();
        range.selectNodeContents(pre.current);
        selection.removeAllRanges();
        selection.addRange(range);
        setState("Text selected");
      } else setState("Select to copy");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("Copy"), 2500);
  }
  return (
    <div className="code-block">
      <div className="code-bar">
        <span>{label}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={`${state} ${label}`}
          aria-live="polite"
        >
          {state}{" "}
          <svg
            width="14"
            height="14"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            {state === "Copied" ? (
              <path
                d="m4 10 4 4 8-9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <>
                <rect
                  x="7"
                  y="7"
                  width="9"
                  height="10"
                  rx="1.5"
                  stroke="currentColor"
                />
                <path
                  d="M12 5V3H3v10h2"
                  stroke="currentColor"
                  strokeLinejoin="round"
                />
              </>
            )}
          </svg>
        </button>
      </div>
      <pre ref={pre} tabIndex={0} aria-label={`${label} code example`}>
        <code>
          {code.split("\n").map((line, i) => (
            <span
              className={
                line.trimStart().startsWith("#") ? "code-comment" : "code-line"
              }
              key={i}
            >
              {line.trimStart().startsWith("#")
                ? line || " "
                : line
                    .split(
                      /("[^"\n]*"|'[^'\n]*'|\b(?:from|import|def|return|True|False|None|curl|python|unimem)\b)/g,
                    )
                    .map((token, index) => (
                      <span
                        key={index}
                        className={
                          /^['"]/.test(token)
                            ? "code-string"
                            : /^(from|import|def|return|True|False|None|curl|python|unimem)$/.test(
                                  token,
                                )
                              ? "code-keyword"
                              : undefined
                        }
                      >
                        {token}
                      </span>
                    ))}
              <br />
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
export function CodeExample() {
  const [tab, setTab] = useState<keyof typeof examples>("CLI");
  return (
    <div className="code-example">
      <div className="code-tabs" role="group" aria-label="Integration example">
        {(Object.keys(examples) as (keyof typeof examples)[]).map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={name === tab}
            onClick={() => setTab(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <CopyCode
        key={tab}
        label={
          tab === "CLI" ? "terminal / local-first" : `${tab} / integration`
        }
        code={examples[tab]}
      />
      <p className="code-note">
        Real commands. Your own store. <span>Python 3.10+ · AGPL-3.0-only</span>
      </p>
    </div>
  );
}
