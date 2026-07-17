import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { AppShell } from "@/components/AppShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ContestForge",
  description:
    "A clean, startup-quality feed for upcoming coding contests, platform stats, and calendar planning.",
  icons: {
    icon: "/contesta-logo.png",
  },
  openGraph: {
    title: "ContestForge",
    description: "A clean, startup-quality feed for upcoming coding contests.",
    type: "website",
  },
  metadataBase: new URL("https://contestforge.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
