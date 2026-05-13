'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

/**
 * Component untuk sync NextAuth session token ke localStorage
 * Diperlukan agar Apollo Client bisa access token melalui localStorage
 * 
 * Flow:
 * 1. NextAuth store token di session
 * 2. TokenManager read token dari session
 * 3. TokenManager simpan ke localStorage
 * 4. Apollo Client authLink read dari localStorage
 */
export function TokenManager() {
  const { data: session, status } = useSession();

  /**
   * Effect untuk sync token dari session ke localStorage
   * Trigger saat status atau token berubah
   */
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const token = session?.user?.accessToken;
      
      if (status === 'authenticated' && token) {
        localStorage.setItem('token', token);
      } else if (status === 'unauthenticated') {
        localStorage.removeItem('token');
      }
    } catch (error) {
      // Silent fail — localStorage mungkin tidak tersedia
    }
  }, [status, session?.user?.accessToken]);

  // Component tidak render apa-apa
  return null;
}