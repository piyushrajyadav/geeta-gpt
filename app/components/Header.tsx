'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Only run on client side
  useEffect(() => {
    setMounted(true);
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const initialDarkMode = darkModeMediaQuery.matches;
    setIsDarkMode(initialDarkMode);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      document.documentElement.classList.toggle('dark', e.matches);
    };
    
    darkModeMediaQuery.addEventListener('change', handleChange);
    
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('theme-change', { 
      detail: { darkMode: newDarkMode } 
    }));
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="w-full py-4 px-6 flex justify-between items-center border-b border-accent/30">
        <div className="flex items-center gap-3">
          <Image 
            src="/krishna.png" 
            alt="Lord Krishna" 
            width={50} 
            height={50} 
            className="divine-glow rounded-full"
          />
          <h1 className="text-2xl font-bold text-divine-blue">
            <span className="text-divine-saffron">Geeta</span> GPT
          </h1>
        </div>
        <div className="w-10 h-10" /> {/* Placeholder for theme toggle button */}
      </header>
    );
  }

  return (
    <header className="w-full py-4 px-6 flex justify-between items-center border-b border-accent/30 backdrop-blur-sm bg-background/80 z-10">
      <div className="flex items-center gap-3">
        <Image 
          src="/krishna.png" 
          alt="Lord Krishna" 
          width={50} 
          height={50} 
          className="divine-glow rounded-full"
        />
        <h1 className="text-2xl font-bold text-divine-blue">
          <span className="text-divine-saffron">Geeta</span> GPT
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center text-sm text-accent">
          <span>॥ श्रीमद्भगवद्गीता ॥</span>
        </div>
        
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          suppressHydrationWarning
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
} 