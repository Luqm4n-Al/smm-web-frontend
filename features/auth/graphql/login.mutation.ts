import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import type { LoginInput, TokenResponse } from "./auth.types";

export const LOGIN_MUTATION = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            access_token
            refresh_token
        }
    }
`;

export const useLoginMutation = () => {
    return useMutation<{ login: TokenResponse }, 
    { input: LoginInput }>(LOGIN_MUTATION);
}