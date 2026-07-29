import type { MetadataRoute } from "next";

const baseUrl = "https://novatech-networklab.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/cours",
    "/recruteur",
    "/supervision",
    "/defis",
    "/terminal",
    "/journaux",
    "/progression",
    "/competences",
    "/a-propos",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/recruteur" ? 0.9 : 0.7,
  }));
}
