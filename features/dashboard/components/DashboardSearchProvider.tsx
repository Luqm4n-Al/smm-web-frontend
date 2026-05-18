'use client';

// Import provider context untuk fitur pencarian dashboard
import { SearchProvider } from './SearchContext';

// Import type ReactNode untuk typing children component
import { type ReactNode } from 'react';

/**
 * DashboardSearchProvider
 * 
 * Component wrapper khusus client-side yang digunakan
 * untuk membungkus halaman dashboard dengan SearchContext.
 * 
 * Tujuan utama:
 * - Menyediakan state pencarian (search state)
 *   ke seluruh component dashboard.
 * - Memungkinkan data pencarian digunakan bersama
 *   antar component tanpa perlu prop drilling.
 * - Menjaga layout utama dashboard tetap sebagai
 *   Server Component agar performa Next.js tetap optimal.
 * 
 * Kenapa menggunakan 'use client'?
 * Karena Context API dan state management berjalan
 * di sisi client/browser.
 * 
 * @param children - Seluruh component/page yang akan
 * menerima akses ke SearchContext.
 */
export function DashboardSearchProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    /**
     * SearchProvider berfungsi sebagai penyedia global state
     * untuk fitur pencarian dashboard.
     * 
     * Semua component di dalam provider ini dapat mengakses:
     * - keyword pencarian
     * - update search state
     * - data filter pencarian
     */
    <SearchProvider>
      {children}
    </SearchProvider>
  );
}