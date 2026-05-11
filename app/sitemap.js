/** @returns {import("next").MetadataRoute.Sitemap} */
export default function sitemap() {
  const base = new URL("https://buildwithinnocent.com/");
  const urls = ["/", "/bootcamp", "/privacy", "/terms", "/cookies"];
  return urls.map((path) => ({
    url: new URL(path, base).href,
    lastModified: new Date(),
    changeFrequency:
      path === "/"
        ? "weekly"
        : path === "/bootcamp"
          ? "monthly"
          : path === "/cookies"
            ? "yearly"
            : "yearly",
    priority:
      path === "/" ? 1 : path === "/bootcamp" ? 0.85 : path === "/privacy" ? 0.4 : path === "/cookies" ? 0.35 : 0.4,
  }));
}
