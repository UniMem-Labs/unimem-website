"use client";
import { useState } from "react";
import { Arrow } from "./icons";

const stages = [
  {
    name: "Recall",
    title: "Relevant doesn’t always mean useful.",
    text: "Three memories are available for the next task. Which deserve to influence it?",
  },
  {
    name: "Withhold",
    title: "Make room for a comparison.",
    text: "Across repeated tasks, eligible memories are shown or withheld. Each assignment is recorded.",
  },
  {
    name: "Observe",
    title: "Connect memory to what happened.",
    text: "The local demo records 1,000 simulated ticket outcomes. Your own workflow reports its real outcomes, including failures.",
  },
  {
    name: "Evaluate",
    title: "Keep uncertainty in the picture.",
    text: "The demo’s integrity audit is SOUND. Compare shown and withheld outcomes; a small estimate alone does not prove an effect.",
  },
  {
    name: "Govern",
    title: "Change what stays in use.",
    text: "The demo withdraws the harmful memory and graduates the helpful one. Unresolved memories remain under test.",
  },
];
const memories = [
  {
    id: "verify-owner",
    text: "Verify the account owner",
    verdict: "HELPS",
    tone: "helps",
  },
  {
    id: "retry-429",
    text: "Back off on rate limits",
    verdict: "NO MEASURABLE EFFECT",
    tone: "uncertain",
  },
  {
    id: "legacy-refund-api",
    text: "Use the legacy refund API",
    verdict: "HURTS",
    tone: "hurts",
  },
];
export function MemoryDemo() {
  const [step, setStep] = useState(0);
  return (
    <div
      className="memory-lab"
      aria-label="Illustrative memory evaluation loop"
    >
      <div className="lab-heading">
        <span>
          <i className="status-dot" />
          THE MEMORY LOOP
        </span>
        <span className="lab-example">Local demo · simulated agent</span>
      </div>
      <div className="lab-canvas">
        <div className="lab-task">
          <span className="lab-task-icon" aria-hidden="true">
            ↗
          </span>
          <div>
            <span className="lab-label">THE NEXT TASK</span>
            <span>Resolve a support ticket</span>
          </div>
          <span className="lab-task-count">3 memories</span>
        </div>
        <div className="lab-memories">
          {memories.map((memory, index) => {
            const withdrawn = step === 4 && index === 2;
            const status = withdrawn
              ? "WITHDRAWN"
              : step === 4 && index === 0
                ? "GRADUATED"
                : step >= 3
                  ? memory.verdict
                  : step === 2
                    ? "RECORDED"
                    : step === 1
                      ? "IN TRIAL"
                      : "ELIGIBLE";
            return (
              <div
                className={`lab-memory ${step >= 3 ? memory.tone : ""} ${withdrawn ? "is-withdrawn" : ""}`}
                key={memory.id}
              >
                <span className="lab-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <div className="lab-memory-copy">
                  <span className="lab-memory-id">{memory.id}</span>
                  <span className="lab-memory-text">{memory.text}</span>
                </div>
                <span className="lab-trials" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, i) => (
                    <i
                      key={i}
                      className={
                        step === 0
                          ? ""
                          : (i + index) % 3 === 0
                            ? "is-withheld"
                            : "is-delivered"
                      }
                    />
                  ))}
                </span>
                <span className="lab-verdict">{status}</span>
              </div>
            );
          })}
        </div>
        <div className="lab-legend">
          <span>
            <i className="legend-delivered" />
            Delivered
          </span>
          <span>
            <i />
            Withheld
          </span>
          <span className="lab-feedback">
            ↵ Outcomes inform the next recall
          </span>
        </div>
      </div>
      <div className="lab-stages" role="group" aria-label="Explore stages">
        {stages.map((stage, i) => (
          <button
            type="button"
            key={stage.name}
            aria-pressed={step === i}
            aria-controls="memory-stage-description"
            onClick={() => setStep(i)}
          >
            <span>0{i + 1}</span>
            {stage.name}
          </button>
        ))}
      </div>
      <div
        className="lab-description"
        id="memory-stage-description"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="lab-step-count">
          0{step + 1} <span>/ 05</span>
        </span>
        <h2>{stages[step].title}</h2>
        <p>{stages[step].text}</p>
      </div>
      <div className="lab-bottom">
        <p>
          Replays the offline product demo.
          <br />
          Simulated outcomes. Real evidence engine.
        </p>
        <button
          type="button"
          className="lab-next"
          aria-label={
            step === 4 ? "Start again: restart demonstration" : "Next stage"
          }
          onClick={() => setStep((step + 1) % stages.length)}
        >
          {step === 4 ? "Start again" : "Next"}
          <Arrow />
        </button>
      </div>
    </div>
  );
}
