import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

export const ADD_BLACKLIST_MUTATION = gql `
    mutation AddCommentBlackList($input: CommentBlackListInput!) {
        addCommentBlackList(input: $input) {
            id
            word
        }
    }
`;

export const useAddBlacklistMutation = () => {
    return useMutation(ADD_BLACKLIST_MUTATION);
}