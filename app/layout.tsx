import type { Metadata, Viewport } from "next";
import { fonts } from "@/libs/fonts";
import "@/styles/global.css";
import "@/styles/footer.css";
import "@/styles/modal.css";
import AosInitializer from "@/libs/aos";

import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import ScrollTop from "@/components/ScrollToTop";

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
    <html lang="en">
      <body className={fonts}>
        <Header />        
        <main>{children}</main>
        <Footer />
        
        {/* Modal and Drawer Overlay */}
        <drawer-opener id="drawer-overlay"></drawer-opener>

        {/* AOS Init */}
        <AosInitializer />
        
        {/* Scroll to Top Button */}
        <ScrollTop />
      </body>
    </html>
  );
}
