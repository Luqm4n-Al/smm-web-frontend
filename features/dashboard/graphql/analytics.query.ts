import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type { Analytics, PostAnalytics, PostFilter } from './analytics.types';

export const GET_ANALYTICS_QUERY = gql`
  query GetAnalytics {
    analytics {
      socialMedia {
        instagram {
          followers
          totalViews
          totalLikes
          sentiments {
            positive
            neutral
            negative
          }
        }
        tiktok {
          followers
          totalViews
          totalLikes
          sentiments {
            positive
            neutral
            negative
          }
        }
      }
      growthMatrix {
        followers {
          date
          quantity
        }
        likes {
          date
          quantity
        }
        views {
          date
          quantity
        }
      }
      ageRange {
        age
        quantity
      }
      genderAudience {
        gender
        quantity
      }
      heatmap {
        level
        code
        value
      }
    }
  }
`;

export const useGetAnalyticsQuery = () => {
  return useQuery<{ analytics: Analytics }>(GET_ANALYTICS_QUERY);
};

/**
 * GraphQL Query untuk mendapatkan post analytics
 * Mengambil data post dari Instagram dan TikTok dengan filter
 */
export const GET_POSTS_QUERY = gql`
  query GetPosts($filter: PostFilter) {
    posts(filter: $filter) {
      id
      platform
      caption
      fileUrl
      likeCount
      viewCount
      createdAt
      avgSentiment
    }
  }
`;

/**
 * Hook untuk fetch post analytics dengan filter
 * @param filter - Filter untuk sorting, pagination, dan platform
 * @returns Data post, loading state, error state
 */
export const useGetPostsQuery = (filter?: PostFilter) => {
  const { data, loading, error } = useQuery<{ posts: PostAnalytics[] }>(GET_POSTS_QUERY, {
    variables: { filter },
    skip: !filter,
  });

  return { data: data?.posts || [], loading, error };
};