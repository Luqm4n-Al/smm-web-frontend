import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type { Analytics } from './analytics.types';

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