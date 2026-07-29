import type { ViewKey } from "@/types/network";

export const VIEW_ROUTES = {
  accueil: "/",
  cours: "/cours",
  supervision: "/supervision",
  defis: "/defis",
  terminal: "/terminal",
  journaux: "/journaux",
  resultat: "/resultat",
  progression: "/progression",
  competences: "/competences",
  "a-propos": "/a-propos",
} as const satisfies Record<ViewKey, string>;

export const STATIC_VIEW_SEGMENTS = (
  Object.entries(VIEW_ROUTES) as Array<[ViewKey, string]>
)
  .filter(([view]) => view !== "accueil")
  .map(([, route]) => route.slice(1));

export function isStaticViewSegment(value: string): boolean {
  return STATIC_VIEW_SEGMENTS.includes(value);
}

export function viewFromPath(pathname: string): ViewKey {
  if (pathname === "/recruteur") return "terminal";

  const match = (Object.entries(VIEW_ROUTES) as Array<[ViewKey, string]>).find(
    ([, route]) => route === pathname,
  );

  return match?.[0] ?? "accueil";
}
