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
        home_url: string;
        verification_url: string;
    },
    developer: {
        name: string;
        email: string;
        whatsapp: number;
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
            home_url: 'https://buddies.simmons.studio',
            verification_url: '/auth/verify'
        },
        developer: {
            name: 'Frank Simmons',
            email: 'frank@simmons.studio',
            whatsapp: 260969667697,
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