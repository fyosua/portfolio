'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { HiOutlineHome, HiOutlineBriefcase, HiOutlineSparkles, HiOutlineLogout } from 'react-icons/hi';
import Link from 'next/link';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  // State for profile info
  const [profile, setProfile] = useState<{ name?: string; title?: string } | null>(null);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('authToken');
    if (!token && pathname !== '/admin') {
      router.push('/admin');
    }
    // Fetch profile data
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profiles`)
      .then(res => res.json())
      .then(data => {
        const user = data['hydra:member']?.[0];
        setProfile({ name: user?.name, title: user?.title });
      })
      .catch(() => setProfile(null));
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/admin');
  };

  const handleNavClick = (href: string) => {
    router.push(href);
  };

  if (pathname === '/admin') {
    return <>{children}</>;
  }
  if (!isClient) return null;

  const navItems = [
    { href: '/admin/dashboard', icon: <HiOutlineHome />, label: 'Dashboard' },
    { href: '/admin/experience', icon: <HiOutlineBriefcase />, label: 'Experience' },
    { href: '/admin/skills', icon: <HiOutlineSparkles />, label: 'Skills' },
  ];

  return (
    <div className="min-h-screen flex bg-muted/40">
      <aside className="w-64 bg-background border-r border-muted hidden md:flex flex-col">
        <div className="p-4 border-b border-muted">
          <Link href="/admin/dashboard" className="text-xl font-bold text-primary">Portfolio Admin</Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left ${
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-muted">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-muted-foreground hover:bg-muted hover:text-foreground">
            <HiOutlineLogout className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-background border-b border-muted p-4 flex justify-between items-center md:justify-end">
          <div className="md:hidden text-xl font-bold text-primary">Admin</div>
          <div className="text-foreground flex flex-col items-end">
            <span className="font-semibold">{profile?.name || '...'}</span>
            <span className="text-xs text-muted-foreground">{profile?.title || ''}</span>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;