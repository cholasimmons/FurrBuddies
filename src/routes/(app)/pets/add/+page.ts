import { state } from "$lib/_stores/auth_store";
import { redirect } from "@sveltejs/kit";
import toast from "svelte-french-toast";

export const load = async () => {
    try {
        // Check if User is signed in
        await state.checkLoggedIn();
        
        // Check if User account is verified
        if(!state.checkVerificationStatus()) {
            toast.error('Please verify your account');
            throw redirect(307, '/user/profile');
        }

        // User is authorized to proceed
        console.info('Access Granted. ');
    } catch (error:any) {
        console.warn('Access Denied: ',error);
        throw redirect(307,'/pets');
    }
}
