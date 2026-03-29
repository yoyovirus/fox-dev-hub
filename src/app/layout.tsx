import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/Shell";
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: {
    default: "FoX Dev Hub - Tools for Developers",
    template: "%s | FoX Dev Hub"
  },
  description: "A fast, privacy-first suite of JSON developer tools. Format, validate, diff, and visualize JSON right in your browser.",
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
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <meta name="copyright" content="Copyright © 2026 FoX Dev Hub. All rights reserved." />
        <meta name="author" content="Rahul Khedekar" />
      </head>
      <body>
        <div dangerouslySetInnerHTML={{ __html: '<!-- Website: FoX Dev Hub - Tools for Developers | Author: Rahul Khedekar | Copyright © 2026 FoX Dev Hub. All rights reserved. -->' }} />
        <Shell>{children}</Shell>
        <Analytics />
      </body>
    </html>
  );
}
