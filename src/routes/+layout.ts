import { state, userbucketstate } from "$lib/store";

// Use app as SPA
export const ssr = false;

export const load = async ({ url }) => {
    const { pathname } = url;
    const appName = "Furr Buddies";
    const padding = 6;

    return { pathname, appName, padding };
}