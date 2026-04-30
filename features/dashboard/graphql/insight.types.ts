export interface PostAnalytics {
    id: string;
    platform: 'INSTAGRAM' | 'TIKTOK';
    caption: string;
    fileUrl: string;
    likeCount: number;
    viewCount: number;
    createdAt: string;
    avgSentiment: number;
}

export interface PostFilter {
    platform?: 'INSTAGRAM' | 'TIKTOK';
    sortField?: 'DATE' | 'LIKE' | 'VIEW' | 'SENTIMENT';
    sortOrder?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
}

export interface CommentBlackList {
    id: string;
    word: string;
}