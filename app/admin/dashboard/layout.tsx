'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import LogoImage from "@/public/img/logo.png";
import Icons from "@/components/Icons";
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [cmsOpen, setCmsOpen] = useState(false);

  useEffect(() => {
    // Auto-expand CMS menu if on CMS pages
    if (pathname?.startsWith('/admin/dashboard/cms')) {
      setCmsOpen(true);
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      router.push('/admin');
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const isCmsActive = () => {
    return pathname?.startsWith('/admin/dashboard/cms');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
         <img src={LogoImage.src} alt="logo" className="admin-sidebar-logo" />
        </div>
        <nav className="admin-sidebar-nav">
        <Link
            href="/admin/dashboard/enquiries"
            className={`admin-sidebar-link ${isActive('/admin/dashboard/enquiries') ? 'active' : ''}`}
          >
            <Icons.Contact />
            <span>Enquiries</span>
          </Link>
          <Link
            href="/admin/dashboard"
            className={`admin-sidebar-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
          >
            <Icons.Admin />
            <span>Dashboard</span>
          </Link>
          
          <div className={`admin-sidebar-group ${isCmsActive() ? 'active' : ''}`}>
            <button
              type="button"
              className={`admin-sidebar-group-toggle ${cmsOpen ? 'open' : ''}`}
              onClick={() => setCmsOpen(!cmsOpen)}
            >
              <span className="admin-sidebar-link-label">
                <Icons.Refine />
                <span>CMS</span>
              </span>
              <span className="admin-sidebar-arrow">
                {cmsOpen ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
              </span>
            </button>
            {cmsOpen && (
              <div className="admin-sidebar-submenu">
                <Link
                  href="/admin/dashboard/cms/home"
                  className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/dashboard/cms/home') ? 'active' : ''}`}
                >
                  <Icons.Discover />
                  <span>Home</span>
                </Link>
                <Link
                  href="/admin/dashboard/cms/about"
                  className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/dashboard/cms/about') ? 'active' : ''}`}
                >
                  <Icons.Purpose />
                  <span>About</span>
                </Link>
                <Link
                  href="/admin/dashboard/cms/news"
                  className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/dashboard/cms/news') ? 'active' : ''}`}
                >
                  <Icons.Calendar />
                  <span>News</span>
                </Link>
                <Link
                  href="/admin/dashboard/cms/careers"
                  className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/dashboard/cms/careers') ? 'active' : ''}`}
                >
                  <Icons.Launch />
                  <span>Careers</span>
                </Link>
                <Link
                  href="/admin/dashboard/cms/partnerships"
                  className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/dashboard/cms/partnerships') ? 'active' : ''}`}
                >
                  <Icons.Handshake />
                  <span>Partnerships</span>
                </Link>
                <Link
                  href="/admin/dashboard/cms/contact"
                  className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/dashboard/cms/contact') ? 'active' : ''}`}
                >
                  <Icons.Phone />
                  <span>Contact Us</span>
                </Link>
                {/* <Link
                  href="/admin/dashboard/cms/header"
                  className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/dashboard/cms/header') ? 'active' : ''}`}
                >
                  Header
                </Link> */}
              </div>
            )}
          </div>
          
          <Link
            href="/admin/dashboard/posts"
            className={`admin-sidebar-link ${isActive('/admin/dashboard/posts') ? 'active' : ''}`}
          >
            <Icons.Comment />
            <span>Posts</span>
          </Link>
          
          <Link
            href="/admin/dashboard/projects"
            className={`admin-sidebar-link ${isActive('/admin/dashboard/projects') ? 'active' : ''}`}
          >
            <Icons.Design />
            <span>Image Archive</span>
          </Link>

          <Link
            href="/admin/dashboard/services/businesses"
            className={`admin-sidebar-link ${isActive('/admin/dashboard/services/businesses') ? 'active' : ''}`}
          >
            <Icons.Storefront />
            <span>Services - Businesses</span>
          </Link>

          <Link
            href="/admin/dashboard/services/capabilities"
            className={`admin-sidebar-link ${isActive('/admin/dashboard/services/capabilities') ? 'active' : ''}`}
          >
            <Icons.Plan />
            <span>Services - Capabilities</span>
          </Link>
          
          <Link
            href="/admin/dashboard/teams"
            className={`admin-sidebar-link ${isActive('/admin/dashboard/teams') ? 'active' : ''}`}
          >
            <Icons.Handshake />
            <span>Teams</span>
          </Link>

          <Link
            href="/admin/dashboard/jobs"
            className={`admin-sidebar-link ${isActive('/admin/dashboard/jobs') ? 'active' : ''}`}
          >
            <Icons.Launch />
            <span>Job Listings</span>
          </Link>
  
          
          {/* Add more nav links here later */}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <h1 className="admin-header-title">Dashboard</h1>
          </div>
          <div className="admin-header-right">
            <button
              type="button"
              className="admin-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="admin-main-content">{children}</main>
      </div>
    </div>
  );
}

