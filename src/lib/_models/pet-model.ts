import type { Models } from "appwrite/types/models";

export type IPet = {
    name: string;
    type: Type;
    breed?: string;
    gender?: Gender;
    dob?: Date;
    ownerID: string[];
    photoID?: string[];
  } & Models.Document;

  export enum Gender {
    UNSPECIFIED="UNSPECIFIED",
    MALE="MALE",
    FEMALE="FEMALE",
  }
  export enum Type {
    DOG="DOG",
    CAT="CAT",
    BIRD="BIRD",
    RABBIT="RABBIT",
    RODENT="RODENT",
    HORSE="HORSE",
  }