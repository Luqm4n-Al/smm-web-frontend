// features/auth/graphql/firebase-login.mutation.ts
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type { TokenResponse } from './auth.types';

export const FIREBASE_LOGIN_MUTATION = gql`
    mutation FirebaseLogin($input: String!) {
        firebaseLogin(input: $input) {
            access_token
            refresh_token
        }
    }
`;

export const useFirebaseLoginMutation = () => {
    return useMutation<
        { firebaseLogin: TokenResponse },
        { input: string }
    >(FIREBASE_LOGIN_MUTATION);
};
