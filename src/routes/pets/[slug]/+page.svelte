<script lang="ts">
	import type { Pet } from '$lib/_models/pet-model.js';
	import { petbucketstate, petstate, state } from '$lib/store.js';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
    import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
    import type { TableSource } from '@skeletonlabs/skeleton';

    export let data;
    let buddy: Pet;
    let imageURL: any;

    //Loaders
    let _finding = false;

    onMount(async ()=>{    
        _finding = true;    
        buddy = await $petstate?.find((pet:Pet)=>pet.$id === data.Id) as Pet;
       
        const file = await petbucketstate.getPreview(buddy.photoID![0]);
        imageURL = file?.href || '';
        _finding = false;
    });

    function managePhoto(): void {
        console.log('btn pressed');
    }

    const sourceData = [
        { position: 6, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
        { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
        { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
        { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
        { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    ];
    const tableSimple: TableSource = {
        // A list of heading labels.
        head: ['Date', 'Medication', 'Duration'],
        // The data visibly shown in your table body UI.
        body: tableMapperValues(sourceData, ['name', 'symbol', 'weight']),
        // Optional: The data returned when interactive is enabled and a row is clicked.
        meta: tableMapperValues(sourceData, ['position', 'name', 'symbol', 'weight']),
        // Optional: A list of footer labels.
        // foot: ['Total', '', '<code class="code">5</code>']
    };
    function mySelectionHandler(data: any):void {
        console.log('This was selected ', data.detail);
        
    }
</script>

<svelte:head>
	<title>{data.appName} | Buddy</title>
	<meta name="description" content="View my Furr Buddy" />
</svelte:head>

<main>
    <div class=" xl:w-[8rem] h-[12rem] overflow-hidden">
        <img on:click={managePhoto} on:keypress src={imageURL} alt='' in:fade={{ duration: 300 }} class=" object-cover hover:object-scale-up">
    </div>

<section class="px-{data.padding} text-lg xl:text-2xl">
    <h3 class="title text-center mt-6 p-0 flex justify-center gap-2">{buddy?.name || 'Name?'} {#if _finding}<iconify-icon icon="line-md:loading-alt-loop"></iconify-icon>{/if}</h3>
    <hr class="my-3">
    <div class="grid grid-cols-2">
        <p><span>Type: </span>{ buddy?.type || 'N/A' }</p>
        <p><span>Gender: </span>{ buddy?.gender || 'N/A' }</p>
        <p><span>Breed: </span>{ buddy?.breed || 'N/A' }</p>
        <p><span>D.O.B: </span>{ buddy?.dob || 'N/A' }</p>
        
    </div>
</section>

<section class="px-{data.padding} xl:text-xl">
    <Table source={tableSimple} interactive={true} on:selected={(mySelectionHandler)} />
</section>

</main>

<style>
    div > p > span {
        color: white;
        opacity: 0.6;
    }
</style>