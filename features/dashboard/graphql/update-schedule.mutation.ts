// features/scheduling/graphql/update-schedule.mutation.ts
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

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
  return useMutation(UPDATE_SCHEDULE_MUTATION);
};