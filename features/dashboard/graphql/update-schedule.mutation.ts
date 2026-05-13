// features/dashboard/graphql/update-schedule.mutation.ts
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type { ContentSchedule, UpdateContentScheduleInput } from './schedule.types';

export const UPDATE_SCHEDULE_MUTATION = gql`
  mutation UpdateContentSchedule($id: ID!, $input: UpdateContentScheduleInput!) {
    updateContentSchedule(id: $id, input: $input) {
      id
      title
      status
      scheduledUpload
    }
  }
`;

export const useUpdateSchedule = () => {
  return useMutation<
    { updateContentSchedule: ContentSchedule },
    { id: string; input: UpdateContentScheduleInput }
  >(UPDATE_SCHEDULE_MUTATION);
};