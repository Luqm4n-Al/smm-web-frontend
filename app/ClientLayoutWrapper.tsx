//app/ClientLayoutWrapper.tsx

'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Utility untuk cleanup Apollo (WebSocket & cache)
import { closeApolloWebSocket, resetApolloCache } from '@/lib/graphql/apollo-client';

/**
 * Wrapper component di sisi client
 * 
 * Fungsi utama:
 * Membersihkan resource saat logout
 * Menutup koneksi WebSocket
 * Reset cache Apollo
 * Menghapus token dari localStorage
 * Cleanup saat user meninggalkan halaman
 */
export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {

  // Ambil status authentication (authenticated / unauthenticated / loading)
  const { status } = useSession();

  /**
   * Cleanup saat user logout
   * 
   * Trigger:
   * - status berubah menjadi 'unauthenticated'
   */
  useEffect(() => {
    if (status === 'unauthenticated') {

      // Tutup koneksi WebSocket agar tidak tetap aktif
      closeApolloWebSocket();

      // Hapus semua cache Apollo
      resetApolloCache();

      // Hapus token dari localStorage
      localStorage.removeItem('token');
    }
  }, [status]);

  /**
   * Cleanup saat user meninggalkan halaman (refresh / close tab)
   */
  useEffect(() => {

    const handleBeforeUnload = () => {
      // Pastikan koneksi WebSocket ditutup
      closeApolloWebSocket();
    };

    // Tambahkan event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Hapus event listener saat component unmount
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Cleanup tambahan untuk memastikan koneksi tertutup
      closeApolloWebSocket();
    };

  }, []);

  // Render children seperti biasa (wrapper saja)
  return <>{children}</>;
}