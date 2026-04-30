import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { PostFilter, PostAnalytics } from "./insight.types";

export const GET_POSTS_QUERY = gql `
    query GetPosts($filter: PostFilter) {
        posts(filter: $filter) {
            id
            platform
            caption
            fileUrl
            likeCount
            viewCount
            createdAt
            avgSentiment
        }
    }
`;

export const useGetPostsQuery = (filter: PostFilter) => {
    return useQuery<{ posts: PostAnalytics[] }>(GET_POSTS_QUERY, {
        variables: {filter}
    })
}