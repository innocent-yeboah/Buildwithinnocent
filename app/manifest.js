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
        src: "/brand/logo.png",
        sizes: "693x744",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "693x744",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "693x744",
        type: "image/png",
      },
    ],
  };
}
