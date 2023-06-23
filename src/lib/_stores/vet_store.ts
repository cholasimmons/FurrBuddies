import { ID, type Models, Permission, Role, Query } from 'appwrite';
import { get, writable } from 'svelte/store';
import { sdk, server } from '../appwrite';
import type { IClinic } from '../_models/clinic-model';
import { removePrefix, getFirstName } from '../_utilities/split-names';
import type { IAd } from '../_models/ad-model';
import { state } from './auth_store';

// VETS

const createClinics = () => {
  const { subscribe, update, set } = writable<IClinic[]>([]);

  return {
    subscribe,
    fetch: async () => {
      const response: any = await sdk.database.listDocuments(server.database, server.vetcollection_clinics);
      return set(response.documents);
    },
    addVet: async (name: string, city: string) => {
      const userId = get(state).account!.$id;
      const role = Role.user(userId);
      
      const application = await sdk.database.createDocument<IClinic>(
        server.database,
        server.vetcollection_clinics,
        ID.unique(),
        {
          name,
          city,
          userId
        },
        [
          Permission.read('any'),
          Permission.update(role),
          Permission.delete(role),
        ]
      );
      update((n) => [application, ...n]);
    },

    removeVet: async (clinic: IClinic) => {
      await sdk.database.deleteDocument(server.database, server.vetcollection_clinics, clinic.$id);
      update((n) => n.filter((t) => t.$id !== clinic.$id));
    },
    updateVet: async (clinic: IClinic) => { // Partial<Clinic>
      const user = Role.user(get(state).account!.$id);
      await sdk.database.updateDocument(
        server.database,
        server.vetcollection_clinics,
        clinic.$id,
        clinic,
        [
          Permission.read('any'),
          Permission.update(user),
          Permission.delete(user),
        ]
      );
      update((n) => {
        const index = n.findIndex((c) => c.$id === clinic.$id);
        n[index] = {
          ...n[index],
          ...(<IClinic>clinic),
        };
        return n;
      });
    },
  };
};

// VET PHOTOS

const createImageState = () => {
  const { subscribe, update, set } = writable<IAd[]>([]);

  return {
    subscribe,
    fetch: async () => {
      const verifiedUser = get(state).account?.emailVerification || false;

      try {
        const response: any = await sdk.database.listDocuments(server.database, server.collection_ads, [
          Query.limit(10)
        ]);
        // console.log('Ads: ',response.documents);
        
        set(response.documents);
      } catch (error) {
        console.info('Error querying ads.',error)
      }
    },
  }
}

// VET APPLICATIONS

const createVetApplications = () => {
  const { subscribe, update, set } = writable<IClinic[]>([]);

  return {
    subscribe,
    /*fetch: async () => {
      const response: any = await sdk.database.listDocuments(server.database, server.vetcollection_clinics);
      return set(response.documents);
    },*/
    sendApplication: async (name: string, city: string) => {
      const userId = get(state).account?.$id;
      if(!userId) return;
      const role = Role.user(userId);
      if(!role) return;

      const application = await sdk.database.createDocument<IClinic>(
        server.database,
        server.vetcollection_applications,
        ID.unique(),
        {
          name,
          city,
          userId
        },
        [
          Permission.create(role),
          Permission.read('any'),
          Permission.update('Admin'),
        ]
      );
      update((n) => [application, ...n]);
    },

    viewApplicationStatus: async (appId: string) => {
      const userId = get(state).account?.$id;
      if(!userId) return;
      const role = Role.user(userId);
      if(!role) return;

      // Check if a particular application is "isApproved" or "isRejected" - and why

      const application = await sdk.database.getDocument<IClinic>(
        server.database,
        server.vetcollection_applications,
        appId,
        [
          Permission.read('any'),
        ]
      );
      update((n) => [application, ...n]);
    },
  };
};


export const vetstate = createClinics();
export const vetapplicationstate = createVetApplications();
export const vetphotostate = createImageState();
