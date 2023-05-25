<script lang="ts">
	import { clinicstate, state } from "$lib/store";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
    import 'iconify-icon';
	import LoadingClock from "$lib/_components/icons/Loading_Clock.svelte";

    export let data;
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

<svelte:head>
	<title>{data.appName} | Clinics</title>
	<meta name="description" content="A public list of available health specialists" />
</svelte:head>

<main>
    <h3 class="title flex justify-between">Clinics <span hidden={!_loading} class="ml-3"><LoadingClock/></span></h3>

    {#if !$clinicstate.length}
    <section in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-center py-8 h-full flex flex-col items-center">
        <p class="text-3xl opacity-70 m-0 mb-3">No Clinics found</p>
        {#if _loading}
        <p in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-sm m-0 animate-pulse">Searching...</p>
        {/if}
    </section>
    {:else}
    <div class="my-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {#each $clinicstate as clinic, index}
        <a href="/clinics/{clinic.$id}" class="card">
            <div class="w-full h-[8rem] bg-[url('/images/vet.jpg')] bg-cover bg-center bg-no-repeat text-white"></div>
            <div in:fade={{ duration:300, delay:(index+1)*100 }} class="px-4 py-3">{clinic.name}</div>
        </a>        
        {/each}
    </div>
    {/if}
</main>

<style>
    .card {
        background-color: rgba(71, 36, 112, 0.36);
    }
</style>