import { ImageResponse } from "next/og";
export const alt = "UniMem — Intelligence needs a memory.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#f5f8f6",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "55px 64px",
        color: "#174437",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 30,
          borderBottom: "1px solid #cbd8d0",
        }}
      >
        <span style={{ fontSize: 30, fontWeight: 700 }}>UniMem.</span>
        <span style={{ fontSize: 18 }}>Memory for AI agents and robots</span>
      </div>
      <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 55 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 70,
            letterSpacing: -4,
            lineHeight: 1.07,
          }}
        >
          <span>Intelligence needs</span>
          <span>a memory.</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            width: 230,
            borderLeft: "1px solid #cbd8d0",
            paddingLeft: 25,
          }}
        >
          {["Remember", "Recall", "Measure", "Govern"].map((s, i) => (
            <div
              key={s}
              style={{
                display: "flex",
                gap: 18,
                fontSize: 14,
                color: "#246a53",
              }}
            >
              <span>0{i + 1}</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #cbd8d0",
          paddingTop: 22,
          fontSize: 17,
        }}
      >
        <span>The memory system for intelligent machines.</span>
        <span>unimem.org</span>
      </div>
    </div>,
    size,
  );
}
