import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@xyflow/react/dist/style.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://novatech-networklab.vercel.app"),
  title: {
    default: "NovaTech NetworkLab — Simulateur de diagnostic réseau",
    template: "%s | NovaTech NetworkLab",
  },
  description:
    "Simulateur interactif de diagnostic DNS, DHCP, VLAN, TCP/IP et pare-feu créé par Christian Malivert.",
  authors: [{ name: "Christian Malivert" }],
  creator: "Christian Malivert",
  keywords: ["BTS SIO", "SISR", "diagnostic réseau", "TCP/IP", "DNS", "DHCP", "VLAN"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "NovaTech NetworkLab",
    title: "NovaTech NetworkLab — Trouvez la panne, rétablissez le réseau",
    description:
      "8 cours, 24 questions et 6 incidents réseau interactifs pour démontrer une démarche BTS SIO SISR.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NovaTech NetworkLab",
    description:
      "Cours, quiz et incidents réseau interactifs créés par Christian Malivert, étudiant BTS SIO SISR.",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07111f" },
    { media: "(prefers-color-scheme: light)", color: "#f3f7fb" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
