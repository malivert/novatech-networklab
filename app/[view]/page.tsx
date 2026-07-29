import { NetworkLabApp } from "@/components/NetworkLabApp";

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    "cours",
    "supervision",
    "defis",
    "terminal",
    "journaux",
    "resultat",
    "progression",
    "competences",
    "a-propos",
  ].map((view) => ({ view }));
}

export default function NetworkLabViewPage() {
  return <NetworkLabApp />;
}
