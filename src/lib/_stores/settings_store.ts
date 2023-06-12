import { get, writable } from 'svelte/store';


interface ISettings {
    lightMode: boolean;
    scale: number;
    showLandingImage: boolean;
    landingImage: string;
    showCarousel: boolean;
}

// SETTINGS

const createSettingsStore = () => {
    const { subscribe, update, set } = writable<ISettings>({
        lightMode: false,
        scale: 1,
        showLandingImage: true,
        landingImage: '/images/welcome.jpg',
        showCarousel: false,
      });
  
    return {
        subscribe,
        update,
        setSettings: (key:string, value:any) => {
            update((settings:any) => {
                settings[key] = value;
                return settings;
            });
        },
        getSetting: (key: string) => {
            const settings: any =  get(appSettings);
            return settings[key];
        }
    }
}

export const appSettings = createSettingsStore();