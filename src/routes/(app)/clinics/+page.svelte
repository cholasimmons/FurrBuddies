<script lang="ts">
	import { clinicstate, state } from "$lib/_stores/auth_store.js";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
    import 'iconify-icon';
	import LoadingClock from "$lib/_components/icons/Loading_Clock.svelte";
	import { goto } from "$app/navigation";
	import ClinicCard from "$lib/_components/ClinicCard.svelte";

    export let data;

    // "isLoading" type of boolean
    let _loading: boolean = false;

    // Layout data
    let isGrid: boolean = true;

    onMount(async ()=>{
        _loading = true;
        try {
            await clinicstate.fetch();
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
	<title>{data.appName} | Clinics</title>
	<meta name="description" content="A public list of available health specialists" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">

    <h3 class="title flex justify-between items-center">
        <!-- Left Panel -->
        <div class="flex items-center gap-2">
            <button in:fade={{ duration:100, delay:100}} hidden={!$clinicstate.length} on:click|preventDefault={()=>goto('/clinics/register')} type="button" class="btn btn-sm variant-filled-secondary">
                <span class=" flex items-center"><iconify-icon icon="mdi:hospital"></iconify-icon></span>
                <span>Own a Clinic?</span>
            </button>
            {#if _loading}<span in:fade={{duration:800}} out:fade={{duration:800}}><LoadingClock /></span>{/if}
        </div>

        <!-- Right Panel -->
        <div class="flex items-center gap-2 ">
            <button class="btn-icon btn-icon-lg" type="button"><iconify-icon icon="mdi:filter"></iconify-icon></button>
            <button class="btn-icon btn-icon-lg" type="button" on:click={()=>isGrid = !isGrid}><iconify-icon icon="mdi:{isGrid ? 'grid' : 'format-list-bulleted-square'}"></iconify-icon></button>
        </div>
    </h3>

    {#if !$clinicstate.length}
        <section in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-center py-8 h-full flex flex-col items-center">
            <p class="text-2xl opacity-70 m-0 mb-3">No Clinics available yet</p>
            {#if _loading}
                <p in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class=" m-0 animate-pulse">Searching...</p>
            {/if}
        </section>
    {:else}
        <div in:fade={{ duration: 300, delay:300 }} class="my-8 {grid ? 'grid grid-cols-1 sm:grid-cols-2 ' : 'flex flex-col'} gap-4">
            {#each $clinicstate as clinic, index}
            <a href="/clinics/{clinic.$id}">
                <ClinicCard clinicName={clinic.name} grid={grid}/>
            </a>        
            {/each}
        </div>
    {/if}
</main>