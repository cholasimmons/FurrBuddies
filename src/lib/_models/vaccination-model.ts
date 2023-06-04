import type { Models } from "appwrite";

export type IVaccinations = {
    id: string;
    petID: string;
    clinicID: string;
    vaccine: string;
    batchNo: string;
    diseases: string[];
    vaccinationDate: Date;
    nextDueDate: Date;
    petWeight: number; // in Kilo's
} & Models.Document;
