import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

export const VERIFY_FORGOT_OTP_MUTATION = gql`
  mutation VerifyOTPForgotPassword($input: OTPInput!) {
    verifyOTPForgotPassword(input: $input)
  }
`;

export const useVerifyForgotOtpMutation = () => {
  return useMutation<{ verifyOTPForgotPassword: string }, { input: { email: string; phone: string; otp: string } }>(VERIFY_FORGOT_OTP_MUTATION);
};