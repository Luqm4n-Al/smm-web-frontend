'use client'

import { FiClock } from "react-icons/fi"
import { useGetBestTimeToPostQuery } from "../../graphql/recommendation.query"

/**
 * BestTimeWidget
 *
 * Menampilkan waktu terbaik untuk posting
 * yang dihasilkan oleh AI dari server.
 * Data diambil via GraphQL query bestTimeToPost.
 */
export function BestTimeWidget() {
    const { data, loading, error } = useGetBestTimeToPostQuery();

    const bestTime = data?.bestTimeToPost;

    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
                <FiClock className="h-5 w-5 text-green-600"/>
                <h3 className="text-lg font-medium text-gray-900">Best Time to Post</h3>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="flex justify-center py-6 text-gray-400 text-sm">
                    Loading best time...
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="flex justify-center py-6 text-red-400 text-sm">
                    Failed to load best time.
                </div>
            )}

            {/* Content */}
            {!loading && !error && (
                <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">
                        {bestTime?.time ?? '—'}
                    </p>
                    {bestTime && (
                        <p className="mt-2 text-xs text-gray-400">
                            Generated at {new Date(bestTime.generated_at).toLocaleString()}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}