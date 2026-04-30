import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { CommentBlackList } from "./insight.types";

export const GET_COMMENT_BLACKLISTS_QUERY = gql `
    query GetCommentBlacklistsQuery {
        commentBlackLists {
            id
            word
        }
    }
`;

export const useGetCommentBlackListsQuery = () => {
    return useQuery<{ commentBlackLists: CommentBlackList[] }>(GET_COMMENT_BLACKLISTS_QUERY);
};