import { state } from "$lib/store";

export const load = async () => {
        try {
            await state.checkLoggedIn()
            history.back();
        } catch (error:any) {
            // state.alert({ color: 'red', message: error.message });
            // console.warn(error.message);
        }
}