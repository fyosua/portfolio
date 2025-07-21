'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineHome, HiOutlineBriefcase, HiOutlineSparkles, HiOutlineCog, HiOutlineLogout } from 'react-icons/hi';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('authToken');
    if (!token && pathname !== '/admin') {
      router.push('/admin');
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/admin');
  };

  if (pathname === '/admin') {
    return <>{children}</>; // Don't show layout on login page
  }

  if (!isClient) {
    return null; // Don't render on the server to avoid flash of content
  }

  const navItems = [
    { href: '/admin/dashboard', icon: <HiOutlineHome />, label: 'Dashboard' },
    { href: '/admin/experience', icon: <HiOutlineBriefcase />, label: 'Experience' },
    { href: '/admin/skills', icon: <HiOutlineSparkles />, label: 'Skills' },
  ];

  return (
    <div className="min-h-screen flex bg-muted/40">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-muted hidden md:flex flex-col">
        <div className="p-4 border-b border-muted">
          <h2 className="text-xl font-bold text-primary">Portfolio Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-muted">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-muted-foreground hover:bg-muted hover:text-foreground">
            <HiOutlineLogout className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-background border-b border-muted p-4 flex justify-between items-center md:justify-end">
          <div className="md:hidden text-xl font-bold text-primary">Admin</div>
          <div className="text-foreground">
            Robert Dorwart {/* Placeholder name from theme */}
          </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;