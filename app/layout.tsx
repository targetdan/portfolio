import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://www.danchurch-wilsher.dev";
const TITLE = "Dan Church-Wilsher — Lead .NET & Cloud Developer";
const DESCRIPTION =
  "CV of Dan Church-Wilsher, Lead .NET & Cloud Developer with 11+ years experience building performant C# systems, scalable cloud architecture, and leading engineering teams.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: "Dan Church-Wilsher", url: SITE_URL }],
  keywords: [
    "Dan Church-Wilsher",
    "Lead Developer",
    ".NET Developer",
    "C# Developer",
    "Cloud Developer",
    "AWS",
    "Azure",
    "Software Engineer",
    "CV",
    "Portfolio",
  ],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Dan Church-Wilsher",
    locale: "en_GB",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="dark light" />
        <link rel="canonical" href={SITE_URL} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,700;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
