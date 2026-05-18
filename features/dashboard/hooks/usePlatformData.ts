// features/dashboard/hooks/usePlatformData.ts

// Import GraphQL query hook untuk mengambil data analytics
import { useGetAnalyticsQuery } from '../graphql/analytics.query';

/**
 * usePlatformData
 * 
 * Custom hook untuk mengambil dan memfilter
 * data analytics berdasarkan platform.
 * 
 * Platform yang didukung:
 * - all
 * - instagram
 * - tiktok
 * 
 * Fungsi utama:
 * - Menyederhanakan pengambilan data analytics.
 * - Menyediakan data yang sudah difilter.
 * - Menyediakan fallback/default value aman.
 * - Menghindari null/undefined error pada UI.
 * 
 * @param platform - Platform yang ingin ditampilkan.
 */
export const usePlatformData = (
  platform: 'all' | 'instagram' | 'tiktok'
) => {

  /**
   * FETCH ANALYTICS DATA
   * 
   * Mengambil data analytics dari GraphQL query.
   */
  const {
    data,
    loading,
    error,
    refetch,
  } = useGetAnalyticsQuery();

  /**
   * Shortcut data analytics utama.
   */
  const analytics = data?.analytics;

  /**
   * DEFAULT SAFE VALUES
   * 
   * Default value digunakan untuk:
   * - mencegah undefined/null error
   * - menjaga UI tetap stabil
   * - menghindari crash saat data belum tersedia
   */

  /**
   * Default sentiment kosong.
   */
  const emptySentiment = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  /**
   * Default statistik kosong.
   */
  const emptyStats = {

    followers: 0,

    totalViews: 0,

    totalLikes: 0,

    sentiments: emptySentiment,
  };

  /**
   * HANDLE DATA BELUM TERSEDIA
   * 
   * Jika analytics belum ada:
   * - return stats null
   * - tetap kirim loading/error/refetch
   */
  if (!analytics) {

    return {
      stats: null,
      loading,
      error,
      refetch,
    };
  }

  /**
   * AMBIL DATA PLATFORM
   * 
   * Jika platform tidak tersedia:
   * gunakan emptyStats sebagai fallback.
   */

  const instagram =
    analytics.socialMedia?.instagram || emptyStats;

  const tiktok =
    analytics.socialMedia?.tiktok || emptyStats;

  /**
   * SAFE OBJECT NORMALIZATION
   * 
   * Memastikan sentiments selalu tersedia.
   * 
   * Hal ini penting karena:
   * - sentiments bisa undefined dari API
   * - UI membutuhkan object valid
   */

  const safeInstagram = {
    ...instagram,

    sentiments:
      instagram.sentiments || emptySentiment,
  };

  const safeTiktok = {
    ...tiktok,

    sentiments:
      tiktok.sentiments || emptySentiment,
  };

  /**
   * FILTER INSTAGRAM
   * 
   * Return data khusus Instagram.
   */
  if (platform === 'instagram') {
    return {
      stats: safeInstagram,
      loading,
      error,
      refetch,
    };
  }

  /**
   * FILTER TIKTOK
   * 
   * Return data khusus TikTok.
   */
  if (platform === 'tiktok') {
    return {
      stats: safeTiktok,
      loading,
      error,
      refetch,
    };
  }

  /**
   * AGGREGATE ALL PLATFORM
   * 
   * Menggabungkan seluruh statistik
   * dari Instagram dan TikTok.
   * 
   * Data yang digabung:
   * - followers
   * - total views
   * - total likes
   * - sentiments
   */
  return {
    stats: {
      /**
       * Total followers seluruh platform.
       */
      followers:
        safeInstagram.followers +
        safeTiktok.followers,
      /**
       * Total views seluruh platform.
       */
      totalViews:
        safeInstagram.totalViews +
        safeTiktok.totalViews,
      /**
       * Total likes seluruh platform.
       */
      totalLikes:
        safeInstagram.totalLikes +
        safeTiktok.totalLikes,
      /**
       * Total sentiment seluruh platform.
       */
      sentiments: {
        positive:
          safeInstagram.sentiments.positive +
          safeTiktok.sentiments.positive,
        neutral:
          safeInstagram.sentiments.neutral +
          safeTiktok.sentiments.neutral,
        negative:
          safeInstagram.sentiments.negative +
          safeTiktok.sentiments.negative,
      },
    },
    loading,
    error,
    refetch,
  };
};