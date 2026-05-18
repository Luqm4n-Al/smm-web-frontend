// features/dashboard/components/DashboardView.tsx

'use client';

// React hook untuk state management
import { useState } from 'react';

// Component switch platform
import { PlatformSwitcher } from './PlatformSwitcher';

// Component fallback error
import { DataErrorFallback } from './DataErrorFallback';

// GraphQL query untuk mengambil analytics awal
import { useGetAnalyticsQuery } from '../graphql/analytics.query';

// GraphQL subscription untuk realtime update
import { useAnalyticsSubscription } from '../graphql/analytics.subscription';

// Component statistik dashboard
import { StatGrid } from './stats/StatGrid';

// Component chart pertumbuhan data
import { GrowthLineChart } from './charts/GrowthLineChart';

// Wrapper section yang mendukung search filtering
import { SearchableSection } from './SearchableSection';

// Component informasi pencarian
import { NoSearchResults } from './NoSearchResults';

/**
 * DashboardView
 * 
 * Component utama halaman dashboard.
 * 
 * Fungsi utama:
 * - Menampilkan statistik social media.
 * - Menampilkan growth chart.
 * - Mendukung filtering platform.
 * - Mendukung realtime update menggunakan subscription.
 * - Mendukung search section dashboard.
 * - Menangani loading & error state.
 */
export function DashboardView() {

  /**
   * State platform aktif.
   * 
   * Pilihan:
   * - all
   * - instagram
   * - tiktok
   */
  const [platform, setPlatform] =
    useState<'all' | 'instagram' | 'tiktok'>('all');

  /**
   * GRAPHQL QUERY
   * 
   * Mengambil data analytics awal dari server.
   * 
   * Data yang didapat:
   * - analytics data
   * - loading state
   * - error state
   * - refetch function
   */
  const {
    data: queryData,
    loading: analyticsLoading,
    error: analyticsError,
    refetch,
  } = useGetAnalyticsQuery();

  /**
   * GRAPHQL SUBSCRIPTION
   * 
   * Subscription digunakan untuk menerima
   * realtime update dari server melalui WebSocket.
   * 
   * Contoh:
   * - followers bertambah
   * - likes berubah
   * - views update
   */
  const { liveData } = useAnalyticsSubscription();

  /**
   * PRIORITIZE REALTIME DATA
   * 
   * Jika liveData tersedia:
   * - gunakan data subscription.
   * 
   * Jika tidak:
   * - fallback ke data query awal.
   */
  const effectiveAnalytics =
    liveData || queryData?.analytics;

  /**
   * Data growth matrix untuk chart.
   */
  const growth = effectiveAnalytics?.growthMatrix;

  /**
   * FILTER DATA BERDASARKAN PLATFORM
   * 
   * Function untuk menghasilkan statistik
   * sesuai platform yang dipilih user.
   */
  const getFilteredStats = () => {

    /**
     * Jika data social media belum tersedia:
     * return null.
     */
    if (!effectiveAnalytics?.socialMedia) return null;

    /**
     * Ambil data Instagram dan TikTok.
     */
    const instagram =
      effectiveAnalytics.socialMedia.instagram;

    const tiktok =
      effectiveAnalytics.socialMedia.tiktok;

    /**
     * FILTER INSTAGRAM
     */
    if (platform === 'instagram') {

      return {
        followers: instagram.followers,
        totalViews: instagram.totalViews,
        totalLikes: instagram.totalLikes,
        sentiments: instagram.sentiments,
      };
    }

    /**
     * FILTER TIKTOK
     */
    if (platform === 'tiktok') {

      return {
        followers: tiktok.followers,
        totalViews: tiktok.totalViews,
        totalLikes: tiktok.totalLikes,
        sentiments: tiktok.sentiments,
      };
    }

    /**
     * AGGREGATE ALL PLATFORM
     * 
     * Menggabungkan seluruh data
     * dari Instagram dan TikTok.
     */
    return {

      followers:
        instagram.followers + tiktok.followers,

      totalViews:
        instagram.totalViews + tiktok.totalViews,

      totalLikes:
        instagram.totalLikes + tiktok.totalLikes,

      sentiments: {

        positive:
          instagram.sentiments.positive +
          tiktok.sentiments.positive,

        neutral:
          instagram.sentiments.neutral +
          tiktok.sentiments.neutral,

        negative:
          instagram.sentiments.negative +
          tiktok.sentiments.negative,
      },
    };
  };

  /**
   * Hasil statistik berdasarkan platform aktif.
   */
  const filteredStats = getFilteredStats();

  /**
   * MERGE GROWTH DATA
   * 
   * Menggabungkan:
   * - followers
   * - likes
   * - views
   * 
   * menjadi satu array berdasarkan tanggal.
   * 
   * Format akhir:
   * [
   *   {
   *     date,
   *     followers,
   *     likes,
   *     views
   *   }
   * ]
   */
  const mergedGrowthData: Array<{
    date: string;
    followers?: number;
    likes?: number;
    views?: number;
  }> = [];

  if (growth) {

    /**
     * OPTIMIZED LOOKUP MAP
     * 
     * Menggunakan Map agar pencarian data
     * per tanggal menjadi O(1).
     * 
     * Lebih efisien dibanding Array.find()
     * yang memiliki kompleksitas O(n²).
     */

    const followerMap = new Map(
      growth.followers?.map(f => [f.date, f.quantity]) ?? []
    );

    const likeMap = new Map(
      growth.likes?.map(l => [l.date, l.quantity]) ?? []
    );

    const viewMap = new Map(
      growth.views?.map(v => [v.date, v.quantity]) ?? []
    );

    /**
     * KUMPULKAN SELURUH TANGGAL UNIK
     */

    const dateSet = new Set<string>([
      ...(growth.followers?.map(f => f.date) ?? []),
      ...(growth.likes?.map(l => l.date) ?? []),
      ...(growth.views?.map(v => v.date) ?? []),
    ]);

    /**
     * Bangun object merged berdasarkan tanggal.
     */
    dateSet.forEach(date => {

      mergedGrowthData.push({

        date,

        followers: followerMap.get(date),

        likes: likeMap.get(date),

        views: viewMap.get(date),
      });
    });

    /**
     * Urutkan data berdasarkan tanggal.
     */
    mergedGrowthData.sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );
  }

  /**
   * State loading dashboard.
   */
  const loading = analyticsLoading;

  /**
   * State error dashboard.
   */
  const error = analyticsError;

  /**
   * LOADING STATE
   * 
   * Ditampilkan saat data masih diambil.
   */
  if (loading)

    return (
      <div className="flex justify-center py-20 text-gray-500">
        Loading dashboard...
      </div>
    );

  /**
   * ERROR STATE
   * 
   * Ditampilkan ketika request gagal.
   */
  if (error) {

    return (

      <div className="space-y-6">

        <DataErrorFallback

          error={error}

          title="Failed to load dashboard data"

          /**
           * Retry request data dashboard.
           * 
           * Optional chaining digunakan
           * agar aman jika refetch undefined.
           */
          onRetry={() => refetch?.()}
        />

      </div>
    );
  }

  /**
   * MAIN DASHBOARD VIEW
   */
  return (

    <div className="space-y-6">

  
          {/*HEADER DASHBOA */}
      <div className="flex items-center justify-between">

        <div>

          {/* Judul halaman */}
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>

          {/* Deskripsi halaman */}
          <p className="text-gray-600">
            Monitor the performance of your social media accounts.
          </p>

          {/**
           * Indicator realtime update aktif.
           */}
          {
            liveData && (
              <span className="text-xs text-green-600">
                ● Live update active
              </span>
            )
          }

        </div>

        {/* Switch platform dashboard */}
        <PlatformSwitcher
          selected={platform}
          onChange={setPlatform}
        />

      </div>

  
         {/* STATISTICS SECTION */}
      <SearchableSection title="Statistics">

        {
          filteredStats && (

            <StatGrid

              followers={filteredStats.followers}

              likes={filteredStats.totalLikes}

              views={filteredStats.totalViews}
            />
          )
        }

      </SearchableSection>

  
        {/*  GROWTH CHART SECTION */}
      <SearchableSection title="Growth Chart">

        <GrowthLineChart

          data={mergedGrowthData}

          title={`Followers, Likes & Views Growth (Global)`}

          /**
           * Konfigurasi garis chart.
           */
          lines={[
            {
              dataKey: 'followers',
              color: '#2563eb',
              name: 'Followers',
            },
            {
              dataKey: 'likes',
              color: '#10b981',
              name: 'Likes',
            },
            {
              dataKey: 'views',
              color: '#f59e0b',
              name: 'Views',
            },
          ]}
        />

      </SearchableSection>

      {/**
       * Informasi tambahan ketika
       * platform filter aktif.
       */}
      {
        platform !== 'all' && (

          <p className="text-xs text-center text-gray-400">

            * Growth data is global
            (combined across all platforms)

          </p>
        )
      }

      {/* Informasi pencarian aktif */}
      <NoSearchResults />

    </div>
  );
}