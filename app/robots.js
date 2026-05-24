/** @returns {import("next").MetadataRoute.Robots} */
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/internal/", "/login"],
    },
    sitemap: "https://buildwithinnocent.com/sitemap.xml",
  };
}
