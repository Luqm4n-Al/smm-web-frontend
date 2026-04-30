// Middleware bawaan NextAuth untuk proteksi route
import withAuth from "next-auth/middleware";

/**
 * Middleware untuk melindungi halaman tertentu
 * 
 * Fungsi utama:
 * - Mengecek apakah user sudah login (punya token)
 * - Jika belum login → redirect ke halaman login
 */
export default withAuth({

  callbacks: {
    /**
     * Callback authorized
     * 
     * Dipanggil setiap ada request ke route yang dilindungi
     * 
     * Return:
     * - true  → akses diizinkan
     * - false → akses ditolak (akan redirect ke signIn page)
     */
    authorized({ token }) {
      // Jika token ada → user dianggap sudah login
      return !!token;
    }
  },

  /**
   * Custom halaman login
   * 
   * Jika user tidak authorized,
   * akan diarahkan ke halaman ini
   */
  pages: {
    signIn: "/login"
  }
});

/**
 * Konfigurasi route yang dilindungi middleware
 * 
 * Artinya:
 * Semua route yang diawali dengan /dashboard
 * akan dicek auth-nya
 * 
 * Contoh:
 * - /dashboard
 * - /dashboard/profile
 * - /dashboard/settings
 */
export const config = {
  matcher: ['/dashboard/:path*'],
};