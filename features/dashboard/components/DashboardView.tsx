// features/dashboard/components/DashboardView.tsx
'use client';

import { useState } from 'react';
import { PlatformSwitcher } from './PlatformSwitcher';
import { DataErrorFallback } from './DataErrorFallback';
import { useGetAnalyticsQuery } from '../graphql/analytics.query';
import { useAnalyticsSubscription } from '../graphql/analytics.subscription';
import { StatGrid } from './stats/StatGrid';
import { GrowthLineChart } from './charts/GrowthLineChart';

export function DashboardView() {
  const [platform, setPlatform] = useState<'all' | 'instagram' | 'tiktok'>('all');

  // 🆕 Ambil refetch dari query
  const {
    data: queryData,
    loading: analyticsLoading,
    error: analyticsError,
    refetch,
  } = useGetAnalyticsQuery();

  // WebSocket Subscription untuk real-time updates
  const { liveData } = useAnalyticsSubscription();

  // Prioritize subscription data > query data
  const effectiveAnalytics = liveData || queryData?.analytics;
  const growth = effectiveAnalytics?.growthMatrix;

  // Filter stats berdasarkan platform
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
    // Pre-build Map untuk O(1) lookup per tanggal (menghindari O(n²) dari Array.find)
    const followerMap = new Map(growth.followers?.map(f => [f.date, f.quantity]) ?? []);
    const likeMap = new Map(growth.likes?.map(l => [l.date, l.quantity]) ?? []);
    const viewMap = new Map(growth.views?.map(v => [v.date, v.quantity]) ?? []);

    // Kumpulkan semua tanggal unik
    const dateSet = new Set<string>([
      ...(growth.followers?.map(f => f.date) ?? []),
      ...(growth.likes?.map(l => l.date) ?? []),
      ...(growth.views?.map(v => v.date) ?? []),
    ]);

    dateSet.forEach(date => {
      mergedGrowthData.push({
        date,
        followers: followerMap.get(date),
        likes: likeMap.get(date),
        views: viewMap.get(date),
      });
    });

    mergedGrowthData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  const loading = analyticsLoading;
  const error = analyticsError;

  // 🟡 Loading state
  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-500">
        Memuat dashboard...
      </div>
    );

  // 🔴 Error state – sekarang menggunakan DataErrorFallback
  if (error) {
    return (
      <div className="space-y-6">
        <DataErrorFallback
          error={error}
          title="Gagal memuat data dashboard"
          onRetry={() => refetch?.()} // ✅ aman dengan optional chaining
        />
      </div>
    );
  }

  // 🟢 Data tersedia
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