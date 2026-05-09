// features/scheduling/graphql/mark-posted.mutation.ts
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

export const MARK_POSTED_MUTATION = gql`
  mutation MarkContentScheduleAsPosted($id: ID!) {
    markContentScheduleAsPosted(id: $id) {
      id
      status
    }
  }
`;

export const useMarkAsPosted = () => {
  return useMutation(MARK_POSTED_MUTATION);
};