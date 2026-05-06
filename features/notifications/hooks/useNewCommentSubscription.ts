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

interface NewCommentData {
  newComment: {
    id: string;
    text: string;
    author: {
      name: string;
    };
  };
}

export function useNewCommentSubscription() {
  const { data, loading, error } = useSubscription<NewCommentData>(NEW_COMMENT_SUBSCRIPTION);

  // ✅ Added error logging for debugging
  if (error && process.env.NODE_ENV === 'development') {
    console.error('❌ [NewComment Subscription] Error:', error.message);
  }

  return {
    newComment: data?.newComment,
    isLoading: loading,
    isError: error,
  };
}
