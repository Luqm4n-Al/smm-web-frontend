import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type { Recommendation, BestTimeToPost } from './recommendation.types';

/**
 * Query untuk mengambil data rekomendasi AI
 * yang dihasilkan berdasarkan performa konten pengguna.
 *
 * Fields:
 * - overall_performance    → ringkasan performa keseluruhan
 * - content_strategy       → strategi konten yang direkomendasikan
 * - posting_recommendation → rekomendasi waktu dan frekuensi posting
 * - generated_at           → timestamp rekomendasi dibuat
 */
export const GET_RECOMMENDATION_QUERY = gql`
    query GetRecommendation {
        recommendation {
            overall_performance
            content_strategy
            posting_recommendation
            generated_at
        }
    }
`;

/**
 * Query untuk mengambil data waktu terbaik untuk posting
 * yang dihasilkan oleh AI dari server.
 *
 * Fields:
 * - time         → waktu terbaik untuk posting
 * - generated_at → timestamp data dibuat
 */
export const GET_BEST_TIME_TO_POST_QUERY = gql`
    query GetBestTimeToPost {
        bestTimeToPost {
            time
            generated_at
        }
    }
`;

/**
 * Custom hook untuk query recommendation
 */
export const useGetRecommendationQuery = () => {
    return useQuery<{ recommendation: Recommendation }>(GET_RECOMMENDATION_QUERY);
};

/**
 * Custom hook untuk query bestTimeToPost
 */
export const useGetBestTimeToPostQuery = () => {
    return useQuery<{ bestTimeToPost: BestTimeToPost }>(GET_BEST_TIME_TO_POST_QUERY);
};
