import { state } from "$lib/store";
import { redirect } from "@sveltejs/kit";
import toast from "svelte-french-toast";

export const load = async () => {
    try {
        // Check if User is signed in
        const account = await state.checkLoggedIn();

        // Check if User account is verified
        if(!account.emailVerification) {
            toast.error('Please verify your account');
            throw redirect(307, '/user/profile');
        }

        // User is authorized to proceed
        console.info('Access Granted. ');
    } catch (error:any) {
        console.warn('Access Denied: ',error.message);
        throw redirect(307,'/pets');
        
    }
}
