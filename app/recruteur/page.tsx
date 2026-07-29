import type { Metadata } from "next";
import { NetworkLabApp } from "@/components/NetworkLabApp";

export const metadata: Metadata = {
  title: "Démonstration recruteur",
  description:
    "Évaluez en moins de deux minutes la démarche de diagnostic réseau de Christian Malivert.",
  alternates: {
    canonical: "/recruteur",
  },
  openGraph: {
    url: "/recruteur",
    title: "Démonstration recruteur — NovaTech NetworkLab",
    description:
      "Une panne DNS guidée, du premier test au rapport d’intervention, en moins de deux minutes.",
  },
};

export default function RecruiterPage() {
  return <NetworkLabApp initialRecruiterMode />;
}
