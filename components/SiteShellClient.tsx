'use client';

import React from "react";
import AosInitializer from "@/libs/aos";
import ScrollTop from "@/components/ScrollToTop";
import { LanguageProvider } from "@/contexts/LanguageContext";

type SiteShellClientProps = {
  children: React.ReactNode;
};

export default function SiteShellClient({ children }: SiteShellClientProps) {
  return (
    <LanguageProvider>
      {children}
      <AosInitializer />
      <ScrollTop />
    </LanguageProvider>
  );
}

