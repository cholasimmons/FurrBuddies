import type { Models } from "appwrite/types/models";

export type IPet = {
    name: string;
    type: Type;
    breed?: string;
    gender?: Gender;
    dob?: string;
    ownerID: string[];
    photoID?: string[];
  } & Models.Document;


	export enum Gender {
		UNSPECIFIED = "Unspecified",
		MALE = "Male",
		FEMALE = "Female",
	}
  export enum Type {
    DOG="Dog",
    CAT="Cat",
    BIRD="Bird",
    RABBIT="Rabbit",
    RODENT="Rodent",
    HORSE="Horse",
  }