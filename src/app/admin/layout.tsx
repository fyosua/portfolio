'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { HiOutlineHome, HiOutlineBriefcase, HiOutlineSparkles, HiOutlineLogout, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import Link from 'next/link';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileProfile, setShowMobileProfile] = useState(false);

  // State for profile info
  const [profile, setProfile] = useState<{ name?: string; title?: string } | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Auth check
    const token = localStorage.getItem('authToken');
    if (!token && pathname !== '/admin') {
      router.replace('/admin');
    } else {
      setCheckedAuth(true);
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
    setIsMobileMenuOpen(false);
    router.push('/admin');
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    router.push(href);
  };

  // Always allow /admin login page
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  // Wait for auth check before rendering protected pages
  if (!isClient || !checkedAuth) return null;

  const navItems = [
    { href: '/admin/dashboard', icon: <HiOutlineHome />, label: 'Dashboard' },
    { href: '/admin/experience', icon: <HiOutlineBriefcase />, label: 'Experience' },
    { href: '/admin/skills', icon: <HiOutlineSparkles />, label: 'Skills' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-gray-800 hidden md:flex flex-col rounded-r-3xl">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-white font-semibold text-lg">Portfolio</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all w-full text-left ${
                pathname === item.href
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-gray-400 hover:bg-gray-700 hover:text-white transition-all"
          >
            <HiOutlineLogout className="text-xl" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="fixed left-0 top-0 h-screen w-full bg-gray-800 flex flex-col max-h-screen overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-white font-semibold text-lg">Portfolio</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                <HiOutlineX className="text-2xl" />
              </button>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
              {navItems.map(item => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all w-full text-left ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-medium text-lg">{item.label}</span>
                </button>
              ))}
            </nav>
            
            <div className="p-4 border-t border-gray-700">
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-4 px-4 py-4 rounded-2xl w-full text-gray-400 hover:bg-gray-700 hover:text-white transition-all"
              >
                <HiOutlineLogout className="text-2xl" />
                <span className="font-medium text-lg">Log out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 md:bg-transparent p-4 md:p-6 flex justify-between items-center md:justify-end relative">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg"
          >
            <HiOutlineMenu className="text-2xl" />
          </button>
          
          {/* Mobile Title */}
          <div className="md:hidden text-white font-semibold text-lg">Admin</div>
          
          {/* Profile Info */}
          <div className="flex items-center gap-3 relative">
            <div className="text-right hidden md:block">
              <div className="text-white font-medium">{profile?.name || '...'}</div>
              <div className="text-gray-400 text-sm">{profile?.title || ''}</div>
            </div>
            <button 
              onClick={() => setShowMobileProfile(!showMobileProfile)}
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center focus:ring-2 focus:ring-blue-400"
            >
              <span className="text-white font-semibold text-sm">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </button>
            
            {/* Mobile Profile Dropdown */}
            {showMobileProfile && (
              <div className="absolute top-12 right-0 bg-gray-800 rounded-lg shadow-lg p-4 min-w-48 md:hidden z-10 border border-gray-700">
                <div className="text-white font-medium">{profile?.name || '...'}</div>
                <div className="text-gray-400 text-sm">{profile?.title || ''}</div>
              </div>
            )}
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;