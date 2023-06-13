<script lang="ts">
	import { goto } from '$app/navigation';
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
	import { emailValidator } from '$lib/_utilities/validators';
	import { clinicstate, state } from '$lib/_stores/auth_store.js';
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { field, form } from 'svelte-forms';
	import { email, min, required } from 'svelte-forms/validators';
	import toast from 'svelte-french-toast';
	import { fly, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

    export let data;

    // "isLoading" type of boolean
    let _registering: boolean = false;
    let _uploadingPhoto: boolean = false;

    // Registration response message
    let statusMessage: string = '';

    // svelte-forms form and validation = https://chainlist.github.io/svelte-forms/
    const fname = field('clinicname', '', [required(), min(12)]);
    const fhq = field('clinichq', '', [required()]);
    const fphysical = field('physicaladdress', '', [required(), min(12)]);
    const femail = field('clinicemail', $state.account?.email, [required(), email()]);
    const ftc = field('terms', false, [required()]);
    const newClinicForm = form(fname,fhq,fphysical,femail,ftc);

    const modal: ModalSettings = {
        type: 'confirm',
        // Data
        title: 'Take note',
        body: 'You are about to register a Veterinary Clinic, after this form has been approved, you shall be able to add more information to your Clinic such as contact details, location, working hours, services, photos, e.tc..',
        // TRUE if confirm pressed, FALSE if cancel pressed
        response: (r: boolean) => console.log('response:', r),
    };

    // Sign Up with Appwrite :)
    const registerClinic = async () => {
        if (!$newClinicForm.valid) return;

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

    $:account = $state.account;

</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | Create Clinic</title>
	<meta name="description" content="Add your health centre to the system" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">
    {#if account && account?.emailVerification}
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

                    <div class="flex gap-4">
                        <!-- Clinic Headquarters -->
                        <div class="flex-grow">
                            <label class="block mt-6" for="clinichq"> City with Main Office</label>
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
                        </div>

                        <div class="flex-grow">
                            <!-- Company Email -->
                            <label class="block mt-6" for="clinicemail"> Company Email</label>
                            <!-- svelte-ignore a11y-autofocus -->
                            <input id="clinicemail" type="text" class:invalid={!$femail.valid} placeholder="vet@clinics.zm"
                                bind:value="{$femail.value}" />
                                {#if $newClinicForm.hasError('clinicemail.required')}
                                    <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-gray-300 text-right">The Clinic name is required</p>
                                {/if}
                        </div>
                    </div>

                <!-- Physical Address -->
                    <label class="block mt-6" for="physical_address"> Physical Address</label>
                    <!-- svelte-ignore a11y-autofocus -->
                    <input id="physical_address" type="text" class:invalid={!$fphysical.valid} placeholder="Physical Address"
                        bind:value="{$fphysical.value}" />

                <!-- Legal -->
                    <section class="w-full flex p-2">
                        <span class="p-4">
                            <input type="checkbox" bind:value={$ftc.value} class="w-6">
                        </span>
                        <p class="opacity-50">I agree to the terms and conditions concerning Clinic registration and management</p>
                    </section>
                    <hr>
                    <div in:slide={{ duration: 800, easing: cubicOut, axis: 'y'}} class="{statusMessage ? 'flex flex-col' : 'hidden'} w-full h-[6rem] bg-surface-800 bg-opacity-80">
                        {statusMessage}
                    </div>


                <!-- Form Buttons (Clear Form & Submit) -->

                <div class="mt-6 flex justify-between items-center">
                    <button disabled={!$newClinicForm.dirty} on:click={newClinicForm.reset} type="reset">
                        Clear Form
                    </button>
                    <span class="flex items-center justify-center gap-4">{#if _uploadingPhoto}<LoadingClock />{/if}
                        <button disabled={!$newClinicForm.valid || _registering || !$fname.value.length || $ftc.value===false} class="btn variant-filled-warning" type="submit">
                            {#if _uploadingPhoto}Uploading Photo...{:else if _registering}Adding...{:else}Add{/if}
                        </button>
                    </span>
                </div>
            </form>
        </div>
        </section>
    {:else}
        <section class="h-full flex flex-col items-center justify-center mt-6">
            <iconify-icon icon="mdi:lock" class="text-2xl"></iconify-icon>
            <p class="text-lg">You need to be signed in and verified before you can proceed</p>

            {#if !account }
                <button on:click={()=>goto('/auth/login')} class="my-6 btn shadow-xl hover:shadow-none w-[10rem]">
                    Log In
                </button>
            {/if}
        </section>
    {/if}
</main>

<style>
</style>