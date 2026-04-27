import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

export const CHANGE_PHONE_MUTATION = gql`
  mutation ChangePhoneNumber($input: String!) {
    changePhoneNumber(input: $input)
  }
`;

export const useChangePhoneMutation = () => {
  return useMutation<{ changePhoneNumber: string }, { input: string }>(CHANGE_PHONE_MUTATION);
};