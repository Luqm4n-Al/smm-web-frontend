// features/dashboard/components/DashboardView.tsx
'use client';

import { useState } from 'react';
import { PlatformSwitcher } from './PlatfromSwitcher';
import { useGetAnalyticsQuery } from '../graphql/analytics.query';
import { useAnalyticsSubscription } from '../graphql/analytics.subscription';
import { StatGrid } from './stats/StatGrid';
import { GrowthLineChart } from './charts/GrowthLineChart';

export function DashboardView() {
  const [platform, setPlatform] = useState<'all' | 'instagram' | 'tiktok'>('all');

  // HTTP Query untuk initial load
  const { data: queryData, loading: analyticsLoading, error: analyticsError } = useGetAnalyticsQuery();

  // WebSocket Subscription untuk real-time updates ⭐ NEW
  const { liveData } = useAnalyticsSubscription();

  // Prioritize subscription data > query data
  const effectiveAnalytics = liveData || queryData?.analytics;
  const growth = effectiveAnalytics?.growthMatrix;

  // Filter stats berdasarkan platform + prioritize live data
  const getFilteredStats = () => {
    if (!effectiveAnalytics?.socialMedia) return null;
    
    const instagram = effectiveAnalytics.socialMedia.instagram;
    const tiktok = effectiveAnalytics.socialMedia.tiktok;
    
    if (platform === 'instagram') {
      return {
        followers: instagram.followers,
        totalViews: instagram.totalViews,
        totalLikes: instagram.totalLikes,
        sentiments: instagram.sentiments,
      };
    }
    
    if (platform === 'tiktok') {
      return {
        followers: tiktok.followers,
        totalViews: tiktok.totalViews,
        totalLikes: tiktok.totalLikes,
        sentiments: tiktok.sentiments,
      };
    }
    
    // All (aggregate)
    return {
      followers: instagram.followers + tiktok.followers,
      totalViews: instagram.totalViews + tiktok.totalViews,
      totalLikes: instagram.totalLikes + tiktok.totalLikes,
      sentiments: {
        positive: instagram.sentiments.positive + tiktok.sentiments.positive,
        neutral: instagram.sentiments.neutral + tiktok.sentiments.neutral,
        negative: instagram.sentiments.negative + tiktok.sentiments.negative,
      },
    };
  };

  const filteredStats = getFilteredStats();

  // Gabungkan followers, likes, views menjadi satu array per tanggal (global)
  const mergedGrowthData: Array<{
    date: string;
    followers?: number;
    likes?: number;
    views?: number;
  }> = [];

  if (growth) {
    const dateSet = new Set<string>();
    growth.followers?.forEach(f => dateSet.add(f.date));
    growth.likes?.forEach(l => dateSet.add(l.date));
    growth.views?.forEach(v => dateSet.add(v.date));

    dateSet.forEach(date => {
      const followerEntry = growth.followers?.find(f => f.date === date);
      const likeEntry = growth.likes?.find(l => l.date === date);
      const viewEntry = growth.views?.find(v => v.date === date);

      mergedGrowthData.push({
        date,
        followers: followerEntry?.quantity,
        likes: likeEntry?.quantity,
        views: viewEntry?.quantity,
      });
    });

    mergedGrowthData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  const loading = analyticsLoading; // Prioritize analytics loading (query + subscription)
  const error = analyticsError;

  if (loading) return <div className="flex justify-center py-20 text-gray-500">Memuat dashboard...</div>;
  if (error) return <div className="flex justify-center py-20 text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Pantau performa akun media sosial Anda.</p>
          {liveData && (
            <span className="text-xs text-green-600">● Live update aktif</span>
          )}
        </div>
        <PlatformSwitcher selected={platform} onChange={setPlatform} />
      </div>

      {filteredStats && (
        <StatGrid
          followers={filteredStats.followers}
          likes={filteredStats.totalLikes}
          views={filteredStats.totalViews}
        />
      )}

      <GrowthLineChart
        data={mergedGrowthData}
        title={`Pertumbuhan Followers, Likes, dan Views (Global)`}
        lines={[
          { dataKey: 'followers', color: '#2563eb', name: 'Followers' },
          { dataKey: 'likes', color: '#10b981', name: 'Likes' },
          { dataKey: 'views', color: '#f59e0b', name: 'Views' },
        ]}
      />

      {platform !== 'all' && (
        <p className="text-xs text-gray-400 text-center">
          * Data pertumbuhan bersifat global (gabungan semua platform)
        </p>
      )}
    </div>
  );
}