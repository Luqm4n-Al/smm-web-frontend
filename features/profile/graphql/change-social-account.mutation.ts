import { gql} from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type { SocialAccountInput } from './profile.types';

export const CHANGE_SOCIAL_ACCOUNT_MUTATION = gql`
  mutation ChangeSocialMediaAccount($input: [SocialAccountInput!]!) {
    changeSocialMediaAccount(input: $input)
  }
`;

export const useChangeSocialAccountMutation = () => {
  return useMutation<{ changeSocialMediaAccount: string }, { input: SocialAccountInput[] }>(CHANGE_SOCIAL_ACCOUNT_MUTATION);
};