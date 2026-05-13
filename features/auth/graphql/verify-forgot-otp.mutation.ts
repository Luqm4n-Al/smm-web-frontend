import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type { OTPInput } from './auth.types';

export const VERIFY_FORGOT_OTP_MUTATION = gql`
  mutation VerifyOTPForgotPassword($input: OTPInput!) {
    verifyOTPForgotPassword(input: $input)
  }
`;

export const useVerifyForgotOtpMutation = () => {
  return useMutation<
    { verifyOTPForgotPassword: string },
    { input: OTPInput }
  >(VERIFY_FORGOT_OTP_MUTATION);
};