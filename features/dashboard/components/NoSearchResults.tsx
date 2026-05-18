'use client';

// Import custom hook untuk mengakses SearchContext
import { useSearch } from './SearchContext';

// Import icon search dari react-icons
import { FiSearch } from 'react-icons/fi';

/**
 * NoSearchResults
 * 
 * Component UI yang digunakan untuk menampilkan
 * indikator pencarian aktif pada halaman dashboard.
 * 
 * Fungsi utama:
 * - Menampilkan keyword yang sedang dicari user.
 * - Memberikan feedback visual bahwa sistem
 *   sedang melakukan proses filtering/search.
 * - Menyediakan tombol untuk menghapus pencarian.
 * 
 * Component ini biasanya ditempatkan di bagian bawah
 * halaman atau list data.
 * 
 * Component hanya akan tampil jika:
 * - query pencarian memiliki isi.
 * 
 * Jika query kosong:
 * - component tidak akan dirender.
 */
export function NoSearchResults() {

  /**
   * Mengambil state query dan function setQuery
   * dari SearchContext.
   * 
   * query:
   * - Menyimpan keyword pencarian aktif.
   * 
   * setQuery:
   * - Digunakan untuk mengubah atau menghapus
   *   keyword pencarian.
   */
  const { query, setQuery } = useSearch();

  /**
   * Jika query kosong:
   * - Component tidak dirender.
   * - Mengembalikan null agar tidak ada elemen
   *   yang muncul di halaman.
   */
  if (!query) return null;

  return (
    /**
     * Container utama untuk tampilan informasi pencarian.
     * 
     * Menggunakan flex column agar isi tersusun vertikal
     * dan berada di tengah halaman.
     */
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">

      {/* Icon pencarian sebagai indikator visual */}
      <FiSearch className="h-8 w-8 mb-2" />

      {/* Menampilkan keyword pencarian aktif */}
      <p className="text-sm">
        Searching for{' '}
        <span className="font-medium text-gray-600">
          &quot;{query}&quot;
        </span>
      </p>

      {/**
       * Tombol untuk menghapus pencarian.
       * 
       * Saat tombol diklik:
       * - query akan direset menjadi string kosong.
       * - hasil filtering/search akan kembali normal.
       */}
      <button
        onClick={() => setQuery('')}
        className="mt-2 text-xs text-blue-600 hover:text-blue-800"
      >
        Clear search
      </button>
    </div>
  );
}