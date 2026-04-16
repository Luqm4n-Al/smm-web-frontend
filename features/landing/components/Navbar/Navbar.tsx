'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { NavbarDropdown } from './NavbarDropdown';

export function Navbar() {
  //State buka/tutup dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  //
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollToFeature = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    const element = document.getElementById(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featureItems = [
    { label: 'Analytics Suite', href: 'analytic-feature' },
    { label: 'Visual Scheduler', href: 'schedule-feature' },
    { label: 'Content Library', href: 'content-library-feature' },
    { label: 'Unified Inbox', href: 'inbox-feature' },
  ]

  //return untuk UI component
  return (
    //Header
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      {/* Navbar section */}
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Icon Aplikasi / Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-2xl">🚀</span>
          <span className='text-blue-600'>Social Vista</span>
        </Link>

        {/* Menu Tengah */}
        <div className="hidden items-center gap-6 md:flex">
          {/* Dropdown Feature */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
            >
              Feature
              <svg
                className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <NavbarDropdown 
              isOpen= {isDropdownOpen}
              items = {featureItems}
              onItemClick={handleScrollToFeature}
            />
          </div>

          <Link href="/about" className="text-gray-700 hover:text-blue-600">
            About
          </Link>
        </div>

        {/* Tombol Kanan */}
        <div className="flex items-center gap-3">
          <Link
            href="/daftar"
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Daftar
          </Link>
          <Link
            href="/signin"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Sign in
          </Link>
        </div>
      </nav>
    </header>
  );
}