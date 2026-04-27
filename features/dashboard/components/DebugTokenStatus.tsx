'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

/**
 * Component untuk debug token status
 * Digunakan untuk verifikasi apakah token tersimpan dan dikirim dengan benar
 * 
 * IMPORTANT: Remove component ini setelah testing selesai!
 */
export function DebugTokenStatus() {
  const { data: session, status } = useSession();
  const [localToken, setLocalToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | 'failed'>('syncing');

  /**
   * Effect untuk sync local state dengan localStorage
   * Run setiap 500ms untuk detect perubahan dari TokenManager
   */
  useEffect(() => {
    setMounted(true);
    
    // Initial check
    const checkToken = () => {
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem('token');
      setLocalToken(token);
      
      // Determine sync status
      if (status === 'authenticated') {
        if (token && session?.user?.accessToken) {
          // Verify token match
          if (token === session.user.accessToken) {
            setSyncStatus('synced');
          } else {
            setSyncStatus('failed');
            console.warn('⚠️ localStorage token tidak match dengan session token');
          }
        } else if (!token && session?.user?.accessToken) {
          setSyncStatus('syncing');
        }
      }
    };

    // Check immediately
    checkToken();
    
    // Poll setiap 500ms untuk detect TokenManager sync
    const interval = setInterval(checkToken, 500);
    
    return () => clearInterval(interval);
  }, [status, session?.user?.accessToken]);

  // Hanya tampil di development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!mounted) {
    return null;
  }

  const isTokenSynced = localToken && session?.user?.accessToken && localToken === session.user.accessToken;
  const sessionAccessToken = session?.user?.accessToken;

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-gray-900 text-white p-4 rounded-lg text-xs font-mono z-50 max-h-96 overflow-y-auto">
      <div className="space-y-2">
        <div className="font-bold text-yellow-400">🔍 Token Debug Status</div>
        
        {/* NextAuth Status */}
        <div>
          <div className="text-gray-400">NextAuth Status:</div>
          <div className={status === 'authenticated' ? 'text-green-400' : status === 'loading' ? 'text-yellow-400' : 'text-red-400'}>
            {status === 'loading' ? '⏳ Loading...' : status === 'authenticated' ? '✅ Authenticated' : '❌ Unauthenticated'}
          </div>
        </div>

        {/* Session Token */}
        <div>
          <div className="text-gray-400">Session Token:</div>
          <div className="break-all text-blue-400">
            {sessionAccessToken 
              ? `${sessionAccessToken.substring(0, 20)}...` 
              : '❌ NOT FOUND'}
          </div>
        </div>

        {/* localStorage Token */}
        <div>
          <div className="text-gray-400">localStorage Token:</div>
          <div className={`break-all ${localToken ? 'text-green-400' : 'text-red-400'}`}>
            {localToken 
              ? `${localToken.substring(0, 20)}...` 
              : '❌ NOT FOUND'}
          </div>
        </div>

        {/* Sync Status */}
        <div className="border-t border-gray-600 pt-2">
          <div className="text-gray-400">Sync Status:</div>
          <div className={syncStatus === 'synced' ? 'text-green-400' : syncStatus === 'syncing' ? 'text-yellow-400' : 'text-red-400'}>
            {syncStatus === 'synced' && '✅ SYNCED'}
            {syncStatus === 'syncing' && '⏳ SYNCING...'}
            {syncStatus === 'failed' && '❌ SYNC FAILED (tokens tidak match)'}
          </div>
        </div>

        {/* Authorization Header */}
        <div>
          <div className="text-gray-400">Auth Header:</div>
          <div className="break-all text-purple-400">
            {localToken 
              ? `Bearer ${localToken.substring(0, 20)}...` 
              : '❌ EMPTY'}
          </div>
        </div>

        {/* Diagnosis */}
        <div className="border-t border-gray-600 pt-2 mt-2">
          <div className="text-gray-400">📋 Diagnosis:</div>
          {status === 'authenticated' && isTokenSynced ? (
            <div className="text-green-400">✅ Siap untuk GraphQL</div>
          ) : status === 'authenticated' && !localToken ? (
            <div className="text-yellow-400">
              ⏳ Sync sedang berlangsung...
              <div className="text-xs text-gray-300 mt-1">TokenManager sedang save token ke localStorage</div>
              <div className="text-xs text-gray-300">Tunggu 2-3 detik atau check console logs</div>
            </div>
          ) : status === 'authenticated' && syncStatus === 'failed' ? (
            <div className="text-red-400">
              ❌ Token mismatch
              <div className="text-xs text-gray-300 mt-1">Session token ≠ localStorage token</div>
              <div className="text-xs text-gray-300">Coba refresh page atau login ulang</div>
            </div>
          ) : status === 'unauthenticated' ? (
            <div className="text-red-400">
              ❌ Belum login
              <div className="text-xs text-gray-300 mt-1">Perlu ke /login dulu</div>
            </div>
          ) : (
            <div className="text-yellow-400">⏳ Loading session...</div>
          )}
        </div>

        {/* Token Format */}
        {localToken && (
          <div className="border-t border-gray-600 pt-2 mt-2">
            <div className="text-gray-400">🔐 Token Format:</div>
            {localToken.includes('.') && localToken.split('.').length === 3 ? (
              <div className="text-green-400">✅ Valid JWT (3 parts)</div>
            ) : (
              <div className="text-red-400">❌ Invalid JWT format</div>
            )}
          </div>
        )}

        {/* Console Logs Notice */}
        <div className="border-t border-gray-600 pt-2 mt-2 text-xs text-gray-300">
          📝 Check browser Console (F12 → Console) untuk debug logs dari TokenManager & Apollo
        </div>
      </div>
    </div>
  );
}
