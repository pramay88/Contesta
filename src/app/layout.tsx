import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { AppShell } from "@/components/AppShell";
import Script from "next/script";


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
  metadataBase: new URL("https://contestx.vercel.app"),

  title: {
    default: "ContestX - Coding Contest Tracker",
    template: "%s | ContestX",
  },

  description:
    "Track upcoming programming contests from Codeforces, LeetCode, CodeChef, AtCoder, HackerRank, HackerEarth, and more. Never miss a coding contest again.",

  keywords: [
    "coding contests",
    "competitive programming",
    "contest tracker",
    "Codeforces contests",
    "LeetCode contests",
    "AtCoder contests",
    "CodeChef contests",
    "HackerRank",
    "HackerEarth",
    "ContestX",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "ContestX - Coding Contest Tracker",
    description:
      "Track coding contests from Codeforces, LeetCode, CodeChef, AtCoder and more.",
    url: "https://contestx.vercel.app",
    siteName: "ContestX",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ContestX",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ContestX",
    description:
      "Upcoming coding contests from multiple platforms.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ContestX",
    url: "https://contestx.vercel.app",
    description:
      "Track upcoming programming contests from Codeforces, LeetCode, CodeChef, AtCoder and more.",
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "ContestX",
      url: "https://contestx.vercel.app",
    },
  };
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ContestX",
    url: "https://contestx.vercel.app",
    logo: "https://contestx.vercel.app/logo.png",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);
        t.async=1;
        t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "xohml386hg");
    `}
        </Script>
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <AppShell>{children}</AppShell>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([jsonLd, organization]),
          }}
        />
        {/* Umami */}
        <script defer src="https://glitch-umami.vercel.app/script.js" data-website-id="ec93707d-1b51-4f61-a5bf-62ae19804c4d"></script>
        <Analytics />
      </body>
    </html>
  );
}
