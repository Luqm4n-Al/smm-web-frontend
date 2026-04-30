import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { ContentSchedule } from "./schedule.types";

export const GET_CONTENT_SCHEDULES = gql `
    query GetContentSchedules {
        contentSchedules {
            id
            title
            caption
            fileUrl
            status
            scheduleUpload
            createdAt
        }
    }
`;

export const useGetContentSchedules = () => {
    return useQuery<{ contentSchedules: ContentSchedule[] }>(GET_CONTENT_SCHEDULES)
}