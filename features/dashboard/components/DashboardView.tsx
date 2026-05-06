// features/dashboard/components/DashboardView.tsx
'use client';

import { useState } from 'react';
import { PlatformSwitcher } from './PlatfromSwitcher';
import { usePlatformData } from '../hooks/usePlatformData';
import { useGetAnalyticsQuery } from '../graphql/analytics.query';
import { StatGrid } from './stats/StatGrid';
import { GrowthLineChart } from './charts/GrowthLineChart';

export function DashboardView() {
  const [platform, setPlatform] = useState<'all' | 'instagram' | 'tiktok'>('all');

  const { stats, loading: statsLoading, error: statsError } = usePlatformData(platform);
  const { data: queryData, loading: analyticsLoading, error: analyticsError } = useGetAnalyticsQuery();

  const effectiveAnalytics = queryData?.analytics;
  const growth = effectiveAnalytics?.growthMatrix;

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

  const loading = statsLoading || analyticsLoading;
  const error = statsError || analyticsError;

  if (loading) return <div className="flex justify-center py-20 text-gray-500">Memuat dashboard...</div>;
  if (error) return <div className="flex justify-center py-20 text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Pantau performa akun media sosial Anda.</p>
        </div>
        <PlatformSwitcher selected={platform} onChange={setPlatform} />
      </div>

      {stats && (
        <StatGrid
          followers={stats.followers}
          likes={stats.totalLikes}
          views={stats.totalViews}
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