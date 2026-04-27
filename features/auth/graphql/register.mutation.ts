import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import type { RegisterInput } from "./auth.types";

export const REGISTER_MUTATION = gql`
    mutation Register($input: RegisterInput!) {
        register(input: $input) {
            email
            username
            phone
        }
    }
`;

export const useRegisterMutation = () => {
    return useMutation<{ register: {
        email: string; 
        username: string; 
        phone: string } }, 
    { input: RegisterInput }>(REGISTER_MUTATION);
}