import { goto } from "$app/navigation";
import { sdk } from "$lib/appwrite";
import { state } from "$lib/store";
import { redirect } from "@sveltejs/kit";
import toast from "svelte-french-toast";

export const load = async () => {
        try {
            // toast.success('Yey!');
            // goto('/');
        } catch (error:any) {
            // state.alert({ color: 'red', message: error.message });
            console.warn(error.message);
        }
}