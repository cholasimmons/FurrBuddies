export const load = async ({ url }) => {
    const { pathname } = url;
    const appName = "Furr Buddies";

    return { pathname, appName };
}