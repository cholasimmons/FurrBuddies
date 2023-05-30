export const load = async ({ url }) => {
    const { pathname } = url;
    const appName = "Furr Buddies";
    const padding = 6;

    return { pathname, appName, padding };
}