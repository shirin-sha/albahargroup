import React from 'react';
import '@/styles/footer.css';
import '@/styles/modal.css';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import SiteShellClient from '@/components/SiteShellClient';

/**
 * English news detail and sub-routes (`/news/*`) live outside `(site)`,
 * so they need the same shell as `(site)` and `/blogs` for Header/Footer.
 */
export default function NewsLayout({
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
