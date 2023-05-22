import type { Models } from "appwrite/types/models";

export type Pet = {
    name: string;
    breed?: string;
    gender: Gender;
  } & Models.Document;

  export enum Gender {
    UNSPECIFIED="UNSPECIFIED",
    MALE="MALE",
    FEMALE="FEMALE",
  }