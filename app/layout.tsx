import type { Metadata, Viewport } from "next";
import { fonts } from "@/libs/fonts";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: {
    template: '%s',
    default: 'Al Bahar Group',
  },
  description: "",
  openGraph: {
    title: 'Al Bahar Group',
    description: '',
   
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
