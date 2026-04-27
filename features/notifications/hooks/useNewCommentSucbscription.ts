// features/notifications/hooks/useNewCommentSubscription.ts
import { gql } from '@apollo/client';
import { useSubscription } from '@apollo/client/react';

const NEW_COMMENT_SUBSCRIPTION = gql`
  subscription NewComment {
    newComment {
      id
      text
      author {
        name
      }
    }
  }
`;

export function useNewCommentSubscription() {
  const { data, loading, error } = useSubscription(NEW_COMMENT_SUBSCRIPTION);

  return {
    newComment: data?.newComment,
    isLoading: loading,
    isError: error,
  };
}