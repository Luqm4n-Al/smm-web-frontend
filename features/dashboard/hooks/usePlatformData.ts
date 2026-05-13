// features/dashboard/hooks/usePlatformData.ts
import { useGetAnalyticsQuery } from '../graphql/analytics.query';

export const usePlatformData = (platform: 'all' | 'instagram' | 'tiktok') => {
  const { data, loading, error, refetch } = useGetAnalyticsQuery();
  const analytics = data?.analytics;

  // Default safe values
  const emptySentiment = { positive: 0, neutral: 0, negative: 0 };
  const emptyStats = {
    followers: 0,
    totalViews: 0,
    totalLikes: 0,
    sentiments: emptySentiment,
  };

  if (!analytics) return { stats: null, loading, error, refetch };

  const instagram = analytics.socialMedia?.instagram || emptyStats;
  const tiktok = analytics.socialMedia?.tiktok || emptyStats;

  const safeInstagram = {
    ...instagram,
    sentiments: instagram.sentiments || emptySentiment,
  };
  const safeTiktok = {
    ...tiktok,
    sentiments: tiktok.sentiments || emptySentiment,
  };

  if (platform === 'instagram') {
    return { stats: safeInstagram, loading, error, refetch };
  }
  if (platform === 'tiktok') {
    return { stats: safeTiktok, loading, error, refetch };
  }
  // all
  return {
    stats: {
      followers: safeInstagram.followers + safeTiktok.followers,
      totalViews: safeInstagram.totalViews + safeTiktok.totalViews,
      totalLikes: safeInstagram.totalLikes + safeTiktok.totalLikes,
      sentiments: {
        positive: safeInstagram.sentiments.positive + safeTiktok.sentiments.positive,
        neutral: safeInstagram.sentiments.neutral + safeTiktok.sentiments.neutral,
        negative: safeInstagram.sentiments.negative + safeTiktok.sentiments.negative,
      },
    },
    loading,
    error,
    refetch,
  };
};