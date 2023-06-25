<script lang="ts">
	import { goto } from "$app/navigation";
	import LoadingClock from "$lib/_components/icons/Loading_Clock.svelte";
	import { sdk } from "$lib/appwrite.js";
    import { state } from "$lib/_stores/auth_store.js";
	import { onMount } from "svelte";
    import { form, field } from 'svelte-forms';
    import { required, email, pattern } from 'svelte-forms/validators';
	import toast from "svelte-french-toast";
	import { fade, fly, scale, slide } from "svelte/transition";
	import { cubicIn, cubicInOut, cubicOut } from "svelte/easing";
	import { emailValidator } from "$lib/_utilities/validators";
	import { page } from "$app/stores";
	import { appSettings } from "$lib/_stores/settings_store.js";
	import type { AppwriteException } from "appwrite";
	import { redirect } from "@sveltejs/kit";

    export let data;

    // Holds verification error messages
    let errormessage: string = '';

    // Countdown timer before page redirects to home
    const timerSeconds: number = 3200;

    // URL to return to for verification
    const returnUrl: string = $appSettings.app.home_url+$appSettings.app.verification_url

    // "isLoading" type of boolean
    let _verifying: boolean = true;
    let _verifying2: boolean = true;
    let _isAuthenticated: boolean = false;

    const userId = $page.url.searchParams.get('userId');
    const secret = $page.url.searchParams.get('secret');
    const expire = $page.url.searchParams.get('expire');

    onMount(async ()=>{
        console.log('Expiry Stamp: ',expire);
        
        _verifying = true;
        try {
            if(!$state.account)
                await state.checkLoggedIn();

            if($state.account?.emailVerification === true){
                toast.error('Your account is already verified');
                errormessage = 'Your account is already verified 👌';
                throw new Error('Account already verified');
            }

            if(userId && secret){
                await sdk.account.updateVerification(userId,secret);
                _isAuthenticated = true;
                errormessage = 'Your account is now verified! 😎';
                toast.success('Your email has been verified');
                _verifying = false;
            }

            setTimeout(()=>{},timerSeconds*1000);
        } catch (error: any) {
            console.log('Unable to verify account.',error);
            errormessage = error.message;
            toast.error(error.message);
            _verifying = false;
        }

        // Trigger email verification function
        
    });

    async function newVerification() {
        _verifying = true;
        _verifying2 = true;
        try {
            errormessage = '';
            if($state.account?.emailVerification === true){
                toast.error('Your account is already verified');
                errormessage = 'Your account is already verified 👌';
                _verifying = false;
                _verifying2 = false;
                throw new Error('Account already verified');
            }
            await sdk.account.createVerification(returnUrl);
            errormessage = 'Check your email';
            _verifying = false;
            _verifying2 = false;
        } catch (error: any) {
            toast.error(error.message);
            _verifying = false;
            _verifying2 = false;
            throw redirect(302, '/')
        } 
    }

</script>

<!-- HTML head -->
<svelte:head>
	<title>{$appSettings.app.name} | Verify Account</title>
	<meta name="description" content="{$appSettings.app.name} verification" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">
    <!--h3 class="title text-center">Login</h3-->
    {#if !_verifying2}
    <p class="{ _verifying ? 'flex' : 'hidden'} justify-center items-center text-center">
        Please hold on as we verify your account.
    </p>
    {/if}

    <section class="flex flex-col items-center justify-center">
        <span class="text-2xl">{#if _verifying}<LoadingClock />{:else if !_verifying && _isAuthenticated }<iconify-icon icon="mdi:tick"></iconify-icon>{:else}<iconify-icon icon="mdi:cancel"></iconify-icon>{/if}</span>
        
        {#if !_verifying && _isAuthenticated }<span>Verification complete</span>{/if}
        
        {#if !_verifying }<span in:scale={{ duration: 300, easing: cubicInOut}}>Account Status: <span class="font-medium { _isAuthenticated ? 'text-success-600' : 'text-error-600'}">{ $state.account?.emailVerification ? 'Verified' : 'Unverified' }</span></span>{/if}

        <div class="min-w-[10rem] mt-6 p-8 bg-surface-700 bg-opacity-50 text-center flex flex-col items-center">
            {#if _verifying  }
                <span class="animate-ping">...</span>
            {:else}
                <span in:slide={{ duration: 300, delay:100, easing: cubicOut, axis: "y"}}>{ errormessage  }</span>
            {/if}
            <small class="{ !_verifying && !_isAuthenticated ? 'flex' : 'hidden' } text-center">
                <button on:click={newVerification} on:keypress>Click here to send a new verification email</button>
            </small>
        </div>
    </section>
</main>