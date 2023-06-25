import type { Models } from "appwrite/types/models";

export type IClinic = {
    name: string;
    areas: string[]; // Areas of operations. e.g: Ibex, Chilenje, Buchi, Chiwempala
    towns?: string[]; // List of town names for the above areas e.g: Lusaka, Kitwe, Chingola. maybe automatically entered?
    latlong?: number[];
    hours_sun?: Date[]; // Must all be in pairs, opening - closing
    hours_mon?: Date[];
    hours_tue?: Date[];
    hours_wed?: Date[];
    hours_thu?: Date[];
    hours_fri?: Date[];
    hours_sat?: Date[];
    email: string[];
    phone: number[];
    address?: string;
    ownerID: string;
    ownerName: string;
    photoID: string[];
    isActive: boolean;
    registrationID: string;
    serviceTitle: string[];
    serviceDescription: string[]; // Always ensure to edit them at the same time with serviceTitle
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