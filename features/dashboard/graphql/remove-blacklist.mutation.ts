import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

export const REMOVE_BLACKLIST_MUTATION = gql`
    mutation RemoveCommentBlackList($id: ID!) {
        removeCommentBlackList(id: $id)
    }
`;

export const useRemoveBlacklistMutation = () => {
    return useMutation(REMOVE_BLACKLIST_MUTATION);
};