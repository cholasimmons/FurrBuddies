import { state } from "$lib/store";

export const load = async ({ url }) => {
    const { pathname } = url;

    try {
        await state.checkLoggedIn();
    } catch (error) {
        state.alert({ color: 'yellow', message: 'No User signed in'});
        console.warn('No signed in User.');
        console.log('Implement Toast notifications');   
    }

    return { pathname };
}