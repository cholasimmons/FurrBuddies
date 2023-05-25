import { ID, type Models, Permission, Role, Query } from 'appwrite';
import { get, writable } from 'svelte/store';
import { sdk, server } from './appwrite';
import type { Gender, Pet } from './_models/pet-model';
import type { Account } from './_models/appwrite-model';
import type { Clinic } from './_models/clinic-model';

export type Alert = {
  color: string;
  message: string;
};

const createPets = () => {
  const { subscribe, update, set } = writable<Pet[]>([]);

  return {
    subscribe,
    fetch: async () => {
      const response: any = await sdk.database.listDocuments(server.database, server.collection_pets, [Query.orderDesc('')]);
      return set(response.documents);
    },
    addPet: async (name: string, gender: Gender, breed: string) => {
      const user = Role.user(get(state).account!.$id);
      console.log('User: ',user);
      if(!user)return;

      const pet = await sdk.database.createDocument<Pet>(
        server.database,
        server.collection_pets,
        ID.unique(),
        {
          name,
          gender,
          breed,
        },
        [
          Permission.read(user),
          Permission.update(user),
          Permission.delete(user),
        ]
      );
      return update((n) => [pet, ...n]);
    },
    removePet: async (pet: Pet) => {
      await sdk.database.deleteDocument(server.database, server.collection_pets, pet.$id);
      return update((n) => n.filter((t) => t.$id !== pet.$id));
    },
    updatePet: async (pet: Pet) => { // Partial<Pet>
      const user = Role.user(get(state).account!.$id);
      await sdk.database.updateDocument(
        server.database,
        server.collection_pets,
        pet.$id,
        pet,
        [
          Permission.read(user),
          Permission.update(user),
          Permission.delete(user),
        ]
      );
      return update((n) => {
        const index = n.findIndex((t) => t.$id === pet.$id);
        n[index] = {
          ...n[index],
          ...(<Pet>pet),
        };
        return n;
      });
    },
  };
};


const createClinics = () => {
  const { subscribe, update, set } = writable<Clinic[]>([]);

  return {
    subscribe,
    fetch: async () => {
      const response: any = await sdk.database.listDocuments(server.database, server.collection_clinics);
      return set(response.documents);
    },
    addClinic: async (name: string, city: string) => {
      const user = Role.user(get(state).account!.$id);
      // console.log('User: ',user);
      
      const clinic = await sdk.database.createDocument<Clinic>(
        server.database,
        server.collection_clinics,
        ID.unique(),
        {
          name,
          city,
        },
        [
          Permission.read('any'),
          Permission.update(user),
          Permission.delete(user),
        ]
      );
      return update((n) => [clinic, ...n]);
    },

    removeClinic: async (clinic: Clinic) => {
      await sdk.database.deleteDocument(server.database, server.collection_clinics, clinic.$id);
      return update((n) => n.filter((t) => t.$id !== clinic.$id));
    },
    updateClinic: async (clinic: Clinic) => { // Partial<Clinic>
      const user = Role.user(get(state).account!.$id);
      await sdk.database.updateDocument(
        server.database,
        server.collection_clinics,
        clinic.$id,
        clinic,
        [
          Permission.read('any'),
          Permission.update(user),
          Permission.delete(user),
        ]
      );
      return update((n) => {
        const index = n.findIndex((c) => c.$id === clinic.$id);
        n[index] = {
          ...n[index],
          ...(<Clinic>clinic),
        };
        return n;
      });
    },
  };
};


const createState = () => {
  const { subscribe, set, update } = writable({
    account: null as Account|null,
    alert: null as Alert|null,
    _loading: false
  });

  const setLoading = (isLoading: boolean)=>{
    update(state => ({...state, _loading: isLoading}));
  }

  return {
    subscribe,
    checkLoggedIn: async () => {
      setLoading(true);
      const account = await sdk.account.get();
      state.init(account);
      setLoading(false);
  },
    signup: async (email: string, password: string, name: string) => {
      setLoading(true);
      const result = await sdk.account.create('unique()', email, password, name);
      setLoading(false);
      return result;
    },
    login: async (email: string, password: string) => {
      setLoading(true);
      await sdk.account.createEmailSession(email, password);
      const user = await sdk.account.get();
      state.init(user);
      setLoading(false);
    },
    logout: async () => {
      setLoading(true);
      await sdk.account.deleteSession('current');
      state.init();
      setLoading(false);
    },
    alert: async (alert: Alert) =>
      update((n) => {
        n.alert = alert;
        return n;
      }),
    init: async (account: any = null) => {
      return set({ account, alert: null, _loading: false });
    },
  };
};

export const petstate = createPets();
export const clinicstate = createClinics();
export const state = createState();
