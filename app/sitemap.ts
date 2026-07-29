import type { MetadataRoute } from "next";
import { VIEW_ROUTES } from "@/lib/navigation";

const baseUrl = "https://novatech-networklab.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...Object.values(VIEW_ROUTES), "/recruteur"];

  return routes.map((route) => ({
    url: route === "/" ? baseUrl : `${baseUrl}${route}`,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/recruteur" ? 0.9 : route === "/preuves" ? 0.8 : 0.7,
  }));
}
