import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import type { OTPInput } from "./auth.types";

export const VERIFY_OTP_MUTATION = gql`
    mutation VerifyOTP($input: OTPInput!) {
        verifyOTP(input: $input)
    }
`;

export const useVerifyOtpMutation = () => {
    return useMutation<
        { verifyOTP: string }, 
        { input: OTPInput }
    >(VERIFY_OTP_MUTATION);
};