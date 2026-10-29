import { ImageResponse } from "next/og";
export const alt = "UniMem — Memory should earn your agent’s trust.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#f8f9f5",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "55px 64px",
        color: "#20251c",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 30,
          borderBottom: "1px solid #cdd7c2",
        }}
      >
        <span style={{ fontSize: 30, fontWeight: 700 }}>UniMem.</span>
        <span style={{ fontSize: 14, letterSpacing: 3 }}>
          EXPERIENCE → EVIDENCE
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
          <span>Memory should earn</span>
          <span>
            your agent’s{" "}
            <span style={{ background: "#d6f78b", marginLeft: 12 }}>
              trust.
            </span>
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
          {["RECALL", "OBSERVE", "EVALUATE", "GOVERN"].map((s, i) => (
            <div
              key={s}
              style={{
                display: "flex",
                gap: 18,
                fontSize: 14,
                color: i === 3 ? "#47682b" : "#657258",
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
          borderTop: "1px solid #cdd7c2",
          paddingTop: 22,
          fontSize: 17,
        }}
      >
        <span>Evidence-based memory for AI agents.</span>
        <span>unimem.org</span>
      </div>
    </div>,
    size,
  );
}
