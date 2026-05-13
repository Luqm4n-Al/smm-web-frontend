import { gql} from '@apollo/client';
import { useMutation } from '@apollo/client/react';

interface ForgotPasswordInput {
  email: string;
  phone: string;
}

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      email
      phone
    }
  }
`;

export const useForgotPasswordMutation = () => {
  return useMutation<
    { forgotPassword: { email: string; phone: string } },
    { input: ForgotPasswordInput }
  >(FORGOT_PASSWORD_MUTATION);
};