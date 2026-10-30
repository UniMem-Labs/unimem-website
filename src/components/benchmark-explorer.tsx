"use client";

import { useState } from "react";
import { benchmarkData } from "@/lib/benchmark-data";
import { SOURCE } from "@/lib/site";

export function BenchmarkExplorer() {
  const [selected, setSelected] = useState(0);
  const data = benchmarkData[selected];
  return (
    <div className="benchmark-explorer">
      <div
        className="benchmark-tabs"
        role="group"
        aria-label="Select retrieval benchmark"
      >
        {benchmarkData.map((item, i) => (
          <button
            key={item.name}
            type="button"
            aria-pressed={selected === i}
            aria-controls="benchmark-chart"
            onClick={() => setSelected(i)}
          >
            {item.name}
            <span>0{i + 1}</span>
          </button>
        ))}
      </div>
      <figure id="benchmark-chart" aria-labelledby="benchmark-title">
        <div className="benchmark-overview" aria-live="polite">
          <div>
            <span className="eyebrow">GOLD EVIDENCE DELIVERED</span>
            <h2 id="benchmark-title">
              {data.baseline.toFixed(1)}% <span aria-label="to">→</span>{" "}
              {data.improved.toFixed(1)}%
            </h2>
            <p>{data.sample}</p>
          </div>
          <div className="benchmark-legend">
            <span>
              <i />
              Fixed 1,500-token baseline
            </span>
            <span>
              <i />
              Adaptive 6,000–16,000 tokens
            </span>
          </div>
        </div>
        <table className="benchmark-chart-table">
          <caption>
            Share of gold evidence turns delivered to the reader by category,{" "}
            {data.name}.
          </caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Delivered evidence</th>
              <th scope="col">Before → after</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map(([name, before, after]) => (
              <tr key={name}>
                <th scope="row">{name}</th>
                <td>
                  <div className="benchmark-bars" aria-hidden="true">
                    <span style={{ width: before + "%" }} />
                    <span style={{ width: after + "%" }} />
                  </div>
                </td>
                <td>
                  {before.toFixed(1)} <span>→</span> {after.toFixed(1)}
                  <small>%</small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <figcaption>
          <strong>Context has a cost.</strong> Average delivered tokens:{" "}
          {data.tokens}. The improved arm uses a larger adaptive budget and a
          revised reader prompt. This comparison does not isolate a single
          change, and these retrieval scores are not answer accuracy.
        </figcaption>
      </figure>
      <div className="benchmark-source">
        <span>
          Published product measurements · not independently rerun here
        </span>
        <a href={SOURCE + "/docs/memory-benchmarks.md"}>
          Read the full methodology ↗
        </a>
      </div>
    </div>
  );
}
