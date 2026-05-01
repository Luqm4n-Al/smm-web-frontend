'use client'

import Link from "next/link"

import { usePathname } from "next/navigation"

// Icon yang digunakan di sidebar
import { HiThumbUp } from "react-icons/hi"
import {
  FiGrid,
  FiBarChart2,
  FiCalendar,
  FiCompass,
} from 'react-icons/fi'

/**
 * Daftar menu sidebar
 * 
 * Setiap item memiliki:
 * - label → nama menu
 * - href  → tujuan route
 * - icon  → icon yang ditampilkan
 */
const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: FiGrid },
  { label: 'Analytic', href: '/dashboard/analytics', icon: FiBarChart2 },
  { label: 'Schedule', href: '/dashboard/schedule', icon: FiCalendar },
  { label: 'Insight', href: '/dashboard/insight', icon: FiCompass },
  { label: 'Recommendation', href: '/dashboard/recommendation', icon: HiThumbUp },
];

/**
 * Component Sidebar Navigation
 * 
 * Fungsi:
 * - Menampilkan daftar menu sidebar
 * - Menandai menu yang sedang aktif berdasarkan URL
 */
export function SidebarNav() {

  // Ambil path URL saat ini
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto p-4">
      <ul className="space-y-1">

        {/* Loop semua item menu */}
        {navItems.map((item) => {

          /**
           * Cek apakah menu sedang aktif
           * 
           * Aktif jika:
           * - URL sama persis
           * - atau merupakan child route (misal: /dashboard/analytics)
           */
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + '/');

          // Ambil icon component dari item
          const IconComponent = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}

                // Styling berbeda jika menu aktif
                className={`
                  flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {/* Icon */}
                <IconComponent className="h-5 w-5" />

                {/* Label menu */}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}