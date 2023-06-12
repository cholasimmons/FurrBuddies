import { state, userbucketstate } from "$lib/_stores/auth_store";
import { appSettings } from "$lib/_stores/settings_store.js";
import { getModeUserPrefers, setModeCurrent, setModeUserPrefers } from "@skeletonlabs/skeleton";

// Use app as SPA
export const prerender = false;
export const ssr = false;

export const load = async ({ url }) => {
    const { pathname } = url;
    const appName = "Furr Buddies";
    const padding = 6;
    const version = '0.7.0';

    return { pathname, appName, padding, version };
}