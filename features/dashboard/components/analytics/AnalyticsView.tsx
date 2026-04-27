'use client';

import { useState } from 'react';
import { PlatformSwitcher } from '../PlatfromSwitcher';
import { usePlatformData } from '../../hooks/usePlatformData';
import { useGetAnalyticsQuery } from '../../graphql/analytics.query';
import { SentimentSection } from './SentimentSection';
import { AgePieChart } from './AgePieChart';
import { GenderChart } from './GenderChart';
import { GeoMap } from './GeoMap';

export function AnalyticsView() {
  const [platform, setPlatform] = useState<'all' | 'instagram' | 'tiktok'>('all');
  const { stats, loading: statsLoading, error: statsError } = usePlatformData(platform);
  const { data, loading, error } = useGetAnalyticsQuery();

  const isLoading = statsLoading || loading;
  const isError = statsError || error;

  if (isLoading) return <div className="flex justify-center py-20 text-gray-500">Memuat analytics...</div>;
  if (isError) return <div className="flex justify-center py-20 text-red-500">Error: {isError.message}</div>;

  const analytics = data?.analytics;
  if (!analytics) return null;

  const sentiments = stats?.sentiments || { positive: 0, neutral: 0, negative: 0 };
  const countryHeatmap = analytics.heatmap.filter(h => h.level === 'Country');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Analisis sentimen dan demografi audiens.</p>
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
          <AgePieChart data={analytics.ageRange} />
          <GenderChart data={analytics.genderAudience} />
        </div>
      </div>
      <GeoMap data={countryHeatmap} />
    </div>
  );
}