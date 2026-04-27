import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import type { RegisterInput } from "./auth.types";

export const RESEND_OTP_MUTATION = gql `
    mutation ResendOTP($input: RegisterInput!) {
        resendOTP(input: $input) {
            email
            username
            phone
        }
    }
`;

export const useResendOtpMutation = () => {
    return useMutation<{ resendOTP: { 
        email: string; 
        username: string; 
        phone: string } }, 
    { input: RegisterInput }>(RESEND_OTP_MUTATION);
}