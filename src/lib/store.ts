import { ID, type Models, Permission, Role, Query } from 'appwrite';
import { get, writable } from 'svelte/store';
import { sdk, server } from './appwrite';
import type { Gender, Pet, Type } from './_models/pet-model';
import type { Account } from './_models/appwrite-model';
import type { Clinic } from './_models/clinic-model';
import { splitNames } from './_utilities/split-names';

export type Alert = {
  color: string;
  message: string;
};

// PETS

const createPets = () => {
  const { subscribe, update, set } = writable<Pet[]|null>([]);

  return {
    subscribe,
    fetch: async () => {
      const userID = get(state).account!.$id;
      const role = Role.user(userID,'verified');
      if(!role)return;
  
      const response = await sdk.database.listDocuments(server.database, server.collection_pets,
        [ Query.orderDesc('')
        ]
      );
      return set(response.documents as any);
    },
    addPet: async (name:string, type: Type, gender: Gender, breed: string) => {
      const userID = get(state).account!.$id;
      const role = Role.user(userID);
      if(!role)return;

      const pet = await sdk.database.createDocument<Pet>(
        server.database,
        server.collection_pets,
        ID.unique(),
        {
          name,
          type,
          gender,
          breed,
          ownerID: [userID]
        },
        [
          Permission.read(role),
          Permission.update(role),
          Permission.delete(role),
        ]
      );
      // const petphoto = await sdk.storage.createFile(server.bucket_buddies,ID.unique(),photofile)
      // document.getElementById('uploader').files[0]
      update((n) => [pet, ...n!]);
      return pet;
    },

    removePet: async (pet: Pet) => {
      await sdk.database.deleteDocument(server.database, server.collection_pets, pet.$id);
      return update((n) => n!.filter((t) => t.$id !== pet.$id));
    },
    updatePet: async (pet: Pet, body: {[key:string]:any[]}) => { // Partial<Pet>
      const userID = get(state).account!.$id;
      const role = Role.user(userID);
      await sdk.database.updateDocument(
        server.database,
        server.collection_pets,
        pet.$id,
        body,
        [
          Permission.read(role),
          Permission.update(role),
          Permission.delete(role),
        ]
      );
      return update((n) => {
        const index = n!.findIndex((t) => t.$id === pet.$id);
        n![index] = {
          ...n![index],
          ...(<Pet>pet),
        };
        return n;
      });
    },
    clear: async () => {
      return set(null);
    },
  };
};

// VETS

const createClinics = () => {
  const { subscribe, update, set } = writable<Clinic[]>([]);

  return {
    subscribe,
    fetch: async () => {
      const response: any = await sdk.database.listDocuments(server.database, server.collection_clinics);
      return set(response.documents);
    },
    addClinic: async (name: string, city: string) => {
      const userId = get(state).account!.$id;
      const role = Role.user(userId);
      
      const application = await sdk.database.createDocument<Clinic>(
        server.database,
        server.collection_clinics,
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
      return update((n) => [application, ...n]);
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

// PHOTO STORAGE

const createPetPhoto = () => {
  const { subscribe, update, set } = writable([]);

  return {
    subscribe,
    fetch: async () => {
      const userId = get(state).account!.$id;
      const role = Role.user(userId, 'verified');
      if(!role){console.warn('User not verified');return;}
  
      try {
        const response: any = await sdk.storage.listFiles(server.bucket_buddies);
        // console.log('Bucket ', response);
        
        set(response.files);
      } catch (error) {
        console.error('Failed to fetch pet photos:', error);
      }
    },
    addPetPhoto: async (file: File) => {
      const userID = get(state).account!.$id;
      const role = Role.user(userID);
      if(!role)return;

      try {
        const photoBucket = await sdk.storage.createFile(
          server.bucket_buddies,
          ID.unique(),
          file,
          [
            Permission.read(role),
            Permission.update(role),
            Permission.delete(role),
          ]
        );
        update((photos) => [...photos]);
        return photoBucket;
      } catch (error) {
        console.error('Failed to add pet photo:', error);
        return null;
      }
    },
    getPreview: async (id: string) => {
      const userID = get(state).account!.$id;
      const role = Role.user(userID);
      if(!role)return;

      try {
        const photoPreview = await sdk.storage.getFilePreview(
          server.bucket_buddies,
          id, 320, undefined, undefined, 78
        );
        // console.log('Bucket response: ',photoPreview);
        return photoPreview;
      } catch (error) {
        console.error('Failed to retrieve preview photo:', error);
      }
    }
  }
}

// User Account state

const createState = () => {
  const { subscribe, set, update } = writable({
    account: null as Account|null,
    // alert: null as Alert|null,
    _loading: false
  });

  const setLoading = (isLoading: boolean)=>{
    update(state => ({...state, _loading: isLoading}));
  }
  return {
    subscribe,
    checkLoggedIn: async () => {
      setLoading(true);
        const account:any = await sdk.account.get();
        // console.log('account',account);
        state.init(account);
        setLoading(false);
        return account;
  },
    signup: async (email: string, password: string, name: string) => {
      setLoading(true);
      state.init();
      petstate.clear();
      const result = await sdk.account.create('unique()', email, password, name);
      setLoading(false);
      return result;
    },
    login: async (email: string, password: string) => {
      setLoading(true);
      state.init();
      petstate.clear();
      await sdk.account.createEmailSession(email, password);
      const session = await sdk.account.get();
      state.init(session);
      // setPrefs(await ...sdk.account.getPrefs());
      setLoading(false);
    },
    logout: async () => {
      setLoading(true);
      await sdk.account.deleteSession('current');
      state.init();
      petstate.clear();
      // setPrefs([]);
      setLoading(false);
    },
    updateUserPrefs: async (prefs: Models.Preferences) => {
      setLoading(true);
      const prfs = await sdk.account.getPrefs();
      await sdk.account.updatePrefs({...prfs, ...prefs});
      setLoading(false);
    },
    getUserPrefs(){
      return sdk.account.getPrefs();
    },
    /*
    alert: async (alert: Alert) =>
      update((n) => {
        n.alert = alert;
        return n;
      }),
    */
    getInitials(){
      const userName = get(state).account?.name;
      return sdk.avatars.getInitials(splitNames(userName??''));
    },
    init: async (account: any = null) => {
      return set({ account,_loading: false });
    },
  };
};

export const petstate = createPets();
export const petbucketstate = createPetPhoto();
export const clinicstate = createClinics();
export const state = createState();
