export interface GrowthValue {
  date: string;
  quantity: number;
}

export interface GrowthMatrix {
  followers: GrowthValue[];
  likes: GrowthValue[];
  views: GrowthValue[];
}

export interface SentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
}

export interface PlatformStats {
  followers: number;
  totalViews: number;
  totalLikes: number;
  sentiments: SentimentDistribution;
}

export interface SocialMediaStats {
  instagram: PlatformStats;
  tiktok: PlatformStats;
}

export interface AgeRangeStat {
  age: string;
  quantity: number;
}

export interface GenderStat {
  gender: string;
  quantity: number;
}

export interface Heatmap {
  level: string;
  code: string;
  value: number;
}

export interface Analytics {
  heatmap: Heatmap[];
  ageRange: AgeRangeStat[];
  genderAudience: GenderStat[];
  socialMedia: SocialMediaStats;
  growthMatrix: GrowthMatrix;
}

// ===== POST ANALYTICS TYPES =====
export enum Platform {
  TIKTOK = 'TIKTOK',
  INSTAGRAM = 'INSTAGRAM',
}

export interface PostAnalytics {
  id: string;
  platform: Platform;
  caption: string;
  fileUrl: string;
  likeCount: number;
  viewCount: number;
  createdAt: string;
  avgSentiment: number;
}

// ===== POST FILTER TYPES =====
export enum PostSortField {
  DATE = 'DATE',
  LIKE = 'LIKE',
  VIEW = 'VIEW',
  SENTIMENT = 'SENTIMENT',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface PostFilter {
  platform?: Platform;
  sortField?: PostSortField;
  sortOrder?: SortOrder;
  limit?: number;
  offset?: number;
}