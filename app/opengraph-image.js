import { ImageResponse } from "next/og";

import { SITE_DESCRIPTION, SITE_TITLE, TAGLINE } from "@/lib/brand";

export const runtime = "edge";

export const alt = SITE_TITLE;

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
          backgroundImage: "linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 48,
            maxWidth: 1000,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "#1E3A5F",
              textAlign: "center",
              lineHeight: 1.15,
            }}
          >
            Build With Innocent
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: "#2E7D32",
              marginTop: 20,
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            {TAGLINE}
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#475569",
              marginTop: 24,
              textAlign: "center",
              maxWidth: 880,
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
