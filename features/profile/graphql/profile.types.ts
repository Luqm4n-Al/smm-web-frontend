export interface SocialAccount {
  platform: string;
  username: string;
  api_key: string | null;
}

export interface UserProfile {
  username: string;
  email: string;
  avatar: string;
  phone: string;
  social_account: SocialAccount[];
}

export interface SocialAccountInput {
  platform: string;
  username: string;
  apiKey?: string;
}