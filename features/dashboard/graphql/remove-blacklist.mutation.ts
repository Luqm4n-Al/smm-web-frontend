// features/insight/graphql/remove-blacklist.mutation.ts
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { GET_COMMENT_BLACKLISTS_QUERY } from './commentBlacklists.query';

export const REMOVE_BLACKLIST_MUTATION = gql`
  mutation RemoveCommentBlackList($id: ID!) {
    removeCommentBlackList(id: $id)
  }
`;

export const useRemoveBlacklistMutation = () => {
  return useMutation(REMOVE_BLACKLIST_MUTATION, {
    refetchQueries: [{ query: GET_COMMENT_BLACKLISTS_QUERY }],
  });
};