<script lang="ts">
	import { goto } from "$app/navigation";
	import { state } from "$lib/store";
	import { fade } from "svelte/transition";

    export let data;

    function managePhoto(): void {
        console.log('btn pressed');
    }
</script>

<svelte:head>
	<title>{data.appName} | User Profile</title>
	<meta name="description" content="Manage your Account" />
</svelte:head>

<!-- This will be the page that displays the logged in User's account details -->
<main class="flex flex-col justify-between items-center p-{data.padding}">
    <div hidden={!$state.account} class="circle">
        <img on:click={managePhoto} on:keypress src="" alt='' in:fade={{ duration: 300 }}>
    </div>
    
    <h3 class="title text-center mt-6 p-0 flex items-center gap-2">{$state.account?.name || 'Welcome Guest'}
        {#if $state._loading}
        <iconify-icon icon="line-md:loading-alt-loop"></iconify-icon>
        {:else}
        <iconify-icon icon={$state.account && $state.account.emailVerification ? 'mdi:tick' : 'mdi:cancel'} class="text-lg {$state.account && $state.account.emailVerification ? 'text-green-500' : 'text-red-500'}" title={$state.account && $state.account.emailVerification ? 'Verified Account' : 'Unverified Account'}></iconify-icon>
        {/if}
    </h3>
    <p class="text-500 m-0 p-0 text-sm">{$state.account?.email || ''}</p>

    <hr class="my-4">

    <p class="text-500 m-0 p-0">{$state.account?.phone || ''}</p>
    <p class="text-500 m-0 p-0">{$state.account?.roles || ''}</p>

    <div>
        
    </div>
    
    <div class="w-full flex justify-evenly gap-3">
        <button disabled={$state.account !== null} on:click={()=>goto('/auth/login')} class="text-success-400 btn variant-filled-success">Log In</button>
        <button disabled={$state.account !== null} on:click={()=>goto('/auth/register')} class="text-primary-400 btn variant-filled-warning">Sign Up</button>
        <button disabled={!$state.account} on:click={()=>goto('/auth/logout')} class="text-red-400 btn variant-filled-error">Log Out</button>
    </div>
    
</main>

<style>

    main div.circle {
        transition: scale 0.3s ease-in-out;
        text-align: center;position: relative;
    }
    main div.circle:hover, main div.circle:hover  img{
        scale: 105%;
    }
    div.circle{
        position: relative;
        width: 50%;
        padding-bottom:48%; /* Maintain 1:1 aspect ratio */
        border-radius: 50%;
        border: #b8a 5px solid;
        overflow: hidden;
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
    .circle::before {
        content: '?';
        position: absolute;
        top: 55%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        color: #b8a;
    }
</style>