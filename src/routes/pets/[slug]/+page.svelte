<script lang="ts">
	import type { Pet } from '$lib/_models/pet-model.js';
	import { petstate } from '$lib/store.js';
	import { onMount } from 'svelte';

    export let data;
    let buddy: Pet;

    onMount(async ()=>{        
        buddy = await $petstate.find((pet:Pet)=>pet.$id === data.Id) as Pet;
    });
</script>

<svelte:head>
	<title>{data.appName} | Buddy</title>
	<meta name="description" content="View my Furr Buddy" />
</svelte:head>

<main>
    <h3 class="title text-center">{buddy?.name || 'Name?'}</h3>
    <p>{ data.Id }</p>
</main>