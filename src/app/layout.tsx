import type { Metadata } from "next";
import "./globals.css";
import { BRAND, SITE_CONFIG } from "@/config/brand";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsentBanner } from "@/components/layout/ConsentBanner";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.domain),
  title: {
    default: `${BRAND.name} — Free AI Discovery & Workflow Engine`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  keywords: [
    "AI tools",
    "AI discovery",
    "AI workflows",
    "free AI tools",
    "YouTube AI workflow",
    "AI prompt generator",
    "AI resume builder",
    "ChatGPT alternatives",
    "Claude vs ChatGPT",
    "best AI productivity tools",
  ],
  authors: [{ name: BRAND.name, url: BRAND.domain }],
  creator: BRAND.name,
  publisher: BRAND.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BRAND.domain,
    title: `${BRAND.name} — Tell Us What You Want To Do With AI`,
    description: BRAND.description,
    siteName: BRAND.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — Free AI Discovery & Workflow Engine`,
    description: BRAND.description,
    creator: "@workai_hub",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BRAND.domain}/#organization`,
        "name": BRAND.name,
        "url": BRAND.domain,
        "logo": `${BRAND.domain}/logo.png`,
        "sameAs": [
          BRAND.social.twitter,
          BRAND.social.github,
          BRAND.social.linkedin,
          BRAND.social.youtube,
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${BRAND.domain}/#website`,
        "url": BRAND.domain,
        "name": BRAND.name,
        "description": BRAND.description,
        "publisher": {
          "@id": `${BRAND.domain}/#organization`,
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${BRAND.domain}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Official AdSense Script: Only loaded when ADSENSE_ENABLED=true and publisher ID is set */}
        {SITE_CONFIG.adsense.enabled && SITE_CONFIG.adsense.publisherId && (
          <Script
            id="adsbygoogle-init"
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE_CONFIG.adsense.publisherId}`}
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ConsentBanner />
      </body>
    </html>
  );
}
