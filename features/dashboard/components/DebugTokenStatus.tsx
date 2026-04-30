'use client';

// Hook dari next-auth untuk mengambil data session user (login status & token)
import { useSession } from 'next-auth/react';

// React hooks untuk state, efek, dan optimasi function
import { useEffect, useState, useCallback } from 'react';

/**
 * 🧪 DebugTokenStatus Component
 * 
 * Component ini digunakan untuk:
 * 👉 Mengecek apakah token dari session (NextAuth) dan localStorage sinkron
 * 👉 Membantu debugging masalah authentication (khususnya GraphQL / API)
 * 👉 Menampilkan status token secara real-time di UI
 * 
 * ⚠️ HANYA UNTUK DEVELOPMENT!
 * Jangan digunakan di production karena ini hanya alat debugging
 */
export function DebugTokenStatus() {

  // Mengambil data session dan status login dari NextAuth
  const { data: session, status } = useSession();

  // State untuk menyimpan token dari localStorage
  const [localToken, setLocalToken] = useState<string | null>(null);

  // State untuk mengetahui apakah token sudah sinkron atau belum
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | 'failed'>('syncing');

  /**
   * Ambil accessToken dari session
   * Dipisah agar dependency di React lebih stabil (menghindari warning)
   */
  const sessionAccessToken = session?.user?.accessToken;

  /**
   * 🔁 Function untuk mengecek token
   * 
   * Fungsi ini:
   * - Ambil token dari localStorage
   * - Bandingkan dengan token dari session
   * - Tentukan status sinkronisasi
   * 
   * useCallback digunakan agar function ini tidak dibuat ulang terus menerus
   */
  const checkToken = useCallback(() => {

    // Pastikan hanya jalan di browser (bukan server)
    if (typeof window === 'undefined') return;
    
    // Ambil token dari localStorage
    const token = localStorage.getItem('token');

    // Simpan ke state
    setLocalToken(token);
    
    // Logic untuk menentukan apakah token sinkron atau tidak
    if (status === 'authenticated') {
      if (token && sessionAccessToken) {

        // Jika kedua token ada → bandingkan
        if (token === sessionAccessToken) {
          setSyncStatus('synced'); // ✅ Sama → sinkron
        } else {
          setSyncStatus('failed'); // ❌ Tidak sama → error
          console.warn('⚠️ localStorage token tidak match dengan session token');
        }

      } else if (!token && sessionAccessToken) {
        // Token session ada tapi localStorage belum → masih syncing
        setSyncStatus('syncing');
      }
    }

  }, [status, sessionAccessToken]);

  /**
   * ⏱️ useEffect untuk menjalankan pengecekan token setiap 1 detik
   * 
   * Kenapa pakai interval?
   * 👉 Karena token di localStorage bisa diset async (misalnya dari TokenManager)
   */
  useEffect(() => {

    const interval = setInterval(checkToken, 1000);

    // Cleanup untuk menghindari memory leak
    return () => clearInterval(interval);

  }, [checkToken]);

  /**
   * ❌ Jangan tampilkan component ini di production
   */
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  /**
   * Helper untuk cek apakah token benar-benar sinkron
   */
  const isTokenSynced = localToken && sessionAccessToken && localToken === sessionAccessToken;

  /**
   * 🎨 UI Debug Panel (pojok kanan bawah)
   */
  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-gray-900 text-white p-4 rounded-lg text-xs font-mono z-50 max-h-96 overflow-y-auto">
      <div className="space-y-2">

        {/* Title */}
        <div className="font-bold text-yellow-400">🔍 Token Debug Status</div>
        
        {/* Status login dari NextAuth */}
        <div>
          <div className="text-gray-400">NextAuth Status:</div>
          <div className={
            status === 'authenticated' 
              ? 'text-green-400' 
              : status === 'loading' 
              ? 'text-yellow-400' 
              : 'text-red-400'
          }>
            {status === 'loading' 
              ? '⏳ Loading...' 
              : status === 'authenticated' 
              ? '✅ Authenticated' 
              : '❌ Unauthenticated'}
          </div>
        </div>

        {/* Token dari session */}
        <div>
          <div className="text-gray-400">Session Token:</div>
          <div className="break-all text-blue-400">
            {sessionAccessToken 
              ? `${sessionAccessToken.substring(0, 20)}...` 
              : '❌ NOT FOUND'}
          </div>
        </div>

        {/* Token dari localStorage */}
        <div>
          <div className="text-gray-400">localStorage Token:</div>
          <div className={`break-all ${localToken ? 'text-green-400' : 'text-red-400'}`}>
            {localToken 
              ? `${localToken.substring(0, 20)}...` 
              : '❌ NOT FOUND'}
          </div>
        </div>

        {/* Status sinkronisasi token */}
        <div className="border-t border-gray-600 pt-2">
          <div className="text-gray-400">Sync Status:</div>
          <div className={
            syncStatus === 'synced' 
              ? 'text-green-400' 
              : syncStatus === 'syncing' 
              ? 'text-yellow-400' 
              : 'text-red-400'
          }>
            {syncStatus === 'synced' && '✅ SYNCED'}
            {syncStatus === 'syncing' && '⏳ SYNCING...'}
            {syncStatus === 'failed' && '❌ SYNC FAILED'}
          </div>
        </div>

        {/* Contoh Authorization Header */}
        <div>
          <div className="text-gray-400">Auth Header:</div>
          <div className="break-all text-purple-400">
            {localToken 
              ? `Bearer ${localToken.substring(0, 20)}...` 
              : '❌ EMPTY'}
          </div>
        </div>

        {/* Diagnosis kondisi saat ini */}
        <div className="border-t border-gray-600 pt-2 mt-2">
          <div className="text-gray-400">📋 Diagnosis:</div>

          {status === 'authenticated' && isTokenSynced ? (
            <div className="text-green-400">✅ Siap untuk GraphQL</div>

          ) : status === 'authenticated' && !localToken ? (
            <div className="text-yellow-400">
              ⏳ Token sedang disimpan ke localStorage...
            </div>

          ) : status === 'authenticated' && syncStatus === 'failed' ? (
            <div className="text-red-400">
              ❌ Token tidak cocok (mismatch)
            </div>

          ) : status === 'unauthenticated' ? (
            <div className="text-red-400">
              ❌ User belum login
            </div>

          ) : (
            <div className="text-yellow-400">⏳ Loading session...</div>
          )}
        </div>

        {/* Validasi format JWT */}
        {localToken && (
          <div className="border-t border-gray-600 pt-2 mt-2">
            <div className="text-gray-400">🔐 Token Format:</div>
            {localToken.includes('.') && localToken.split('.').length === 3 ? (
              <div className="text-green-400">✅ Valid JWT</div>
            ) : (
              <div className="text-red-400">❌ Invalid JWT</div>
            )}
          </div>
        )}

        {/* Info tambahan */}
        <div className="border-t border-gray-600 pt-2 mt-2 text-xs text-gray-300">
          📝 Cek Console (F12) untuk log tambahan
        </div>

      </div>
    </div>
  );
}