import type { Metadata, Viewport } from "next";
import { fonts } from "@/libs/fonts";
import "@/styles/global.css";
import { getSiteUrl } from "@/libs/seo";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    template: '%s',
    default: 'Al Bahar Group',
  },
  description: "Al Bahar Group businesses, capabilities, partnerships, and corporate updates.",
  openGraph: {
    title: 'Al Bahar Group',
    description: 'Al Bahar Group businesses, capabilities, partnerships, and corporate updates.',
    siteName: 'Al Bahar Group',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={fonts}>
        {children}
      </body>
    </html>
  );
}
