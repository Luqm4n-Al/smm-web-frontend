import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { ChangePasswordInput } from "./auth.types";

export const CHANGE_PASSWORD_MUTATION = gql`
    mutation ChangePassword($input: ChangePasswordInput!) {
        changePassword(input: $input)
    }
`;

export const useChangePasswordMutation = () => {
    return useMutation<{ changePassword: boolean }, 
    { input: ChangePasswordInput }>(CHANGE_PASSWORD_MUTATION)
}