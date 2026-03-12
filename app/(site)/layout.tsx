import React from "react";
import "@/styles/footer.css";
import "@/styles/modal.css";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import SiteShellClient from "@/components/SiteShellClient";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteShellClient>
      <Header />
      <main>{children}</main>
      <Footer />

      {/* Modal and Drawer Overlay */}
      <drawer-opener id="drawer-overlay"></drawer-opener>
    </SiteShellClient>
  );
}

