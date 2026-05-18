import { gql } from '@apollo/client';
import { useSubscription } from '@apollo/client/react';
import type { Analytics } from './analytics.types';

// GraphQL SUBSCRIPTION untuk Real-time Analytics Updates
// 
// Query ini subscribe ke server untuk menerima update analytics
// secara real-time ketika ada perubahan data.
//
// Fields yang diterima:
// - heatmap
// - ageRange
// - genderAudience
// - socialMedia
// - growthMatrix
//
// Protocol: WebSocket (graphql-ws)
// Endpoint: NEXT_PUBLIC_WS_ENDPOINT
//
export const ANALYTICS_UPDATED_SUBSCRIPTION = gql`
  subscription AnalyticsUpdated {
    analyticsUpdated {
      # Geographic heatmap data
      heatmap {
        level     
        code       
        value      
      }
      
      # Age range 
      ageRange {
        age        
        quantity   
      }
      
      # Gender 
      genderAudience {
        gender     
        quantity   
      }
      
      # Social media data
      socialMedia {
        # Instagram metrics
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
        
        # TikTok metrics
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
      
      # Growth trend data untuk line chart
      growthMatrix {
        # Followers growth 
        followers {
          date       
          quantity   
        }
        
        # Likes growth 
        likes {
          date       
          quantity   
        }
        
        # Views growth 
        views {
          date       
          quantity   
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

  // Return data ke standard format untuk components
  return {
    liveData: data?.analyticsUpdated,
    isLiveLoading: loading,
    liveError: error,
  };
};