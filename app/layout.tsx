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
  title: {
    default: "NovaTech NetworkLab — Simulateur de diagnostic réseau",
    template: "%s | NovaTech NetworkLab",
  },
  description:
    "Simulateur interactif de diagnostic DNS, DHCP, VLAN, TCP/IP et pare-feu créé par Christian Malivert.",
  authors: [{ name: "Christian Malivert" }],
  keywords: ["BTS SIO", "SISR", "diagnostic réseau", "TCP/IP", "DNS", "DHCP", "VLAN"],
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

