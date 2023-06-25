import { state, userbucketstate } from "$lib/_stores/auth_store";
import { appSettings } from "$lib/_stores/settings_store.js";
import { getModeUserPrefers, setModeCurrent, setModeUserPrefers } from "@skeletonlabs/skeleton";

// Use app as SPA
export const prerender = false;
export const ssr = false;

export const load = async ({ url: any }) => {
    // const { pathname } = url;
    const padding = 6;

    return { padding };
}