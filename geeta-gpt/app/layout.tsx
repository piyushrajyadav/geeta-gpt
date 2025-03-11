'use client';

import { useEffect, useState } from "react";
import { Geist, Geist_Mono, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

// Add Noto Sans Devanagari font properly
const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "700"],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode based on system preference
  useEffect(() => {
    // Check for system preference
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const isDarkMode = darkModeMediaQuery.matches;
    setDarkMode(isDarkMode);
    
    // Apply dark mode class if needed
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Set up event listener for theme changes
    window.addEventListener('theme-change', ((e: CustomEvent) => {
      setDarkMode(e.detail.darkMode);
      if (e.detail.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }) as EventListener);

    // Remove any browser extension attributes on mount
    const body = document.querySelector('body');
    if (body) {
      const attrs = [...body.attributes];
      attrs.forEach(attr => {
        if (attr.name.startsWith('data-') || attr.name === 'vsc-initialized') {
          body.removeAttribute(attr.name);
        }
      });
    }

    // Add divine background elements
    const createDivineElement = (className: string) => {
      const element = document.createElement('div');
      element.className = className;
      document.body.appendChild(element);
      return element;
    };

    // Create floating elements
    const floatingElements: HTMLDivElement[] = [];
    for (let i = 0; i < 5; i++) {
      floatingElements.push(createDivineElement('divine-particle'));
    }

    // Add Om symbol
    const omSymbol = createDivineElement('om-symbol');

    return () => {
      // Clean up
      window.removeEventListener('theme-change', ((e: CustomEvent) => {
        setDarkMode(e.detail.darkMode);
      }) as EventListener);
      
      // Remove divine elements
      floatingElements.forEach(el => el.remove());
      omSymbol.remove();
    };
  }, []);

  return (
    <html lang="en" className={`${darkMode ? 'dark' : ''} ${notoSansDevanagari.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/peacock-feather.png" type="image/png" />
        <meta name="theme-color" content={darkMode ? '#1a0f00' : '#fff8e6'} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <div className="divine-background"></div>
        {children}
      </body>
    </html>
  );
}
