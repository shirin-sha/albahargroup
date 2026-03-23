import React from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import SiteShellClient from "@/components/SiteShellClient";

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteShellClient>
      <Header />
      <main>{children}</main>
      <Footer />

      <drawer-opener id="drawer-overlay"></drawer-opener>
    </SiteShellClient>
  );
}
