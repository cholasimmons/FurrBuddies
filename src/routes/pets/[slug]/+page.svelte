<script lang="ts">
	import type { Pet } from '$lib/_models/pet-model.js';
	import { petstate } from '$lib/store.js';
	import { onMount } from 'svelte';

    export let data;
    let buddy: Pet;

    //Loaders
    let _finding = false;

    onMount(async ()=>{    
        _finding = true;    
        buddy = await $petstate?.find((pet:Pet)=>pet.$id === data.Id) as Pet;
        _finding = false;
    });
</script>

<svelte:head>
	<title>{data.appName} | Buddy</title>
	<meta name="description" content="View my Furr Buddy" />
</svelte:head>

<main>
    <h3 class="title text-center">{buddy?.name || 'Name?'} {#if _finding}...{/if}</h3>
    <hr>
    <div class="grid grid-cols-2">
        <p><span>Gender: </span>{ buddy?.gender }</p>
        <p><span>Breed: </span>{ buddy?.breed }</p>
    </div>
    
    
</main>