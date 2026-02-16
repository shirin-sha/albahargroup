'use client';

import React from "react";
import "@/styles/footer.css";
import "@/styles/modal.css";
import AosInitializer from "@/libs/aos";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import ScrollTop from "@/components/ScrollToTop";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useEffect } from "react";

export default function ArLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Set HTML lang attribute to Arabic
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    
    return () => {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    };
  }, []);

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
