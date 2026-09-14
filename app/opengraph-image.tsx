import { ImageResponse } from "next/og";

export const alt = "Ambrosia — Journaling for ADHD minds";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#fffaf2",
          color: "#2f2924",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#a66a2c",
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Ambrosia
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            marginTop: 28,
            textAlign: "center",
          }}
        >
          Understand your days without a perfect journal.
        </div>
        <div
          style={{
            color: "#756b62",
            fontSize: 28,
            marginTop: 28,
          }}
        >
          Gentle check-ins, notes, and weekly patterns for ADHD minds.
        </div>
      </div>
    ),
    size,
  );
}
