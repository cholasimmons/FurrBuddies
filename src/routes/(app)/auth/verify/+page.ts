import { state } from "$lib/_stores/auth_store";
import { redirect } from "@sveltejs/kit";
import toast from "svelte-french-toast";

/** @type {import('./$types').PageLoad} */
export const load = async() => {

    try {
        // Check if User is signed in
        await state.checkLoggedIn();

        // Check if already verified
        if(state.checkVerificationStatus()){
            toast.success('You are already verified');
            history.back();
            throw new Error('Already verified');
        }

        // return { userId, secret, expire };

    } catch (error:any) {
        console.warn('Access Denied: ',error);
        toast.error('You are not permitted to view that link');
        throw redirect(307,'/auth/login');
    }
}