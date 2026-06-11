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

/**
 * Recommendation
 *
 * Representasi data rekomendasi AI
 * dari server untuk konten dan strategi posting.
 *
 * Fields:
 * - overall_performance    → ringkasan performa keseluruhan
 * - content_strategy       → strategi konten yang direkomendasikan
 * - posting_recommendation → rekomendasi waktu dan frekuensi posting
 * - generated_at           → timestamp rekomendasi dibuat
 */
export interface Recommendation {
    overall_performance: string;
    content_strategy: string;
    posting_recommendation: string;
    generated_at: string;
}

/**
 * BestTimeToPost
 *
 * Representasi data waktu terbaik untuk posting
 * yang dihasilkan oleh AI dari server.
 *
 * Fields:
 * - time         → waktu terbaik untuk posting
 * - generated_at → timestamp data dibuat
 */
export interface BestTimeToPost {
    time: string;
    generated_at: string;
}
