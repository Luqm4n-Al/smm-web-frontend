import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { TopHashtag } from "./recommendation.types";

/**
 * Query untuk mengambil daftar top hashtag
 * berdasarkan platform.
 *
 * Variables:
 * - platform  → INSTAGRAM | TIKTOK (required)
 * - limit     → jumlah data (default: 10)
 */
export const GET_TOP_HASHTAGS_QUERY = gql`
    query GetTopHashtags($platform: Platform!, $limit: Int = 10) {
        topHashtags(platform: $platform, limit: $limit) {
            platform
            topHashtag
            rank
            score
            createdAt
        }
    }
`;

/**
 * Custom hook untuk query topHashtags
 *
 * @param platform - Platform filter (INSTAGRAM | TIKTOK)
 * @param limit    - Jumlah hashtag yang diambil (default: 10)
 */
export const useGetTopHashtagsQuery = (
    platform: 'INSTAGRAM' | 'TIKTOK',
    limit: number = 10
) => {
    return useQuery<{ topHashtags: TopHashtag[] }>(GET_TOP_HASHTAGS_QUERY, {
        variables: { platform, limit },
    });
};
