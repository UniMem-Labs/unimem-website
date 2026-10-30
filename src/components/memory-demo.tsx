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
    text: "Your workflow reports the final outcome for every task—including failures and escalations.",
  },
  {
    name: "Evaluate",
    title: "Keep uncertainty in the picture.",
    text: "Check trial integrity, then compare outcomes. Underpowered means the evidence cannot answer yet.",
  },
  {
    name: "Govern",
    title: "Change what stays in use.",
    text: "A configured policy can withdraw harmful guidance. Promotion and rollback follow a separate review path.",
  },
];
const memories = [
  {
    id: "retry-429",
    text: "Back off on rate limits",
    verdict: "HELPS",
    tone: "helps",
  },
  {
    id: "legacy-endpoint",
    text: "Use the old API endpoint",
    verdict: "HURTS",
    tone: "hurts",
  },
  {
    id: "cache-hint",
    text: "Reuse cached responses",
    verdict: "UNDERPOWERED",
    tone: "uncertain",
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
        <span className="lab-example">Illustrative example</span>
      </div>
      <div className="lab-canvas">
        <div className="lab-task">
          <span className="lab-task-icon" aria-hidden="true">
            ↗
          </span>
          <div>
            <span className="lab-label">THE NEXT TASK</span>
            <span>Complete an API request</span>
          </div>
          <span className="lab-task-count">3 memories</span>
        </div>
        <div className="lab-memories">
          {memories.map((memory, index) => {
            const withdrawn = step === 4 && index === 1;
            const status = withdrawn
              ? "WITHDRAWN"
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
          Simulated outcomes.
          <br />
          No customer or benchmark data.
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
