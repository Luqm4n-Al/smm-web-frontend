/**
 * Type definitions untuk fitur Recommendation
 */

/**
 * TopHashtag
 *
 * Representasi data hashtag trending
 * dari server berdasarkan platform.
 *
 * Fields:
 * - platform    → platform asal (INSTAGRAM/TIKTOK)
 * - topHashtag  → string hashtag
 * - rank        → peringkat hashtag
 * - score       → skor relevansi/popularitas
 * - createdAt   → timestamp data dibuat
 */
export interface TopHashtag {
    platform: 'INSTAGRAM' | 'TIKTOK';
    topHashtag: string;
    rank: number;
    score: number;
    createdAt: string;
}
