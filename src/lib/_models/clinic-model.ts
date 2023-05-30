import type { Models } from "appwrite/types/models";

export type Clinic = {
    name: string;
    city: string[];
    userId: string;
    isApproved: boolean;

} & Models.Document