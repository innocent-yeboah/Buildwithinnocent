import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#166534",
          borderRadius: 36,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, color: "#ffffff" }}>B</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.92)", marginTop: 8 }}>
          W.I.
        </div>
      </div>
    ),
    { ...size }
  );
}
