export default function manifest() {
  return {
    name: "Build With Innocent",
    short_name: "BWI",
    description:
      "Websites, WhatsApp automation, and custom software for Ghanaian businesses.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#11274c",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
