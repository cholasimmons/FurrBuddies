<script lang="ts">
	import { clinicstate, state } from "$lib/store";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
    import 'iconify-icon';

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
    <h3 class="title">Clinics</h3>

    {#if !$clinicstate || _loading}
    <section in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-center py-8">
        <p class="text-xl opacity-70 m-0">No Clinics found</p>
        {#if _loading}
        <p in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-sm m-0 animate-pulse">Searching...</p>
        {/if}
    </section>
    {:else}
    <div class="my-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {#each $clinicstate as clinic, index}
        <a href="/" class="card">
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