/**
 * Custom hook untuk fetch data analytics dari GraphQL backend
 * Digunakan untuk supply data ke berbagai component analytics seperti:
 * - SentimentSection
 * - AgePieChart
 * - GenderChart
 * - GeoMap
 * 
 * @returns {Object} Object berisi data analytics, loading state, dan error state
 */

import { useEffect } from 'react';
import { useGetAnalyticsQuery } from '../graphql/analytics.query';

/**
 * Hook untuk mendapatkan data sentiment (positif, netral, negatif)
 * Mengagregasi data dari Instagram dan TikTok
 * @returns {Object} Data sentiment dengan score, counts, loading, dan error state
 */
export const useSentimentData = () => {
  const { data, loading, error } = useGetAnalyticsQuery();

  /**
   * Log error jika ada masalah dengan query
   * Berguna untuk debugging API issues
   */
  useEffect(() => {
    if (error) {
      console.error('❌ [useSentimentData] Error fetching sentiment data:', error.message || error);
    }
  }, [error]);

  // Hitung total sentimen dari kedua platform
  const positive = 
    (data?.analytics?.socialMedia?.instagram?.sentiments?.positive || 0) +
    (data?.analytics?.socialMedia?.tiktok?.sentiments?.positive || 0);
  
  const neutral =
    (data?.analytics?.socialMedia?.instagram?.sentiments?.neutral || 0) +
    (data?.analytics?.socialMedia?.tiktok?.sentiments?.neutral || 0);
  
  const negative =
    (data?.analytics?.socialMedia?.instagram?.sentiments?.negative || 0) +
    (data?.analytics?.socialMedia?.tiktok?.sentiments?.negative || 0);

  // Hitung total untuk persentase
  const total = positive + neutral + negative;

  // Hitung score (-1 sampai 1)
  // Score positif jika positif comments > negative comments
  const score = total > 0 ? (positive - negative) / total : 0;

  if (loading) {
    console.log('🔄 [useSentimentData] Loading...');
  }

  return {
    score,
    positive,
    neutral,
    negative,
    total,
    loading,
    error,
  };
};

/**
 * Hook untuk mendapatkan data demographics audiens (usia)
 * Transform data dari API ke format chart
 * @returns {Object} Array data usia dengan color, loading, dan error state
 */
export const useAgeRangeData = () => {
  const { data, loading, error } = useGetAnalyticsQuery();

  /**
   * Log error jika ada masalah dengan query
   */
  useEffect(() => {
    if (error) {
      console.error('❌ [useAgeRangeData] Error fetching age range data:', error.message || error);
    }
  }, [error]);

  // Transform API data ke format yang bisa digunakan chart
  const ageData =
    data?.analytics?.ageRange?.map((item, index) => ({
      name: item.age,
      value: item.quantity,
      color: getColorByIndex(index),
    })) || [];

  if (loading) {
    console.log('🔄 [useAgeRangeData] Loading...');
  }

  return {
    data: ageData,
    loading,
    error,
  };
};

/**
 * Hook untuk mendapatkan data demographics audiens (gender)
 * Memmap gender values (M/Perempuan) ke bahasa yang readable
 * Group by gender dan hitung persentase
 * @returns {Object} Array data gender dengan color, loading, dan error state
 */
export const useGenderData = () => {
  const { data, loading, error } = useGetAnalyticsQuery();

  useEffect(() => {
    if (error) {
      console.error('❌ [useGenderData] Error fetching gender data:', error.message || error);
    }
  }, [error]);

  let genderData: Array<{
    name: string;
    quantity: number;
    value: number;
    color: string;
  }> = [];

  //Data Unknown
  let unknownCount = 0;

  if (data?.analytics?.genderAudience && data.analytics.genderAudience.length > 0) {
    const genderMap = new Map<string, number>();

    data.analytics.genderAudience.forEach((item) => {
      // Fix 1: mapping sesuai data backend yang sebenarnya
      const lower = item.gender.toLowerCase();

      if (lower === 'male') {
        const current = genderMap.get('Laki-laki') || 0;
        genderMap.set('Laki-laki', current + item.quantity);
      } else if (lower === 'female') {
        const current = genderMap.get('Perempuan') || 0;
        genderMap.set('Perempuan', current + item.quantity);
      } else if (lower === 'unknown') {
        unknownCount += item.quantity;
      }
      // Fix 2: 'UNKNOWN' di-skip, tidak dimasukkan ke chart
    });

    // Fix 3: total hanya dari known gender (exclude UNKNOWN)
    const total = Array.from(genderMap.values()).reduce((sum, val) => sum + val, 0);

    const colors = ['#3b82f6', '#ec4899'];
    let colorIndex = 0;

    genderData = Array.from(genderMap.entries()).map(([label, quantity]) => ({
      name: label,
      quantity,
      value: total > 0 ? Math.round((quantity / total) * 100) : 0,
      color: colors[colorIndex++ % colors.length],
    }));
  }

  if (loading) {
    console.log('🔄 [useGenderData] Loading...');
  }

  return { data: genderData, unknownCount, loading, error };
};

/**
 * Hook untuk mendapatkan data heatmap geografis
 * Data untuk menampilkan persebaran followers per negara/region
 * @returns {Object} Array heatmap data dengan level, code, value, loading, dan error state
 */
export const useGeoMapData = () => {
  const { data, loading, error } = useGetAnalyticsQuery();

  /**
   * Log error jika ada masalah dengan query
   */
  useEffect(() => {
    if (error) {
      console.error('❌ [useGeoMapData] Error fetching geo map data:', error.message || error);
    }
  }, [error]);

  //Tambahan sementara untuk debug
  useEffect(() => {
    if (data?.analytics?.heatmap) {
        console.log('🗺️ [useGeoMapData] Raw heatmap data:', data.analytics.heatmap)
    }
  }, [data])

  if (loading) {
    console.log('🔄 [useGeoMapData] Loading...');
  }

  return {
    data: data?.analytics?.heatmap || [],
    loading,
    error,
  };
};

/**
 * Fungsi helper untuk mendapatkan warna berdasarkan index
 * Digunakan untuk menghasilkan warna yang berbeda untuk setiap kategori
 * 
 * @param {number} index - Index dari kategori
 * @returns {string} Hex color code
 */
const getColorByIndex = (index: number): string => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  return colors[index % colors.length];
};
