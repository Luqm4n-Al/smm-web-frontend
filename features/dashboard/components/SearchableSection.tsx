'use client';

// Import React type dan hook useEffect
import { type ReactNode, useEffect } from 'react';

// Import custom hook dari SearchContext
import { useSearch } from './SearchContext';

/**
 * Interface props untuk component SearchableSection
 */
interface SearchableSectionProps {

  /**
   * Judul section yang digunakan
   * untuk proses pencocokan pencarian.
   * 
   * Contoh:
   * - Statistics
   * - Calendar
   * - Sentiment Analysis
   */
  title: string;

  /**
   * Optional className tambahan.
   * 
   * Digunakan agar component tetap dapat menerima
   * class layout dari parent seperti:
   * - grid
   * - flex
   * - col-span
   * - width
   * - responsive layout
   * 
   * Contoh:
   * - lg:col-span-2
   * - flex-1
   */
  className?: string;

  /**
   * Isi component/section yang akan dirender.
   */
  children: ReactNode;
}

/**
 * SearchableSection
 * 
 * Wrapper component yang digunakan untuk
 * menampilkan atau menyembunyikan section
 * berdasarkan keyword pencarian.
 * 
 * Cara kerja:
 * 
 * 1. Jika query kosong:
 *    → section selalu tampil.
 * 
 * 2. Jika query cocok dengan title:
 *    → section tampil.
 * 
 * 3. Jika query tidak cocok:
 *    → section disembunyikan.
 * 
 * Component ini sangat berguna untuk:
 * - filtering dashboard section
 * - search UI
 * - dynamic dashboard visibility
 * 
 * @param title - Nama section untuk pencarian
 * @param className - Class CSS tambahan
 * @param children - Isi section
 */
export function SearchableSection({
  title,
  className = '',
  children,
}: SearchableSectionProps) {

  /**
   * Mengambil data dan function dari SearchContext.
   * 
   * query:
   * - keyword pencarian aktif.
   * 
   * registerSection:
   * - mendaftarkan section ke sistem search.
   * 
   * unregisterSection:
   * - menghapus section dari sistem search
   *   saat component di-unmount.
   */
  const {
    query,
    registerSection,
    unregisterSection,
  } = useSearch();

  /**
   * useEffect digunakan untuk:
   * 
   * 1. Mendaftarkan title section saat component muncul.
   * 2. Menghapus title section saat component dihancurkan.
   * 
   * Hal ini memungkinkan search dropdown/global search
   * mengetahui seluruh section yang tersedia.
   */
  useEffect(() => {

    // Menambahkan section ke registry search
    registerSection(title);

    /**
     * Cleanup function:
     * Dipanggil saat component unmount.
     * 
     * Berguna agar registry search tetap bersih
     * dan tidak menyimpan data section yang sudah hilang.
     */
    return () => unregisterSection(title);

  }, [title, registerSection, unregisterSection]);

  /**
   * Mengecek apakah section cocok dengan query pencarian.
   * 
   * Kondisi:
   * - Jika query kosong → otomatis cocok.
   * - Jika title mengandung query → cocok.
   * 
   * includes():
   * - Digunakan untuk pencarian sebagian kata.
   * 
   * toLowerCase():
   * - Agar pencarian tidak sensitif huruf besar/kecil.
   */
  const isMatch =
    query === '' ||
    title.toLowerCase().includes(query.toLowerCase());

  /**
   * Jika section tidak cocok dengan pencarian:
   * - component tidak dirender.
   * - mengembalikan null.
   */
  if (!isMatch) return null;

  return (

    /**
     * Wrapper utama section.
     * 
     * className diteruskan agar layout grid/flex
     * dari parent tetap berjalan dengan normal.
     */
    <div className={className}>
      {children}
    </div>
  );
}