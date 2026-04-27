'use client';

import { useState } from 'react';
import { PlatformSwitcher } from './PlatfromSwitcher';
import { usePlatformData } from '../hooks/usePlatformData';
import { useGetAnalyticsQuery } from '../graphql/analytics.query';
import { StatGrid } from './stats/StatGrid';
import { GrowthLineChart } from './charts/GrowthLineChart';

export function DashboardView() {
  const [platform, setPlatform] = useState<'all' | 'instagram' | 'tiktok'>('all');

  // Query awal
  const { stats, loading: statsLoading, error: statsError } = usePlatformData(platform);
  const { data: queryData, loading: analyticsLoading, error: analyticsError } = useGetAnalyticsQuery();

  // Gabungkan: jika liveData ada, gunakan; jika tidak, gunakan data query
  const effectiveAnalytics = queryData?.analytics;
  const growth = effectiveAnalytics?.growthMatrix;
  const followerGrowth = growth?.followers?.map(item => ({
    date: item.date,
    followers: item.quantity,
  })) || [];

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
        data={followerGrowth}
        title="Pertumbuhan Followers (Global)"
        dataKey="followers"
        color="#2563eb"
      />
    </div>
  );
}