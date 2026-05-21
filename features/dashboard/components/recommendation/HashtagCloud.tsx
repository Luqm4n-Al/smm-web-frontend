'use client'

import { useState } from 'react'
import { FiHash } from "react-icons/fi"
import { useGetTopHashtagsQuery } from '../../graphql/top-hashtags.query'

/**
 * HashtagCloud
 *
 * Menampilkan daftar top hashtag
 * dari server berdasarkan platform yang dipilih.
 *
 * Data diambil secara realtime via GraphQL query topHashtags.
 * Sebelumnya menggunakan data dummy statis.
 */
export function HashtagCloud() {

    /**
     * State platform untuk filter hashtag.
     *
     * Default: INSTAGRAM
     */
    const [platform, setPlatform] =
        useState<'INSTAGRAM' | 'TIKTOK'>('INSTAGRAM');

    /**
     * Query top hashtags dari server.
     *
     * Limit default 10 hashtag.
     */
    const { data, loading, error } = useGetTopHashtagsQuery(platform);

    const hashtags = data?.topHashtags || [];

    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">

            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FiHash className="h-5 w-5 text-purple-600"/>
                    <h3 className="text-lg font-medium text-gray-900">Hashtag Recommendation</h3>
                </div>

                {/* Platform filter */}
                <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as 'INSTAGRAM' | 'TIKTOK')}
                    className="rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-purple-500 focus:outline-none"
                >
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="TIKTOK">TikTok</option>
                </select>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="flex justify-center py-6 text-gray-400 text-sm">
                    Loading hashtags...
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="flex justify-center py-6 text-red-400 text-sm">
                    Failed to load hashtags.
                </div>
            )}

            {/* Hashtag list */}
            {!loading && !error && (
                <>
                    <div className="flex flex-wrap gap-2">
                        {hashtags.length === 0 ? (
                            <p className="text-sm text-gray-400">No hashtag data available.</p>
                        ) : (
                            hashtags.map((tag) => (
                                <span
                                    key={`${tag.topHashtag}-${tag.rank}`}
                                    className="cursor-pointer rounded-full bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors"
                                    title={`Rank #${tag.rank} · Score: ${tag.score.toFixed(1)}`}
                                >
                                    #{tag.topHashtag}
                                </span>
                            ))
                        )}
                    </div>

                    {hashtags.length > 0 && (
                        <p className="mt-4 text-xs text-gray-500">
                            Top {hashtags.length} hashtags ranked by engagement score
                        </p>
                    )}
                </>
            )}
        </div>
    )
}