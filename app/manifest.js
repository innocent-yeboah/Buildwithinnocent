export default function manifest() {
  return {
    name: "Build With Innocent",
    short_name: "BWI",
    description:
      "Digital Business Systems for African Enterprises — custom software, websites, and operating systems.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#11274c",
    icons: [
      {
        src: "/images/logo-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
