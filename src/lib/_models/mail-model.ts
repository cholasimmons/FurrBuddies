import type { Models } from "appwrite";

export type IMail = {
    id: string;
    message: string;
    title?: string;
    isRead: boolean;
    fromId: string;
    toId: string;
} & Models.Document