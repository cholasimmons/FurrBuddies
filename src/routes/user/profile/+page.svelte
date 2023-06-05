<script lang="ts">
	import { goto } from "$app/navigation";
	import ProfileEditForm from "$lib/_components/forms/ProfileEditForm.svelte";
	import { state, userbucketstate } from "$lib/store";
	import { modalStore, type ModalComponent, type ModalSettings } from "@skeletonlabs/skeleton";
	import { Permission, Role } from "appwrite";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

    export let data;
    let initials: string|null = null;
    let imageURL: string|undefined = '';
    let file: URL|undefined;

    onMount(async ()=>{
        try {
            // state.checkLoggedIn();
            const init: URL = state.getInitials();
            file = await userbucketstate.getPreview($state.account?.prefs.photoID );
			
            initials = init.href;
        } catch (error) {
            console.log('Not logged in.',error);
            
        }
    });

    $: imageURL = file?.href ?? '';

    function managePhoto(): void {
        console.log('btn pressed');
    }

    function editProfile() {
        // Skeleton Form stuff
        const modalComponent: ModalComponent = {
            // Pass a reference to your custom component
            ref: ProfileEditForm,
            // Add the component properties as key/value pairs
            props: { name: $state.account?.name },
            // Provide a template literal for the default component slot
            slot: '<p>Skeleton</p>'
        };

        const modal: ModalSettings = {
            type: 'component',
            // Pass the component directly:
            component: modalComponent,
        };

        modalStore.trigger(modal);
    }

    

    
</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | User Profile</title>
	<meta name="description" content="Manage your Account" />
</svelte:head>

<!-- This will be the page that displays the logged in User's account details -->

<!-- HTML body -->
<main class="text-center  px-{data.padding}">
    <section class="mx-auto w-full mt-3 max-w-xl">
        <div hidden={!$state.account} in:fade={{ duration: 300 }} class="flex justify-center">
            <img on:click={managePhoto} on:keypress src={ imageURL ?? initials } alt='' class="w-32 h-32 rounded-full object-cover border-2 shadow-[0_1rem_1rem_rgba(0,0,0,0.2)] transition-transform hover:scale-110">
            <!--button class="btn  bg-surface-400 w-8 h-8 "><iconify-icon icon="mdi:cancel"></iconify-icon></button-->
        </div>
        
        <h3 class="title text-center mt-6 p-0 flex items-center justify-center gap-2 -mr-4">{$state.account?.name || 'Welcome Guest'}
            {#if $state._loading}
            <iconify-icon icon="line-md:loading-alt-loop"></iconify-icon>
            {:else}
                {#if $state.account}
                <iconify-icon icon={$state.account.emailVerification ? 'mdi:tick' : 'mdi:cancel'} class="text-lg {$state.account.emailVerification ? 'text-green-500' : 'text-red-500'}" title={$state.account && $state.account.emailVerification ? 'Verified Account' : 'Unverified Account'}></iconify-icon>
                {/if}
            {/if}
        </h3>

        <p class="text-500 m-0 p-0 text-sm">{$state.account?.email || ''}</p>

        {#if $state.account} <!-- If logged in -->
            <section class="my-8 py-6  bg-primary-300 bg-opacity-5 rounded-lg">
                <div class="flex flex-col items-center">
                    {#if $state.account?.emailVerification}
                    <button class="text-500 btn gap-3 hover:bg-white hover:bg-opacity-20" on:click={editProfile}><iconify-icon icon="mdi:edit"></iconify-icon>Edit Profile</button>
                    {:else}
                    <small class="font-light opacity-70">Your account is not verified, check your email for the activation link.</small>
                    <button class="text-500 btn gap-2 hover:bg-white hover:bg-opacity-20"><iconify-icon icon="mdi:email"></iconify-icon>Resend Activation Link</button>
                    {/if}
                </div>

                <div class="flex justify-evenly text-left">
                    <p hidden={!$state.account?.phone}><span>Phone: </span>{$state.account?.phone || ''}</p>
                    <p hidden={!$state.account?.roles}><span>Roles: </span>{$state.account?.roles || ''}</p>
                </div>
            </section>
        {/if}
        <div class="max-w-xl btn-group variant-ghost">
            <button disabled={$state.account !== null} on:click={()=>goto('/auth/login')} class="rounded-none text-success-400 btn ">Log In</button>
            <button disabled={$state.account !== null} on:click={()=>goto('/auth/register')} class="rounded-none text-primary-400 btn ">Sign Up</button>
            <button disabled={!$state.account} on:click={()=>goto('/auth/logout')} class="rounded-none text-red-400 btn">Log Out</button>
        </div>
    </section>
</main>


<style>
    div.circle {
        border: #b8a 5px solid;
        overflow: hidden;
        width: 8rem; height: 8rem;
        transition: scale 0.3s ease-in-out;
        text-align: center;position: relative;
    }
    div.circle:hover, div.circle:hover img{
        scale: 105%;
    }

    div.circle > img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 102%;
        height: 102%;
        object-fit: cover;
        transition: scale 0.3s ease-in-out;
    }
    /* Adds a question mark when profile image unavailable
    .circle::before {
        content: '?';
        position: absolute;
        top: 55%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        color: #b8a;
    } */
</style>