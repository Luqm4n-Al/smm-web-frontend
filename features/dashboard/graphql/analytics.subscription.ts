import { gql } from '@apollo/client';
import { useSubscription } from '@apollo/client/react';
import type { Analytics } from './analytics.types';

// ============================================================
// GraphQL SUBSCRIPTION untuk Real-time Analytics Updates
// ============================================================
// 
// Query ini subscribe ke server untuk menerima update analytics
// secara real-time ketika ada perubahan data.
//
// Fields yang diterima:
// - heatmap: Geographic distribution data untuk peta
// - ageRange: Demographic data distribusi usia
// - genderAudience: Demographic data distribusi gender
// - socialMedia: Engagement metrics dari Instagram & TikTok
// - growthMatrix: Trend data untuk growth chart
//
// Protocol: WebSocket (graphql-ws)
// Endpoint: NEXT_PUBLIC_WS_ENDPOINT
//
export const ANALYTICS_UPDATED_SUBSCRIPTION = gql`
  subscription AnalyticsUpdated {
    analyticsUpdated {
      # Geographic heatmap data
      heatmap {
        level      # Color intensity level (1-5)
        code       # Country code (e.g., "ID", "US")
        value      # Number of followers in that region
      }
      
      # Age range demographic distribution
      ageRange {
        age        # Age range label (e.g., "18-24", "25-34")
        quantity   # Number of followers in this age group
      }
      
      # Gender demographic distribution
      genderAudience {
        gender     # "M" untuk Laki-laki, "F" untuk Perempuan
        quantity   # Number of followers
      }
      
      # Social media engagement data
      socialMedia {
        # Instagram metrics
        instagram {
          followers    # Total Instagram followers
          totalViews   # Total video/post views
          totalLikes   # Total likes received
          sentiments {
            positive   # Positive comment count
            neutral    # Neutral comment count
            negative   # Negative comment count
          }
        }
        
        # TikTok metrics
        tiktok {
          followers    # Total TikTok followers
          totalViews   # Total video views
          totalLikes   # Total likes received
          sentiments {
            positive   # Positive comment count
            neutral    # Neutral comment count
            negative   # Negative comment count
          }
        }
      }
      
      # Growth trend data untuk line chart
      growthMatrix {
        # Followers growth over time
        followers {
          date       # ISO date string (YYYY-MM-DD)
          quantity   # Follower count on that date
        }
        
        # Likes growth over time
        likes {
          date       # ISO date string
          quantity   # Total likes on that date
        }
        
        # Views growth over time
        views {
          date       # ISO date string
          quantity   # Total views on that date
        }
      }
    }
  }
`;

/**
 * Custom hook untuk subscribe ke real-time analytics updates
 * 
 * @returns {Object}
 *   - liveData: Analytics data terbaru dari subscription
 *   - isLiveLoading: Boolean, true saat subscribe pending
 *   - liveError: Error object jika ada masalah
 */
export const useAnalyticsSubscription = () => {
  // Subscribe ke GraphQL subscription
  const { data, loading, error } = useSubscription<{ analyticsUpdated: Analytics }>(
    ANALYTICS_UPDATED_SUBSCRIPTION
  );

  // Return data in standard format for components
  return {
    liveData: data?.analyticsUpdated,
    isLiveLoading: loading,
    liveError: error,
  };
};