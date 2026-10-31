import { ImageResponse } from "next/og";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#174437",
        color: "#d9eae1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 100,
        fontWeight: 700,
      }}
    >
      U.
    </div>,
    size,
  );
}
