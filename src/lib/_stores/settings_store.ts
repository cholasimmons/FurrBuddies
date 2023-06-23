import { get, writable } from 'svelte/store';


interface ISettings {
    lightMode: boolean;
    scale: number;
    showLandingImage: boolean;
    landingImage: string;
    fallback_pet_image: string;
    fallback_pet_icon: string;
    showCarousel: boolean;
    app: {
        name: string;
        short_name: string;
        version: string;
        mascot_dark: string;
        mascot_light: string;
    },
    developer: {
        name: string;
        email: string;
        website: string;
    }
}

// SETTINGS

const createSettingsStore = () => {
    const { subscribe, update, set } = writable<ISettings>({
        lightMode: false,
        scale: 1,
        showLandingImage: true,
        landingImage: '/images/welcome.jpg',
        fallback_pet_image: '/images/FurrPrints.webp',
        fallback_pet_icon: '/icons/FurrPrints.svg',
        showCarousel: false,
        app: {
            name: 'Furr Buddies',
            short_name: 'Buddies',
            version: '0.8.1',
            mascot_dark: '/icons/FurrBuddy2.webp',
            mascot_light: '/icons/FurrBuddy.webp',
        },
        developer: {
            name: 'Frank Simmons',
            email: 'frank@simmons.studio',
            website: 'https://simmons.studio'
        }
      });
  
    return {
        subscribe,
        update,
        setSettings: (key:string, value:any) => {
            update((settings:any) => settings[key] = value);
        },
        getSetting: (key: string) => {
            const settings: any =  get(appSettings);
            return settings[key];
        }
    }
}

export const appSettings = createSettingsStore();