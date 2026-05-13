// features/dashboard/graphql/delete-schedule.mutation.ts
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

export const DELETE_SCHEDULE_MUTATION = gql`
  mutation DeleteContentSchedule($id: ID!) {
    deleteContentSchedule(id: $id)
  }
`;

export const useDeleteSchedule = () => {
  return useMutation<
    { deleteContentSchedule: boolean },
    { id: string }
  >(DELETE_SCHEDULE_MUTATION);
};
