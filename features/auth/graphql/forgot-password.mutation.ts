import { gql} from '@apollo/client';
import { useMutation } from '@apollo/client/react';

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      email
      phone
    }
  }
`;

export const useForgotPasswordMutation = () => {
  return useMutation<{ forgotPassword: { email: string; phone: string } }, { input: { email: string; phone: string } }>(FORGOT_PASSWORD_MUTATION);
};