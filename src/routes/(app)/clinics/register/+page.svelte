<script lang="ts">
	import { goto } from '$app/navigation';
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
	import { state } from '$lib/_stores/auth_store.js';
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { field, form } from 'svelte-forms';
	import { email, min, pattern, required } from 'svelte-forms/validators';
	import toast from 'svelte-french-toast';
	import { fly, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { appSettings } from '$lib/_stores/settings_store.js';
	import { onMount } from 'svelte';

    export let data;

    const regexPattern = /^\d{9,12}$/;


    // "isLoading" type of boolean
    let _loading: boolean = false;
    let _registering: boolean = false;
    let _uploadingPhoto: boolean = false;

    // Registration response message
    let statusMessage: string = '';

    onMount(async ()=>{
        _loading = true;
        try {
            if(!$state.account)
                await state.checkLoggedIn();
                _loading = false;
        } catch (error: any) {
            console.error(error.message);
            _loading = false;
        }
    });

    // svelte-forms custom validator
    function mustBeTrue() {
        return () => {
            return { valid: true, name: 'Please read our T\'s and C\'s' };
        };
    }

    // svelte-forms form and validation = https://chainlist.github.io/svelte-forms/
    const fname = field('name', '', [required(), min(3)]);
    const fregistration = field('registrationID', '', [required(), min(1)]);
    const fhqarea = field('areas', '', [required(), min(1)]);
    const fhqtown = field('towns', '', [required(), min(1)]);
    const faddress = field('address', '', [required(), min(12)]);
    const fowner_name = field('owner_name', $state.account?.name, [required(), min(1)]);
    const fowner_id = field('owner_id', $state.account?.$id, [required(), min(1)]);
    const femail = field('email', [$state.account?.email], [required(), email()]);
    const fphone = field('phone', [$state.account?.prefs?.phoneNumber], [required(), pattern(regexPattern)]);
    const ftc = field('terms', false, [required(), mustBeTrue()]);
    const newClinicForm = form(fname,fregistration,fhqarea,fhqtown,faddress,fowner_name,fowner_id,femail,fphone,ftc);

    const confirmmodal: ModalSettings = {
        type: 'confirm',
        // Data
        title: 'Take note',
        body: 'You are about to register a Veterinary Clinic, after this form has been approved you will be sent a request for payment whereafter you shall be able to add more information to your Clinic such as location, working hours, services, photos, e.tc..',
        // TRUE if confirm pressed, FALSE if cancel pressed
        response: (r: boolean) => r
    };

    // Sign Up with Appwrite :)
    const registerClinic = async () => {
        if (!$newClinicForm.valid) return;
        
        const response = modalStore.trigger(confirmmodal);
        console.log(response);
        
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
	<title>{$appSettings.app.name} | Create Clinic</title>
	<meta name="description" content="Add your health centre to the system" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">
    {#if $state.account && $state.account?.emailVerification}
        <p class="mt-0 text-center">
            Please fill in the form
        </p>

        <section class="mx-auto w-full">
            <form on:submit|preventDefault="{registerClinic}">
                
                <div class="grid grid-cols-3 gap gap-x-2">
                
                    <!-- Clinic Name -->
                    <div class="col-span-3">
                        <label class="block mt-6" for="clinicname"> Veterinary Clinic Name</label>
                        <!-- svelte-ignore a11y-autofocus -->
                        <input id="clinicname" type="text" autofocus class:invalid={!$fname.valid} placeholder="Name of Clinic"
                            bind:value="{$fname.value}" />
                            {#if $newClinicForm.hasError('name.required')}
                                <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-gray-300 text-left">Clinic name is required</p>
                            {/if}
                    </div>

                    <!-- Registration ID -->
                    <div class="col-span-3 md:col-span-1">
                        <label class="block mt-6" for="registration"> Registration ID</label>
                        <!-- svelte-ignore a11y-autofocus -->
                        <input id="registration" type="text" class:invalid={!$fregistration.valid} placeholder="Registration Number"
                            bind:value="{$fregistration.value}" />
                    </div>

                    <!-- Owner Name -->
                    <div class="col-span-3 md:col-span-2">
                        <label class="block mt-6" for="ownername"> Owner Name</label>
                        <!-- svelte-ignore a11y-autofocus -->
                        <input id="ownername" type="text" class:invalid={!$fowner_name.valid} placeholder="Name of Clinic Owner"
                            bind:value="{$fowner_name.value}" />
                    </div>

                    <!-- Clinic Area -->
                    <div class="col-span-3 md:col-span-2">
                        <label class="block mt-6" for="area"> Area</label>
                        <input type="text" id="area" placeholder="Chelston, Ibex, Buchi" class:invalid={!$fhqarea.valid}
                            bind:value="{$fhqarea.value}">
                    </div>
                    
                    <!-- Clinic Town -->
                    <div class="col-span-3 md:col-span-1">
                        <label class="block mt-6" for="clinichq"> City</label>
                        <select
                            id="clinichq" placeholder="City of Main Office" class:invalid={!$fhqtown.valid}
                            bind:value="{$fhqtown.value}">
                            <option value="Lusaka">Lusaka</option>
                            <option value="Kitwe">Kitwe</option>
                            <option value="Solwezi">Solwezi</option>
                            <option value="Livingstone">Livingstone</option>
                            <option value="Mpulungu">Mpulungu</option>
                            <option value="Kasama">Kasama</option>
                        </select>
                    </div>
                    
                    <!-- Company Email -->
                    <div class="col-span-3 md:col-span-2">
                        <label class="block mt-6" for="clinicemail"> Company Email</label>
                        <!-- svelte-ignore a11y-autofocus -->
                        <input id="clinicemail" type="text" class:invalid={!$femail.valid} placeholder="vet@clinics.zm"
                            bind:value="{$femail.value}" />
                    </div>

                    <!-- Company Phone -->
                    <div class="col-span-3 md:col-span-1">
                        <label class="block mt-6" for="clinicphone"> Phone Number</label>
                        <!-- svelte-ignore a11y-autofocus -->
                        <input id="clinicphone" type="text" class:invalid={!$fphone.valid} placeholder="260 969 667697"
                            bind:value="{$fphone.value}" />
                    </div>

                    <!-- Physical Address -->
                    <div class="col-span-3">
                        <label class="block mt-6" for="address"> Physical Address</label>
                        <!-- svelte-ignore a11y-autofocus -->
                        <input id="address" type="text" class:invalid={!$faddress.valid} placeholder="Physical Address"
                            bind:value="{$faddress.value}" />
                    </div>

                    <!-- Legal -->
                    <section class="col-span-3 p-2 pl-0 flex items-center">
                        <span class="p-4 pl-0">
                            <input type="checkbox" bind:value={$ftc.value} class="w-6">
                        </span>
                        <p class="opacity-50"><a href="/legal/terms/vets#registration">I agree to the terms and conditions concerning Clinic registration and management</a></p>
                        <hr>
                    </section>
                    
                    <div in:slide={{ duration: 800, easing: cubicOut, axis: 'y'}} class="{statusMessage ? 'flex flex-col' : 'hidden'} w-full h-[6rem] bg-surface-800 bg-opacity-80">
                        {statusMessage}
                    </div>

                <!-- Form Buttons (Clear Form & Submit) -->

                <div class="col-span-3 mt-6 flex justify-between items-center">
                    <button disabled={!$newClinicForm.dirty} on:click={newClinicForm.reset} type="reset">
                        Clear Form
                    </button>
                    <span class="flex items-center justify-center gap-4">
                        {#if _uploadingPhoto}<LoadingClock />{/if}
                        <button disabled={ !$newClinicForm.valid || !$ftc.value || _registering } class="btn variant-filled-warning" type="submit">
                            {#if _registering}Applying...{:else}Apply{/if}
                        </button>
                    </span>
                </div>
                </div>
            </form>
        </section>
    {:else}
        <section class="h-full flex flex-col items-center justify-center mt-6">
            <iconify-icon icon="mdi:lock" class="text-2xl"></iconify-icon>
            <p class="text-lg">You need to be signed in and verified before you can proceed</p>

            {#if !$state.account }
                <button on:click={()=>goto('/auth/login')} class="my-6 btn shadow-xl hover:shadow-none w-[10rem]">
                    Log In
                </button>
            {/if}
        </section>
    {/if}
</main>

<style>
</style>