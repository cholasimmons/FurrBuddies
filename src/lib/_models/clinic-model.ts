import type { Models } from "appwrite/types/models";

export type Clinic = {
    name: string;
    city: string;
} & Models.Document