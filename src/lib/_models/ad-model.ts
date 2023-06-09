import type { Models } from "appwrite";

export type IAd = {
    imageID?: string;
    title?: string;
    details?: string;
    link?: string;
    isActive: boolean;
    isPublic: boolean;
} & Models.Document