"use client";

import { useState } from "react";
import { CopyCode } from "./code-example";
import { REPO } from "@/lib/site";
import { Arrow } from "./icons";

const clients = [
  ["Codex", "codex"],
  ["Claude Code", "claude-code"],
  ["Cursor", "cursor"],
  ["Windsurf", "windsurf"],
  ["MCP client", "generic-mcp"],
] as const;

export function Quickstart() {
  const [windows, setWindows] = useState(false);
  const [client, setClient] = useState(0);
  const install = [
    "git clone " + REPO + ".git",
    "cd unimem",
    windows ? "python -m venv .venv" : "python3 -m venv .venv",
    windows ? ".\\.venv\\Scripts\\Activate.ps1" : "source .venv/bin/activate",
    "python -m pip install -e .",
  ].join("\n");
  return (
    <section className="quickstart-workbench" aria-labelledby="workbench-title">
      <div className="workbench-heading">
        <div>
          <h2 id="workbench-title">Your first memory loop.</h2>
          <p>No account. No model. No API key.</p>
        </div>
        <div
          className="workbench-os"
          role="group"
          aria-label="Select your operating system"
        >
          <button
            type="button"
            aria-pressed={!windows}
            onClick={() => setWindows(false)}
          >
            macOS / Linux
          </button>
          <button
            type="button"
            aria-pressed={windows}
            onClick={() => setWindows(true)}
          >
            Windows
          </button>
        </div>
      </div>
      <div className="workbench-steps">
        <article>
          <div className="workbench-step-title">
            <span>01</span>
            <h3>Install the local core.</h3>
          </div>
          <p>
            Python 3.10+ and Git. A virtual environment keeps the install in
            your project.
          </p>
          <CopyCode
            key={String(windows)}
            code={install}
            label={windows ? "PowerShell / install" : "Terminal / install"}
          />
        </article>
        <article>
          <div className="workbench-step-title">
            <span>02</span>
            <h3>Run the complete loop.</h3>
          </div>
          <p>
            A real local store and evidence engine, with simulated agent
            outcomes you can inspect.
          </p>
          <CopyCode
            code="unimem demo --keep ./demo-store"
            label="Terminal / offline demonstration"
          />
          <div className="workbench-result">
            <span className="eyebrow">Expected result</span>
            <p>
              Integrity audit: <strong>SOUND</strong>
              <br />
              A helpful memory graduates.
              <br />A harmful memory is withdrawn.
            </p>
          </div>
        </article>
      </div>
      <div className="workbench-connect">
        <div>
          <span className="eyebrow">03 / Connect your agent</span>
          <h3>Bring memory into the work.</h3>
          <p>
            The installer writes a local client configuration. Replace{" "}
            <code>./agent-project</code> with your project directory and review
            the generated files.
          </p>
        </div>
        <div>
          <div
            className="client-picker"
            role="group"
            aria-label="Choose your agent"
          >
            {clients.map(([name], i) => (
              <button
                type="button"
                key={name}
                aria-pressed={client === i}
                onClick={() => setClient(i)}
              >
                {name}
              </button>
            ))}
          </div>
          <CopyCode
            key={client}
            code={
              'python -m pip install -e ".[serve]"\nunimem install --target ' +
              clients[client][1] +
              " --dest ./agent-project"
            }
            label={clients[client][0] + " / local configuration"}
          />
          <p className="client-setup-note">
            Merge{" "}
            <code>
              {client === 0
                ? ".codex/unimem.mcp.toml"
                : "unimem.local.mcp.json"}
            </code>{" "}
            into your client’s MCP settings. Launch the client from the
            activated environment, or point its server command at the{" "}
            <code>unimem</code> executable inside your virtual environment.
          </p>
        </div>
      </div>
      <p className="workbench-footnote">
        AGPL-3.0-only · Runs on your machine · Re-running step 02 requires a new
        or removed demo-store directory.{" "}
        <a href={REPO + "#quickstart"}>
          Product quickstart <Arrow diagonal />
        </a>
      </p>
    </section>
  );
}
