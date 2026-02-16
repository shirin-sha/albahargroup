'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

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

  const handleLogout = () => {
    // TODO: clear auth token/session when real auth is added
    router.push('/admin');
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
          <span className="admin-sidebar-logo">AG</span>
          <span className="admin-sidebar-title">Admin</span>
        </div>
        <nav className="admin-sidebar-nav">
          <a
            href="/admin/dashboard"
            className={`admin-sidebar-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </a>
          
          <div className={`admin-sidebar-group ${isCmsActive() ? 'active' : ''}`}>
            <button
              type="button"
              className={`admin-sidebar-group-toggle ${cmsOpen ? 'open' : ''}`}
              onClick={() => setCmsOpen(!cmsOpen)}
            >
              <span>CMS</span>
              <span className="admin-sidebar-arrow">{cmsOpen ? '▼' : '▶'}</span>
            </button>
            {cmsOpen && (
              <div className="admin-sidebar-submenu">
                <a
                  href="/admin/dashboard/cms/home"
                  className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/dashboard/cms/home') ? 'active' : ''}`}
                >
                  Home
                </a>
                <a
                  href="/admin/dashboard/cms/about"
                  className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/dashboard/cms/about') ? 'active' : ''}`}
                >
                  About
                </a>
                <a
                  href="/admin/dashboard/cms/news"
                  className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/dashboard/cms/news') ? 'active' : ''}`}
                >
                  News
                </a>
                <a
                  href="/admin/dashboard/cms/careers"
                  className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/dashboard/cms/careers') ? 'active' : ''}`}
                >
                  Careers
                </a>
                <a
                  href="/admin/dashboard/cms/partnerships"
                  className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/dashboard/cms/partnerships') ? 'active' : ''}`}
                >
                  Partnerships
                </a>
                <a
                  href="/admin/dashboard/cms/contact"
                  className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/dashboard/cms/contact') ? 'active' : ''}`}
                >
                  Contact Us
                </a>
                <a
                  href="/admin/dashboard/cms/header"
                  className={`admin-sidebar-link admin-sidebar-sublink ${isActive('/admin/dashboard/cms/header') ? 'active' : ''}`}
                >
                  Header
                </a>
              </div>
            )}
          </div>
          
          <a
            href="/admin/dashboard/posts"
            className={`admin-sidebar-link ${isActive('/admin/dashboard/posts') ? 'active' : ''}`}
          >
            Posts
          </a>
          
          <a
            href="/admin/dashboard/projects"
            className={`admin-sidebar-link ${isActive('/admin/dashboard/projects') ? 'active' : ''}`}
          >
            Projects
          </a>
          
          <a
            href="/admin/dashboard/teams"
            className={`admin-sidebar-link ${isActive('/admin/dashboard/teams') ? 'active' : ''}`}
          >
            Teams
          </a>
          
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

