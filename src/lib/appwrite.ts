import { Client as Appwrite, Databases, Account } from 'appwrite';

const server = {
  endpoint: import.meta.env.VITE_APP_ENDPOINT.toString(),
  project: import.meta.env.VITE_APP_PROJECT.toString(),
  collection_pets: import.meta.env.VITE_APP_COLLECTION_PETS.toString(),
  collection_clinics: import.meta.env.VITE_APP_COLLECTION_CLINICS.toString(),
  collection_mail: import.meta.env.VITE_APP_COLLECTION_MAIL.toString(),
  database: import.meta.env.VITE_APP_DATABASE_ID.toString(),
};

const client = new Appwrite();
const account = new Account(client);
const database = new Databases(client);
client.setEndpoint(server.endpoint).setProject(server.project);

const sdk = { account, database };
export { sdk, server };
