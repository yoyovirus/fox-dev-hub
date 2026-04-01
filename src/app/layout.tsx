import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/Shell";

export const metadata: Metadata = {
  metadataBase: new URL('https://fox-dev-tools.vercel.app'), // Assuming foxdevtools.com, or user can replace
  title: {
    default: "FoX Dev Tools - Tools for Developers",
    template: "%s | FoX Dev Tools"
  },
  description: "A fast, privacy-first suite of developer tools. Format, validate, convert, and visualize data right in your browser.",
  keywords: ["developer tools", "JSON formatter", "Base64 encoder", "privacy-first tools", "local tools"],
  authors: [{ name: "Rahul Khedekar" }],
  creator: "Rahul Khedekar",
  openGraph: {
    title: "FoX Dev Tools - Local Developer Tools",
    description: "Zero backend, 100% private developer tools. Run formatting and validations instantly in your browser.",
    url: "https://fox-dev-tools.vercel.app",
    siteName: "FoX Dev Tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FoX Dev Tools",
    description: "Fast, privacy-first tools for developers.",
  },
  alternates: {
    canonical: '/',
  },
  appleWebApp: {
    title: "FoX Dev Tools",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
