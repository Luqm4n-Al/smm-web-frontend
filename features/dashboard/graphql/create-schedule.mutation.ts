import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import type { ContentSchedule, CreateContentScheduleInput } from "./schedule.types";

export const CREATE_SCHEDULE = gql `
    mutation CreateContentSchedule($input: CreateContentScheduleInput!) {
        createContentSchedule(input: $input) {
            id
            title
            status
            scheduledUpload
            createdAt
        }
    }
`;

export const useCreateSchedule = () => {
    return useMutation<{ createContentSchedule: ContentSchedule }, { input: CreateContentScheduleInput}>(CREATE_SCHEDULE)
}