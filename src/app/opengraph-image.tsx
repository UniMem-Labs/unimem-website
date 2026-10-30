import { ImageResponse } from "next/og";
export const alt = "UniMem — Intelligence needs a memory.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#15231d",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "55px 64px",
        color: "#f5f7f0",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 30,
          borderBottom: "1px solid #3d4d42",
        }}
      >
        <span style={{ fontSize: 30, fontWeight: 700 }}>UniMem.</span>
        <span style={{ fontSize: 14, letterSpacing: 3 }}>
          AGENTS · ROBOTS · EVIDENCE
        </span>
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
          <span>
            a <span style={{ color: "#d6f78b", marginLeft: 12 }}>memory.</span>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            width: 230,
            borderLeft: "1px solid #bcc9ac",
            paddingLeft: 25,
          }}
        >
          {["REMEMBER", "RECALL", "MEASURE", "GOVERN"].map((s, i) => (
            <div
              key={s}
              style={{
                display: "flex",
                gap: 18,
                fontSize: 14,
                color: i === 3 ? "#d6f78b" : "#c3cfc3",
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
          borderTop: "1px solid #3d4d42",
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
