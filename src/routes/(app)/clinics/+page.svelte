<script lang="ts">
	import { vetstate } from "$lib/_stores/vet_store.js";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
    import 'iconify-icon';
	import LoadingClock from "$lib/_components/icons/Loading_Clock.svelte";
	import { goto } from "$app/navigation";
	import ClinicCard from "$lib/_components/ClinicCard.svelte";
	import { appSettings } from "$lib/_stores/settings_store.js";
	import { state } from "$lib/_stores/auth_store.js";

    export let data;

    // "isLoading" type of boolean
    let _loading: boolean = false;

    // Layout data
    let isGrid: boolean = true;

    onMount(async ()=>{
        _loading = true;
        try {
            await vetstate.fetch();
            _loading = false;
        } catch (error: any) {
            console.warn('Error loading Clinics. ', error.message);
            _loading = false;
        }
    });

    $: grid = isGrid;

</script>

<!-- HTML head -->
<svelte:head>
	<title>{$appSettings.app.name} | Clinics</title>
	<meta name="description" content="A public list of available health specialists" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">

    <h3 class="title flex justify-between items-center">
        <!-- Left Panel -->
        <div class="flex items-center gap-2 min-h-[1.5rem]">
            {#if $vetstate.length}
            <button in:fade={{ duration:100, delay:100}} hidden={!$vetstate.length} on:click|preventDefault={()=>goto('/clinics/register')} type="button" class="btn btn-sm variant-filled-secondary">
                <span class=" flex items-center"><iconify-icon icon="mdi:hospital"></iconify-icon></span>
                <span>Own a Clinic?</span>
            </button>
            {/if}
            {#if _loading}<span in:fade={{duration:800}} out:fade={{duration:800}}><LoadingClock /></span>{/if}
        </div>

        <!-- Right Panel -->
        <div class="flex items-center gap-2 ">
            {#if $vetstate.length && $vetstate.length < 1}
            <button class="btn-icon btn-icon-lg" type="button"><iconify-icon icon="mdi:filter"></iconify-icon></button>
            <button class="btn-icon btn-icon-lg" type="button" on:click={()=>isGrid = !isGrid}><iconify-icon icon="mdi:{isGrid ? 'grid' : 'format-list-bulleted-square'}"></iconify-icon></button>
            {/if}
        </div>
    </h3>

    {#if !$vetstate.length}
        <section in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-center py-8 h-full flex flex-col items-center">
            <p class="text-2xl opacity-70 m-0 mb-3">No Clinics available yet</p>
            <span class="h-6">
            {#if _loading}
                <p in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class=" m-0 animate-pulse">Searching...</p>
            {/if}
            </span>
            <button on:click|preventDefault={()=>goto('/clinics/register')} class="mt-8 text-lg btn variant-ghost-secondary" type="button">Register your Veterinary Clinic</button>
        </section>
    {:else}
        <div in:fade={{ duration: 300, delay:300 }} class="my-8 {grid ? 'grid grid-cols-1 sm:grid-cols-2 ' : 'flex flex-col'} gap-4">
            {#each $vetstate as clinic, index}
                <a href={$state.account?.emailVerification ? `/clinics/${clinic.$id}` : null}>
                    <ClinicCard clinicName={clinic.name} grid={grid}/>
                </a>
            {/each}
        </div>
    {/if}
</main>