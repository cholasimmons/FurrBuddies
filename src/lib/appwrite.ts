import { Client as Appwrite, Databases, Account, Storage, Avatars, Functions } from 'appwrite';

const server = {
  endpoint: import.meta.env.VITE_APP_ENDPOINT.toString(),
  project: import.meta.env.VITE_APP_PROJECT.toString(),
  collection_pets: import.meta.env.VITE_APP_COLLECTION_PETS.toString(),
  collection_clinics: import.meta.env.VITE_APP_COLLECTION_CLINICS.toString(),
  vetcollection_clinics: import.meta.env.VITE_APP_VETCOLLECTION_CLINICS.toString(),
  vetcollection_applications: import.meta.env.VITE_APP_VETCOLLECTION_APPLICATIONS.toString(),
  vetcollection_vaccinations: import.meta.env.VITE_APP_VETCOLLECTION_VACCINATIONS.toString(),
  collection_mail: import.meta.env.VITE_APP_COLLECTION_MAIL.toString(),
  collection_ads: import.meta.env.VITE_APP_COLLECTION_CAROUSEL.toString(),
  database: import.meta.env.VITE_APP_DATABASE_ID.toString(),
  vetdb: import.meta.env.VITE_APP_VETDATABASE_ID.toString(),
  bucket_buddies: import.meta.env.VITE_APP_BUCKET_PETS.toString(),
  bucket_clinics: import.meta.env.VITE_APP_BUCKET_VETS.toString(),
  bucket_users: import.meta.env.VITE_APP_BUCKET_USERS.toString(),
};

const client = new Appwrite();
const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const functions = new Functions(client);
client.setEndpoint(server.endpoint).setProject(server.project);

const sdk = { account, database, storage, avatars, functions };
export { sdk, server };
