import { useGetAnalyticsQuery } from '../graphql/analytics.query';

export const usePlatformData = (platform: 'all' | 'instagram' | 'tiktok') => {
  const { data, loading, error } = useGetAnalyticsQuery();

  const analytics = data?.analytics;
  if (!analytics) return { stats: null, loading, error };

  const instagram = analytics.socialMedia.instagram;
  const tiktok = analytics.socialMedia.tiktok;

  if (platform === 'instagram') {
    return {
      stats: {
        followers: instagram.followers,
        totalViews: instagram.totalViews,
        totalLikes: instagram.totalLikes,
        sentiments: instagram.sentiments,
      },
      loading,
      error,
    };
  }

  if (platform === 'tiktok') {
    return {
      stats: {
        followers: tiktok.followers,
        totalViews: tiktok.totalViews,
        totalLikes: tiktok.totalLikes,
        sentiments: tiktok.sentiments,
      },
      loading,
      error,
    };
  }

  // Semua (agregat)
  return {
    stats: {
      followers: instagram.followers + tiktok.followers,
      totalViews: instagram.totalViews + tiktok.totalViews,
      totalLikes: instagram.totalLikes + tiktok.totalLikes,
      sentiments: {
        positive: instagram.sentiments.positive + tiktok.sentiments.positive,
        neutral: instagram.sentiments.neutral + tiktok.sentiments.neutral,
        negative: instagram.sentiments.negative + tiktok.sentiments.negative,
      },
    },
    loading,
    error,
  };
};