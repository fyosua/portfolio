// src/components/ScrollToTopButton.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react'; // Ensure lucide-react is installed

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const toggleVisibility = (): void => {
      // Check if window is defined to prevent SSR errors
      if (typeof window !== 'undefined' && window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add event listener only if window is defined (client-side)
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', toggleVisibility);
    }

    return () => {
      // Clean up event listener only if window is defined
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', toggleVisibility);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-4 right-4 p-3 bg-primary text-primary-foreground rounded-full shadow-lg
        transition-opacity duration-300 ease-in-out z-50
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        hover:bg-primary/90
      `}
      aria-label="Scroll to top"
    >
      <ChevronUp size={24} />
    </button>
  );
};

export default ScrollToTopButton;