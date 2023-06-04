<script lang="ts">
	import { clinicstate, state } from "$lib/store";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
    import 'iconify-icon';
	import LoadingClock from "$lib/_components/icons/Loading_Clock.svelte";
	import { goto } from "$app/navigation";
	import ClinicCard from "$lib/_components/ClinicCard.svelte";

    export let data;

    // "isLoading" type of boolean
    let _loading: boolean = false;

    onMount(async ()=>{
        _loading = true;
        try {
            await clinicstate.fetch();
        } catch (error: any) {
            console.warn('Error loading Clinics. ', error.message);
        } finally {
            _loading = false;
        }
    });
</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | Clinics</title>
	<meta name="description" content="A public list of available health specialists" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">
    <h3 class="title flex justify-between items-center"><button hidden={!$clinicstate.length} on:click|preventDefault={()=>goto('/clinics/register')}  type="button" class="btn btn-sm variant-ghost-warning">
        <span class=" flex items-center"><iconify-icon icon="mdi:hospital"></iconify-icon></span><span>Own a Clinic?</span></button>{#if _loading}<LoadingClock/>{/if}
    </h3>

    {#if !$clinicstate.length}
        <section in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-center py-8 h-full flex flex-col items-center">
            <p class="text-3xl opacity-70 m-0 mb-3">No Clinics found</p>
            {#if _loading}
            <p in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-sm m-0 animate-pulse">Searching...</p>
            {/if}
        </section>
    {:else}
        <div in:fade={{ duration: 300, delay:400 }} class="my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {#each $clinicstate as clinic, index}
            <a href="/clinics/{clinic.$id}">
                <ClinicCard clinicName={clinic.name}/>
            </a>        
            {/each}
        </div>
    {/if}
</main>

<style>
</style>