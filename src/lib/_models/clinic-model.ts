import type { Models } from "appwrite/types/models";

export type IClinic = {
    name: string;
    city: string[];
    address?: string;
    location?: number;
    userId: string;
    isApproved: boolean;
} & Models.Document

export type IVetApplication = {
    name: string;
    city: string[];
    description?: string;
    photoID?: string[];
    servicesTitle?: string[];
    servicesDetail?: string[];
    userId: string;
    moderatorID?: string[];
    isApproved: boolean;
    approvedDate?: Date;
} & Models.Document