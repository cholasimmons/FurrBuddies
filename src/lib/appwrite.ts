import { Client as Appwrite, Databases, Account, Storage } from 'appwrite';

const server = {
  endpoint: import.meta.env.VITE_APP_ENDPOINT.toString(),
  project: import.meta.env.VITE_APP_PROJECT.toString(),
  collection_pets: import.meta.env.VITE_APP_COLLECTION_PETS.toString(),
  collection_clinics: import.meta.env.VITE_APP_COLLECTION_CLINICS.toString(),
  collection_mail: import.meta.env.VITE_APP_COLLECTION_MAIL.toString(),
  database: import.meta.env.VITE_APP_DATABASE_ID.toString(),
  bucket_buddies: import.meta.env.VITE_APP_BUCKET_PETS.toString(),
  bucket_clinics: import.meta.env.VITE_APP_BUCKET_VETS.toString(),
  bucket_users: import.meta.env.VITE_APP_BUCKET_USERS.toString(),
};

const client = new Appwrite();
const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);
client.setEndpoint(server.endpoint).setProject(server.project);

const sdk = { account, database, storage };
export { sdk, server };
