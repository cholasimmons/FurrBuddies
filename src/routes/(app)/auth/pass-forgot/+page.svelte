<script lang="ts">
	import { goto } from '$app/navigation';
	import { appSettings } from '$lib/_stores/settings_store.js';
	import { sdk } from '$lib/appwrite.js';
    import { form, field } from 'svelte-forms';
    import { required, email, pattern } from 'svelte-forms/validators';
	import toast from 'svelte-french-toast';
	import { fly } from 'svelte/transition';

    export let data;

    const resetPasswordEndpoint = 'https://buddies.simmons.studio/auth/pass-reset';

    // "isLoading" type of boolean
    let _sending: boolean = false;

    // svelte-forms form and validation = https://chainlist.github.io/svelte-forms/
    const femail = field('email', '', [required(), email()]);
    const resetForm = form(femail);

    // Forgotten password function
    const requestLink = async () => {
        if (!$resetForm.valid) {
            return;
        }
        try {
            _sending = true;
            await sdk.account.createRecovery($femail.value, resetPasswordEndpoint)
            toast.success('Password reset link sent to your email 😎');
            resetForm.reset();
            goto("/", {replaceState: true});
            _sending = false;
        } catch (error: any) {
            // state.alert({ color: "red", message: error.message });
            toast.error(error.message, { style: "red" });
            _sending = false;
        }
    };
</script>

<!-- HTML head -->
<svelte:head>
	<title>{$appSettings.app.name} | Forgotten Password</title>
	<meta name="description" content="Request for a password reset link" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">
    <h3 class="title text-center">Forgotten Password</h3>
    <p class="mt-0 text-center">Enter your email address to receive a password reset link</p>

    <section class="flex justify-center">
        <div class="flex-grow flex flex-col max-w-lg justify-center">

            <form on:submit|preventDefault={requestLink}>

            <!-- User Email-->

                <label class="block mt-6" for="email"> Email Address</label>
                <input id="email" type="text" class:invalid={!$femail.valid} placeholder="yourname@email.add"
                    bind:value="{$femail.value}"/>
                <p class="text-gray-300 text-right">&nbsp;
                    {#if !$femail.valid && $femail.value}
                        <span in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }}>Not a valid email address.</span>
                    {/if}</p>

            <!-- Form Buttons (Clear Form & Submit) -->

                <div class="mt-6 flex justify-between">
                    <button disabled={!$resetForm.dirty} on:click={resetForm.reset} type="reset">
                        Clear Form
                    </button>
                    <button disabled={!($resetForm.valid && $femail.value) || _sending} class="btn btn-sm variant-filled-warning" type="submit">
                        {#if _sending}Requesting{:else}Request{/if} 
                    </button>
                </div>
            </form>
        </div>
    </section>
</main>
