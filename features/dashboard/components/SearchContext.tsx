'use client';

// Import React utilities dan hooks
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';

/**
 * Interface untuk struktur data SearchContext.
 * 
 * Interface ini mendefinisikan:
 * - state
 * - function
 * - helper
 * yang tersedia di dalam context search.
 */
interface SearchContextType {

  /**
   * Keyword pencarian aktif.
   */
  query: string;

  /**
   * Function untuk mengubah query pencarian.
   */
  setQuery: (query: string) => void;

  /**
   * Flag untuk mempertahankan query
   * saat berpindah halaman.
   * 
   * Digunakan agar search tidak otomatis reset
   * ketika melakukan navigasi tertentu.
   */
  preserveNextQuery: () => void;

  /**
   * Seluruh daftar section yang terdaftar
   * pada halaman aktif.
   */
  sections: string[];

  /**
   * Menambahkan section ke registry search.
   */
  registerSection: (title: string) => void;

  /**
   * Menghapus section dari registry search.
   */
  unregisterSection: (title: string) => void;
}

/**
 * Membuat SearchContext global.
 * 
 * Default value digunakan sebagai fallback
 * sebelum provider dijalankan.
 */
const SearchContext = createContext<SearchContextType>({
  query: '',

  // Placeholder function default
  setQuery: () => {},

  // Placeholder function default
  preserveNextQuery: () => {},

  // Default array kosong
  sections: [],

  // Placeholder function default
  registerSection: () => {},

  // Placeholder function default
  unregisterSection: () => {},
});

/**
 * SearchProvider
 * 
 * Component provider utama untuk sistem search global.
 * 
 * Fungsi utama:
 * - Menyimpan query pencarian.
 * - Menyimpan daftar section aktif.
 * - Menyediakan helper untuk registrasi section.
 * - Mengelola state search antar halaman.
 * 
 * Semua component yang dibungkus provider ini
 * dapat mengakses data search melalui useSearch().
 */
export function SearchProvider({
  children,
}: {
  children: ReactNode;
}) {

  /**
   * State keyword pencarian aktif.
   */
  const [query, setQuery] = useState('');

  /**
   * State daftar section yang tersedia
   * pada halaman aktif.
   */
  const [sections, setSections] = useState<string[]>([]);

  /**
   * Ref untuk menandai apakah query berikutnya
   * harus dipertahankan saat route berubah.
   * 
   * useRef digunakan karena:
   * - nilainya tidak memicu re-render.
   * - cocok untuk flag internal.
   */
  const skipNextClearRef = useRef(false);

  /**
   * preserveNextQuery
   * 
   * Mengaktifkan flag agar query berikutnya
   * tidak dihapus saat navigasi halaman.
   * 
   * useCallback digunakan agar reference function
   * tetap stabil dan tidak dibuat ulang setiap render.
   */
  const preserveNextQuery = useCallback(() => {
    skipNextClearRef.current = true;
  }, []);

  /**
   * handleSetQuery
   * 
   * Wrapper function untuk mengubah query search.
   * 
   * Dibuat terpisah agar:
   * - mudah dioptimasi
   * - reference function tetap stabil
   */
  const handleSetQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  /**
   * registerSection
   * 
   * Menambahkan section baru ke registry search.
   * 
   * Validasi dilakukan agar:
   * - tidak ada duplicate title.
   */
  const registerSection = useCallback((title: string) => {

    setSections(prev => {

      /**
       * Jika section sudah ada:
       * - gunakan data lama.
       * - hindari duplicate.
       */
      if (prev.includes(title)) return prev;

      /**
       * Tambahkan section baru ke array.
       */
      return [...prev, title];
    });

  }, []);

  /**
   * unregisterSection
   * 
   * Menghapus section dari registry search.
   * 
   * Biasanya dipanggil saat component unmount.
   */
  const unregisterSection = useCallback((title: string) => {

    /**
     * filter():
     * - Menghapus item yang sesuai title.
     */
    setSections(prev =>
      prev.filter(s => s !== title)
    );

  }, []);

  /**
   * contextValue
   * 
   * Object yang akan dibagikan ke seluruh
   * component melalui SearchContext.Provider.
   * 
   * _skipRef bersifat internal/helper tambahan
   * untuk mengontrol auto-clear query.
   */
  const contextValue:
    SearchContextType & {
      _skipRef: React.RefObject<boolean>;
    } = {

    query,

    // Setter query
    setQuery: handleSetQuery,

    // Function preserve query
    preserveNextQuery,

    // List section aktif
    sections,

    // Register section
    registerSection,

    // Unregister section
    unregisterSection,

    // Internal ref helper
    _skipRef: skipNextClearRef,
  };

  return (

    /**
     * Provider utama SearchContext.
     * 
     * Semua children di dalam provider ini
     * dapat mengakses state search global.
     */
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}

/**
 * useSearch
 * 
 * Custom hook untuk mempermudah akses
 * ke SearchContext.
 * 
 * Keuntungan custom hook:
 * - syntax lebih ringkas
 * - reusable
 * - logic tambahan bisa dipusatkan di sini
 */
export function useSearch() {

  /**
   * Mengambil data context search.
   */
  const ctx = useContext(SearchContext);

  /**
   * Mengambil internal ref helper.
   * 
   * Casting dilakukan karena _skipRef
   * tidak termasuk dalam interface utama.
   */
  const skipRef =
    (ctx as unknown as Record<string, unknown>)
      ._skipRef as React.MutableRefObject<boolean> | undefined;

  /**
   * shouldSkipClear
   * 
   * Mengecek apakah query search
   * perlu dipertahankan saat route berubah.
   * 
   * Cara kerja:
   * - Jika flag true:
   *   → reset kembali ke false
   *   → return true
   * 
   * - Jika flag false:
   *   → return false
   */
  const shouldSkipClear = useCallback(() => {

    if (skipRef?.current) {

      /**
       * Reset flag setelah digunakan
       * agar hanya berlaku sekali.
       */
      skipRef.current = false;

      return true;
    }

    return false;

  }, [skipRef]);

  /**
   * Return seluruh context beserta helper tambahan.
   */
  return {
    ...ctx,
    shouldSkipClear,
  };
}