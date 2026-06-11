'use client';

import { FiCpu } from 'react-icons/fi';
import { useGetRecommendationQuery } from '../../graphql/recommendation.query';

/**
 * AIRecommendationCard
 *
 * Menampilkan rekomendasi AI untuk konten dan strategi posting.
 * Data diambil dari server via GraphQL query recommendation.
 */
export function AIRecommendationCard() {
    const { data, loading, error } = useGetRecommendationQuery();

    const recommendation = data?.recommendation;

    /**
     * Konversi fields recommendation menjadi list item
     * agar bisa ditampilkan sebagai bullet list.
     */
    const items = recommendation
        ? [
              recommendation.overall_performance,
              recommendation.content_strategy,
              recommendation.posting_recommendation,
          ]
        : [];

    return (
        <div className="rounded-lg border bg-linear-to-br from-blue-50 to-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
                <FiCpu className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">Smart Recommendations</h3>
                <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">AI</span>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="flex justify-center py-6 text-gray-400 text-sm">
                    Loading recommendations...
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="flex justify-center py-6 text-red-400 text-sm">
                    Failed to load recommendations.
                </div>
            )}

            {/* Recommendation list */}
            {!loading && !error && (
                <>
                    {items.length === 0 ? (
                        <p className="text-sm text-gray-400">No recommendations available.</p>
                    ) : (
                        <ul className="space-y-4">
                            {items.map((rec, idx) => (
                                <li key={idx} className="flex gap-3">
                                    <span className="mt-1 block h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                                    <p className="text-sm text-gray-700">{rec}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                    {recommendation && (
                        <p className="mt-4 text-xs text-gray-400">
                            Generated at {new Date(recommendation.generated_at).toLocaleString()}
                        </p>
                    )}
                </>
            )}
        </div>
    );
}