// layout-service.ts

import { writable } from 'svelte/store';
import { state } from '$lib/_stores/auth_store';
import type { Models } from 'appwrite/types/models';
import { onMount } from 'svelte';

// Theme watcher
import { modeOsPrefers, modeUserPrefers, modeCurrent } from '@skeletonlabs/skeleton';

let loadedPrefs: Models.Preferences;

/*
onMount(async ()=>{
    console.info('Layout Service mounted!');

    try {
        loadedPrefs = await state.getUserPrefs();
    } catch (error) {
        console.warn('Unable to fetch User Prefs');
    }    
});
*/

// Create a writable store for managing global settings
export const layoutSettings = writable({
  isLightMode: false,
  textScale: 100,
  audioNotifications: true,
  pushNotifications: true,
});

// Function to update the layout settings
export function updateLayoutSettings(newSettings: [key: string, value:any ]) {
  layoutSettings.update(settings => {
    return { ...settings, ...newSettings };
  });
}
