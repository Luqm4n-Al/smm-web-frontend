import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type { TrendingPost } from './recommendation.types';

/**
 * Query untuk mengambil data trending posts
 * dari platform yang ditentukan.
 *
 * Parameters:
 * - platform → Platform yang ingin dicek (INSTAGRAM/TIKTOK)
 *
 * Fields:
 * - rank           → peringkat trending post
 * - trending_score → skor trending/popularitas
 * - caption        → caption/deskripsi post
 * - url            → URL post
 */
export const GET_TOP_TRENDING_QUERY = gql`
    query GetTopTrending($platform: Platform!) {
        topTrending(platform: $platform) {
            rank
            trending_score
            caption
            url
        }
    }
`;

/**
 * Custom hook untuk query topTrending
 */
export const useGetTopTrendingQuery = (platform: 'INSTAGRAM' | 'TIKTOK') => {
    return useQuery<
        { topTrending: TrendingPost[] },
        { platform: 'INSTAGRAM' | 'TIKTOK' }
    >(GET_TOP_TRENDING_QUERY, {
        variables: { platform },
        fetchPolicy: 'cache-first',
    });
};
