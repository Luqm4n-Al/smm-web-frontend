'use client'

import { useState } from 'react'
import { FiTrendingUp } from "react-icons/fi"
import { useGetTopTrendingQuery } from '../../graphql/trending-posts.query'

/**
 * TrendingPostCard
 *
 * Menampilkan daftar trending posts
 * dari server berdasarkan platform yang dipilih.
 *
 * Data diambil secara realtime via GraphQL query topTrending.
 * Setiap post menampilkan rank, trending score, caption, dan URL.
 */
export function TrendingPostCard() {

    /**
     * State platform untuk filter trending posts.
     *
     * Default: INSTAGRAM
     */
    const [platform, setPlatform] =
        useState<'INSTAGRAM' | 'TIKTOK'>('INSTAGRAM');

    /**
     * Query top trending posts dari server.
     */
    const { data, loading, error } = useGetTopTrendingQuery(platform);

    const trendingPosts = data?.topTrending || [];

    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">

            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FiTrendingUp className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-900">Trending Posts</h3>
                </div>

                {/* Platform filter */}
                <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as 'INSTAGRAM' | 'TIKTOK')}
                    className="rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                >
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="TIKTOK">TikTok</option>
                </select>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="flex justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></div>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
                    Failed to load trending posts. Please try again later.
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && trendingPosts.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                    No trending posts found for {platform === 'INSTAGRAM' ? 'Instagram' : 'TikTok'}
                </div>
            )}

            {/* Trending posts list */}
            {!loading && !error && trendingPosts.length > 0 && (
                <div className="space-y-4">
                    {trendingPosts.map((post, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 rounded-md border border-gray-100 p-4 hover:bg-gray-50 transition-colors"
                        >
                            {/* Rank badge */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                <span className="font-bold text-blue-600">#{post.rank}</span>
                            </div>

                            {/* Post content */}
                            <div className="flex-1 min-w-0">
                                {/* Caption */}
                                <p className="mb-2 line-clamp-2 text-sm text-gray-700">
                                    {post.caption}
                                </p>

                                {/* Trending score and URL */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                            Score: {post.trending_score.toFixed(1)}
                                        </span>
                                    </div>
                                    {post.url && (
                                        <a
                                            href={post.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-600 hover:text-blue-800 underline truncate"
                                        >
                                            View Post →
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
