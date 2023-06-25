<script lang="ts">
	import { goto } from '$app/navigation';
	import RightPage from '$lib/_components/RightPage.svelte';
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
	import { state } from '$lib/_stores/auth_store.js';
	import { appSettings } from '$lib/_stores/settings_store.js';

    export let data;

    let _loading: boolean = false;
</script>

<!-- HTML head -->
<svelte:head>
	<title>{$appSettings.app.name} | Messages</title>
	<meta name="description" content="About this app" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">
	<!-- Display "Adopt a Buddy" if User is logged in, otherwise prompted to log in -->
    <h3 class="title flex justify-between items-center">

        <!-- If logged in -->

        {#if $state.account?.$id && $state.account?.emailVerification}
        <button on:click|preventDefault={()=>goto('/pets/add')} type="button" class="btn btn-sm variant-ghost-warning">
            <span class=" flex items-center"><iconify-icon icon="mdi:paw"></iconify-icon></span><span>Add Buddy</span>
        </button>
        {:else}

        <!-- If not logged in -->

        <button on:click|preventDefault={()=>goto('/shelters/adopt')} type="button" class="btn btn-sm variant-ghost-success">
            <span class=" flex items-center"><iconify-icon icon="mdi:paw"></iconify-icon></span><span>Adopt a Buddy</span>
        </button>
        {/if}

        {#if _loading}<LoadingClock/>{/if}
    </h3>

    <!--p>Display goods from established stores and independent (but verified) sellers. Thanks Eva</p-->

    <svelte:component this={RightPage}></svelte:component>
</main>

<style>
    
</style>