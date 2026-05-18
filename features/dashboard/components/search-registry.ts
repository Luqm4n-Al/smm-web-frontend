/**
 * Interface SearchItem
 * 
 * Digunakan sebagai blueprint/type data
 * untuk setiap item pencarian global pada dashboard.
 * 
 * Struktur ini membantu TypeScript memastikan
 * semua data section memiliki format yang konsisten.
 */
export interface SearchItem {

  /**
   * Nama section atau fitur yang akan ditampilkan
   * pada hasil pencarian.
   * 
   * Contoh:
   * - Statistics
   * - Sentiment Analysis
   * - Calendar
   */
  title: string;

  /**
   * Nama halaman utama tempat section berada.
   * 
   * Digunakan untuk memberikan informasi
   * kategori halaman kepada user.
   * 
   * Contoh:
   * - Dashboard
   * - Analytics
   * - Recommendation
   */
  page: string;

  /**
   * Route/url tujuan ketika item dipilih.
   * 
   * Route ini digunakan untuk navigasi
   * menuju halaman terkait.
   * 
   * Contoh:
   * - /dashboard
   * - /dashboard/analytics
   */
  route: string;

  /**
   * Optional icon untuk kebutuhan visual UI.
   * 
   * Tidak wajib diisi karena beberapa item
   * mungkin tidak membutuhkan icon.
   */
  icon?: string;
}

/**
 * GLOBAL_SECTIONS
 * 
 * Registry/static data yang menyimpan seluruh
 * daftar section yang dapat dicari pada dashboard.
 * 
 * Fungsi utama:
 * - Menjadi sumber data global untuk fitur search.
 * - Mempermudah navigasi antar section dashboard.
 * - Digunakan untuk filtering/search suggestion.
 * - Menyediakan mapping antara:
 *   title -> halaman -> route
 * 
 * Data ini bersifat statis karena seluruh section
 * sudah ditentukan sejak awal aplikasi berjalan.
 */
export const GLOBAL_SECTIONS: SearchItem[] = [

  // DASHBOARD PAGE

  /**
   * Section statistik utama dashboard.
   */
  {
    title: 'Statistics',
    page: 'Dashboard',
    route: '/dashboard',
  },

  /**
   * Section grafik pertumbuhan akun/data.
   */
  {
    title: 'Growth Chart',
    page: 'Dashboard',
    route: '/dashboard',
  },

  // ANALYTICS PAGE

  /**
   * Section analisis sentimen audience/content.
   */
  {
    title: 'Sentiment Analysis',
    page: 'Analytics',
    route: '/dashboard/analytics',
  },

  /**
   * Section distribusi umur audience.
   */
  {
    title: 'Audience Age',
    page: 'Analytics',
    route: '/dashboard/analytics',
  },

  /**
   * Section distribusi gender audience.
   */
  {
    title: 'Gender',
    page: 'Analytics',
    route: '/dashboard/analytics',
  },

  /**
   * Section lokasi audience berdasarkan wilayah.
   */
  {
    title: 'Audience Location',
    page: 'Analytics',
    route: '/dashboard/analytics',
  },

  // INSIGHT PAGE

  /**
   * Section daftar content/postingan.
   */
  {
    title: 'Content Posts',
    page: 'Insight',
    route: '/dashboard/insight',
  },

  /**
   * Section keyword blacklist/filtering.
   */
  {
    title: 'Blacklist Keywords',
    page: 'Insight',
    route: '/dashboard/insight',
  },

  // SCHEDULE PAGE

  /**
   * Section kalender penjadwalan konten.
   */
  {
    title: 'Calendar',
    page: 'Schedule',
    route: '/dashboard/schedule',
  },

  /**
   * Section daftar planning konten.
   */
  {
    title: 'Planning List',
    page: 'Schedule',
    route: '/dashboard/schedule',
  },

  // RECOMMENDATION PAGE

  /**
   * Section ranking performa konten.
   */
  {
    title: 'Content Ranking',
    page: 'Recommendation',
    route: '/dashboard/recommendation',
  },

  /**
   * Section rekomendasi waktu terbaik posting.
   */
  {
    title: 'Best Time to Post',
    page: 'Recommendation',
    route: '/dashboard/recommendation',
  },

  /**
   * Section rekomendasi hashtag otomatis.
   */
  {
    title: 'Hashtag Recommendation',
    page: 'Recommendation',
    route: '/dashboard/recommendation',
  },

  /**
   * Section rekomendasi pintar berbasis AI/data.
   */
  {
    title: 'Smart Recommendations',
    page: 'Recommendation',
    route: '/dashboard/recommendation',
  },
];