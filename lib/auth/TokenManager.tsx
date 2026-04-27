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
        // Debug: log token tersimpan
        console.log('✅ [TokenManager] Saving token to localStorage');
        localStorage.setItem('token', token);
        
        // Verify
        const saved = localStorage.getItem('token');
        if (saved === token) {
          console.log('✅ [TokenManager] Token verified: OK');
        } else {
          console.error('❌ [TokenManager] Token verification failed');
        }
      } else if (status === 'unauthenticated') {
        // Token tidak ada atau user logged out, clear localStorage
        console.log('🗑️ [TokenManager] Clearing token from localStorage (unauthenticated)');
        localStorage.removeItem('token');
      } else if (status === 'authenticated' && !token) {
        console.warn('⚠️ [TokenManager] Authenticated but no token in session yet');
      }
    } catch (error) {
      console.error('❌ [TokenManager] Error managing token:', error);
    }
  }, [status, session?.user?.accessToken]);

  // Component tidak render apa-apa
  return null;
}