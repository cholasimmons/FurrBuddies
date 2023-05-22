<script lang="ts">
	import { clinicstate } from "$lib/store";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
    import 'iconify-icon';

    let _loading: boolean = false;

    onMount(()=>{
        try {
            _loading = true;
            clinicstate.fetch().finally(()=>_loading=false);
        } catch (error: any) {
            console.warn('Error loading Clinics. ', error.message);
        } finally {
            _loading = false;
        }
    });
</script>

<svelte:head>
	<title>Fur Buddies | Clinics</title>
	<meta name="description" content="A public list of available Vetenarians" />
</svelte:head>

<main>
    <h2 class="title">Clinics page working</h2>

    <div class="my-8">
        <p class="font-light text-xl">Available Clinics</p>
        
        <ul>
            {#if _loading}
                <iconify-icon out:fade={{ duration:200 }} icon="svg-spinners:clock" class="text-xl"></iconify-icon>
            {:else}
                {#each $clinicstate as clinic, index}
                <li in:fade={{ duration:300, delay:(index+1)*100 }} >{index+1}: {clinic.name}</li>
                {/each}
            {/if}
            
        </ul>
    </div>
</main>

<style>
</style>