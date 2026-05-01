// features/insight/graphql/add-blacklist.mutation.ts
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { GET_COMMENT_BLACKLISTS_QUERY } from './commentBlacklists.query';

export const ADD_BLACKLIST_MUTATION = gql`
  mutation AddCommentBlackList($input: CommentBlackListInput!) {
    addCommentBlackList(input: $input) {
      id
      word
    }
  }
`;

export const useAddBlacklistMutation = () => {
  return useMutation(ADD_BLACKLIST_MUTATION, {
    refetchQueries: [{ query: GET_COMMENT_BLACKLISTS_QUERY }],
  });
};