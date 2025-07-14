'use client';

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ThemeSwitch } from './ThemeSwitch'
import { HiMenu, HiX } from 'react-icons/hi';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = ['About', 'Experience', 'Skills', 'Contact'];

  return (
    <header className="fixed w-full bg-background/80 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Name */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <Image 
            src="/images/logo.png" 
            alt="Yosua Ferdian Logo"
            width={40}
            height={40}
            className="rounded-full object-cover h-10 w-10 border-2 border-primary"
          />
          <span className="text-xl font-bold text-foreground">
            Yosua Ferdian
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            {navLinks.map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Desktop Theme Switch (hidden on mobile) */}
          <div className="hidden md:block">
            <ThemeSwitch />
          </div>

          {/* Mobile Menu Button (hamburger icon) */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-foreground">
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-muted py-4">
          <nav className="flex flex-col items-center gap-4">
            {navLinks.map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setMenuOpen(false)} // Close menu on link click
              >
                {item}
              </Link>
            ))}
            {/* Theme Switch inside the mobile menu */}
            <div className="flex items-center justify-between w-full px-8 pt-4 mt-4 border-t border-background">
              <span className="font-medium text-foreground">Switch Theme</span>
              <ThemeSwitch />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}