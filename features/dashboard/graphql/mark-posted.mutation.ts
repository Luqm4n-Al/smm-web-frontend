// features/dashboard/graphql/mark-posted.mutation.ts
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type { ContentSchedule } from './schedule.types';

export const MARK_POSTED_MUTATION = gql`
  mutation MarkContentScheduleAsPosted($id: ID!) {
    markContentScheduleAsPosted(id: $id) {
      id
      status
    }
  }
`;

export const useMarkAsPosted = () => {
  return useMutation<
    { markContentScheduleAsPosted: ContentSchedule },
    { id: string }
  >(MARK_POSTED_MUTATION);
};