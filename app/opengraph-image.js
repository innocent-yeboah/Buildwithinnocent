import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Build With Innocent — Custom software for Ghanaian businesses";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          backgroundImage: "linear-gradient(135deg, #ffffff 0%, #eef2f7 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 48,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#11274c",
              textAlign: "center",
              lineHeight: 1.15,
            }}
          >
            Build With Innocent
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              color: "#166534",
              marginTop: 24,
              textAlign: "center",
            }}
          >
            Custom software for Ghanaian businesses
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#4b5563",
              marginTop: 22,
              textAlign: "center",
              maxWidth: 920,
            }}
          >
            Websites, WhatsApp automation, dashboards — free prototype first.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
