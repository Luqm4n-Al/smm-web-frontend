'use client';

import { useState } from 'react';
import { PlatformSwitcher } from '../PlatfromSwitcher';
import { usePlatformData } from '../../hooks/usePlatformData';
import { useGetAnalyticsQuery } from '../../graphql/analytics.query';
import { useAnalyticsSubscription } from '../../graphql/analytics.subscription'; // 🆕
import { SentimentSection } from './SentimentSection';
import { AgePieChart } from './AgePieChart';
import { GenderChart } from './GenderChart';
import { GeoMap } from './GeoMap';

export function AnalyticsView() {
  const [platform, setPlatform] = useState<'all' | 'instagram' | 'tiktok'>('all');

  const { stats, loading: statsLoading, error: statsError } = usePlatformData(platform);
  const { data: queryData, loading, error } = useGetAnalyticsQuery();
  const { liveData } = useAnalyticsSubscription(); // 🆕

  // Gabungkan data
  const effectiveAnalytics = liveData || queryData?.analytics;
  const sentiments = stats?.sentiments || { positive: 0, neutral: 0, negative: 0 };
  const countryHeatmap = effectiveAnalytics?.heatmap?.filter(
    h => h.level.toLocaleLowerCase() === 'country' && h.code !== 'UNKNOWN'
  ) || [];

  const isLoading = (statsLoading || loading) && !liveData;
  const activeError = !liveData ? (statsError || error) : null

  if (isLoading) return <div className="flex justify-center py-20 text-gray-500">Memuat analytics...</div>;
  if (activeError) return <div className="flex justify-center py-20 text-red-500">Error: {activeError.message}</div>;
  if (!effectiveAnalytics) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Analisis sentimen dan demografi audiens.</p>
          {liveData && (
            <span className="text-xs text-green-600">● Live update aktif</span>
          )}
        </div>
        <PlatformSwitcher selected={platform} onChange={setPlatform} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SentimentSection
          positive={sentiments.positive}
          neutral={sentiments.neutral}
          negative={sentiments.negative}
        />
        <div className="space-y-6">
          <AgePieChart data={effectiveAnalytics.ageRange} />
          <GenderChart data={effectiveAnalytics.genderAudience} />
        </div>
      </div>
      <GeoMap data={countryHeatmap} />
    </div>
  );
}