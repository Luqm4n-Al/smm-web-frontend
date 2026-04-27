import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type { UserProfile } from './profile.types';

export const GET_PROFILE_QUERY = gql`
  query GetProfile {
    me {
      username
      email
      avatar
      phone
      social_account {
        platform
        username
        api_key
      }
    }
  }
`;

export const useGetProfileQuery = () => {
  return useQuery<{ me: UserProfile }>(GET_PROFILE_QUERY);
};