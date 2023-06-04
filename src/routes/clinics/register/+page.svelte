<script lang="ts">
	import { goto } from '$app/navigation';
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
	import { emailValidator } from '$lib/_utilities/validators';
	import { clinicstate, state } from '$lib/store.js';
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { field, form } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import toast from 'svelte-french-toast';
	import { fly } from 'svelte/transition';

    export let data;

    // "isLoading" type of boolean
    let _registering: boolean = false;
    let _uploadingPhoto: boolean = false;

    // svelte-forms form and validation = https://chainlist.github.io/svelte-forms/
    const fname = field('clinicname', '', [required()]);
    const fhq = field('clinichq', '', [required()]);
    const newClinicForm = form(fname,fhq);

    const modal: ModalSettings = {
        type: 'confirm',
        // Data
        title: 'Take note',
        body: 'You are about to register a Clinic, after the name has been approved you will be able to add more information to your Clinic such as working hours, photos, and manage the Clinic on Furr Buddies',
        // TRUE if confirm pressed, FALSE if cancel pressed
        response: (r: boolean) => console.log('response:', r),
    };

    // Sign Up with Appwrite :)
    const registerClinic = async () => {
        if (!$newClinicForm.valid) {
            return;
        }
        console.log('Trigger modal');
        
        modalStore.trigger(modal);
        /*
        try {
            _registering = true;
            await clinicstate.addClinic($fname.value, $fhq.value);
            // await state.login($femail.value, $fpassword.value);
            newClinicForm.clear;
            //goto("/");
            history.back();
        } catch (error: any) {
            // state.alert({ color: "red", message: error.message });
            toast.error(error.message, { style: "red" });
        } finally {
            _registering = false;
        }
        */
    };

</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | Create Clinic</title>
	<meta name="description" content="Add your health centre to the system" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">
    {#if $state.account?.$id && $state.account?.emailVerification}
        <p class="mt-0 text-center">
            Please fill in the form
        </p>

        <section class="flex justify-center">
            <div class="flex-grow flex flex-col max-w-lg justify-center">
                
                <form on:submit|preventDefault="{registerClinic}">
                    
                <!-- Clinic Name -->

                    <label class="block mt-6" for="clinicname"> Clinic Name</label>
                    <!-- svelte-ignore a11y-autofocus -->
                    <input id="clinicname" type="text" autofocus class:invalid={!$fname.valid} placeholder="Name of Clinic"
                        bind:value="{$fname.value}" />
                        {#if $newClinicForm.hasError('clinicname.required')}
                            <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-gray-300 text-right">The Clinic name is required</p>
                        {/if}

                <!-- Clinic Headquarters -->

                    <label class="block mt-6" for="clinichq"> Main Office</label>
                    <select
                        id="type" placeholder="City of Main Office" class:invalid={!$fhq.valid}
                        bind:value="{$fhq.value}">
                        <option value="Lusaka">Lusaka</option>
                        <option value="Kitwe">Kitwe</option>
                        <option value="Solwezi">Solwezi</option>
                        <option value="Livingstone">Livingstone</option>
                        <option value="Mpulungu">Mpulungu</option>
                        <option value="Kasama">Kasama</option>
                    </select>
                    {#if $newClinicForm.hasError('clinichq.required')}
                        <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-gray-300 text-right">Select a city</p>
                    {/if}


                <!-- Form Buttons (Clear Form & Submit) -->

                <div class="mt-6 flex justify-between items-center">
                    <button disabled={!$newClinicForm.dirty} on:click={newClinicForm.reset} type="reset">
                        Clear Form
                    </button>
                    <span class="flex items-center justify-center gap-4">{#if _uploadingPhoto}<LoadingClock />{/if}
                        <button disabled={!$newClinicForm.valid || _registering} class="btn variant-filled-warning" type="submit">
                            {#if _uploadingPhoto}Uploading Photo...{:else if _registering}Adding...{:else}Add{/if}
                        </button>
                    </span>
                </div>
            </form>
        </div>
        </section>
    {:else}
        <section class="h-full flex flex-col items-center justify-center">
            <h3 class="title">You need to be signed in to a verified account<br>to be able to register a new Clinic</h3>

            <button on:click={()=>goto('/auth/login')} class="my-6 btn variant-filled w-[10rem]">
                Log In
            </button>
        </section>
    {/if}
</main>

<style>
</style>