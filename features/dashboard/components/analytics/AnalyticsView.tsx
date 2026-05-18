// features/dashboard/components/Analytics/AnalyticsView.tsx
'use client';

import { useState } from 'react'; // 🆕 useEffect
import { PlatformSwitcher } from '../PlatformSwitcher';
import { DataErrorFallback } from '../DataErrorFallback';
import { usePlatformData } from '../../hooks/usePlatformData';
import { useGetAnalyticsQuery } from '../../graphql/analytics.query';
import { useAnalyticsSubscription } from '../../graphql/analytics.subscription';
import { SentimentSection } from './SentimentSection';
import { AgePieChart } from './AgePieChart';
import { GenderChart } from './GenderChart';
import { GeoMap } from './GeoMap';
import { SearchableSection } from '../SearchableSection';
import { NoSearchResults } from '../NoSearchResults';

export function AnalyticsView() {
  const [platform, setPlatform] = useState<'all' | 'instagram' | 'tiktok'>('all');

  const { stats, loading: statsLoading, error: statsError, refetch } = usePlatformData(platform);
  const { data: queryData, loading, error } = useGetAnalyticsQuery();
  const { liveData } = useAnalyticsSubscription();

  // Gabungkan data
  const effectiveAnalytics = liveData || queryData?.analytics;
  const sentiments = stats?.sentiments || { positive: 0, neutral: 0, negative: 0 };
  const countryHeatmap = effectiveAnalytics?.heatmap?.filter(
    h => h.level.toLocaleLowerCase() === 'country' && h.code !== 'UNKNOWN'
  ) || [];


  const isLoading = (statsLoading || loading) && !liveData;
  const activeError = !liveData ? (statsError || error) : null;

  if (isLoading) return <div className="flex justify-center py-20 text-gray-500">Loading analytics...</div>;
  if (activeError) {
    return (
      <div className='space-y-6'>
        <DataErrorFallback
          error={activeError}
          title='Failed to load analytics data'
          onRetry={() => refetch?.()}
        />
      </div>
    )
  }
  if (!effectiveAnalytics) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Sentiment analysis and audience demographics.</p>
          {liveData && (
            <span className="text-xs text-green-600">● Live update active</span>
          )}
        </div>
        <PlatformSwitcher selected={platform} onChange={setPlatform} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SearchableSection title="Sentiment Analysis">
          <SentimentSection
            positive={sentiments.positive}
            neutral={sentiments.neutral}
            negative={sentiments.negative}
          />
        </SearchableSection>
        <div className="space-y-6">
          <SearchableSection title="Audience Age">
            <AgePieChart data={effectiveAnalytics.ageRange} />
          </SearchableSection>
          <SearchableSection title="Gender">
            <GenderChart data={effectiveAnalytics.genderAudience} />
          </SearchableSection>
        </div>
      </div>
      <SearchableSection title="Audience Location">
        <GeoMap data={countryHeatmap} />
      </SearchableSection>

      <NoSearchResults />
    </div>
  );
}