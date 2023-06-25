<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { appSettings } from '$lib/_stores/settings_store.js';
	import { sdk } from '$lib/appwrite.js';
    import { form, field } from 'svelte-forms';
    import { required, pattern, matchField } from 'svelte-forms/validators';
	import toast from 'svelte-french-toast';
	import { fly } from 'svelte/transition';

    export let data;

    // "isLoading" type of boolean
    let _resetting: boolean = false;

    // Minimum of 6 alphabetic characters with at least 1 uppercase letter
    const regExPattern1 = /^(?=.*[A-Z]).{6,}$/;
    // Minimum of 6 alphanumeric characters with at least 1 uppercase letter
    const regExPattern2 = /^(?=.*[A-Z])[a-zA-Z0-9]{6,}$/;
    // Minimum of 6 alphanumeric characters, at least 1 uppercase letter,
    // and allows (or not) the use of any non-alphanumeric characters
    const regExPattern3 = /^(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*()-_+=~`[\]{}|\\:;"'<>,.?/]{6,}$/;

    // svelte-forms form and validation = https://chainlist.github.io/svelte-forms/
    const fpassword = field('password', '', [required(), pattern(regExPattern3)]);
    const fpassword2 = field('confirmpassword', '', [required(), matchField(fpassword)]);
    const resetForm = form(fpassword);

    // Reset password function
    const resetPassword = async () => {
        if (!$resetForm.valid) {
            return;
        }
        try {
            _resetting = true;
            await sdk.account.updateRecovery($page.params.userId,$page.params.secret,$fpassword.value, $fpassword2.value)
            toast.loading('Your password has been changed!');
            resetForm.reset();
            goto("/");
            _resetting = false;
        } catch (error: any) {
            // state.alert({ color: "red", message: error.message });
            toast.error(error.message, { style: "red" });
            _resetting = false;
        }
    };
</script>

<!-- HTML head -->
<svelte:head>
	<title>{$appSettings.app.name} | Password Reset</title>
	<meta name="description" content="Securely reset your {$appSettings.app.name} password" />
</svelte:head>

<!-- HTML body -->
<main>
    <h3 class="title text-center">Password Reset</h3>
    <p class="mt-0 text-center">
        Enter your new password</p>

    <section class="flex justify-center">
        <div class="flex-grow flex flex-col max-w-lg justify-center">

            <form on:submit|preventDefault={resetPassword}>

            <!-- User Password-->

                <label class="block mt-6" for="password"> Password</label>
                <input id="password" type="password" class:invalid={!$fpassword.valid} placeholder="passWORD"
                    bind:value="{$fpassword.value}" />
                    <div class="h-6">
                    {#if !$fpassword.valid && $fpassword}
                        <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-gray-300 text-right m-0"
                        >Minimum 6 characters, at least one uppercase letter.</p>
                    {/if}</div>

            <!-- User Confirmation Password-->

                <label class="block mt-6" for="password2"> Confirm Password</label>
                <input id="password2" type="password2" class:invalid={!$fpassword2.valid} placeholder="passWORD"
                    bind:value="{$fpassword2.value}" />
                    <div class="h-6">
                    {#if $fpassword2.valid && $fpassword2}
                        <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-gray-300 text-right m-0"
                        >It's a match!!</p>
                    {/if}</div>

            <!-- Form Buttons (Clear Form & Submit) -->

                <div class="mt-6 flex justify-between">
                    <button disabled={!$resetForm.dirty} on:click={resetForm.reset} type="reset">
                        Clear Form
                    </button>
                    <button disabled={!($resetForm.valid && $fpassword.value) || _resetting} class="btn btn-sm variant-filled-warning" type="submit">
                        {#if _resetting}Resetting{:else}Reset{/if} 
                    </button>
                </div>
            </form>
        </div>
    </section>
</main>