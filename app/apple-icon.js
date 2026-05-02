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
          backgroundColor: "#1E3A5F",
          borderRadius: 36,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, color: "#ffffff" }}>B</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "#2E7D32", marginTop: 8 }}>
          W.I.
        </div>
      </div>
    ),
    { ...size }
  );
}
