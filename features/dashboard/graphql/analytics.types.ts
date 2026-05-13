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