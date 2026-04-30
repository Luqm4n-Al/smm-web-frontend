export type ScheduleStatus = 'DRAFT' | 'SCHEDULED' | 'POSTED';

export interface ContentSchedule {
    id: string;
    title: string;
    caption?: string | null;
    fileUrl?: string | null;
    status: ScheduleStatus;
    scheduleUpload?: string | null;
    createdAt: string;
}

export interface CreateContentScheduleInput {
    title:string;
    caption?: string;
    fileUrl?: string;
    scheduleUpload?: string; 
}