import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

export const CHANGE_FORGOTTEN_PASSWORD_MUTATION = gql`
  mutation ChangeForgotenPassword($input: ChangeForgotenPasswordInput!) {
    changeForgotenPassword(input: $input)
  }
`;

export const useChangeForgottenPasswordMutation = () => {
  return useMutation<{ changeForgotenPassword: string }, { input: { otp: string; password: string } }>(CHANGE_FORGOTTEN_PASSWORD_MUTATION);
};