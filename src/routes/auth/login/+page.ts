import { goto } from "$app/navigation";
import { state } from "$lib/store";
import { redirect } from "@sveltejs/kit";
import toast from "svelte-french-toast";

export const load = async () => {
        try {
            await state.checkLoggedIn();
            // toast.success('Yey!');
            goto('/');
        } catch (error:any) {
            // state.alert({ color: 'red', message: error.message });
            console.warn(error.message);
        }
}