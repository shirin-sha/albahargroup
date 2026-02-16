'use client';

import React from "react";
import "@/styles/footer.css";
import "@/styles/modal.css";
import AosInitializer from "@/libs/aos";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import ScrollTop from "@/components/ScrollToTop";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <Header />
      <main>{children}</main>
      <Footer />

      {/* Modal and Drawer Overlay */}
      <drawer-opener id="drawer-overlay"></drawer-opener>

      {/* AOS Init */}
      <AosInitializer />

      {/* Scroll to Top Button */}
      <ScrollTop />
    </LanguageProvider>
  );
}

