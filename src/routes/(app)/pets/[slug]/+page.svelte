<script lang="ts">
	import type { IPet } from '$lib/_models/pet-model.js';
	import { petbucketstate, petstate, state } from '$lib/store.js';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
    import { Table, tableMapperValues, modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import type {  TableSource } from '@skeletonlabs/skeleton';
	import { toast } from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import RichToast from '$lib/_components/RichToast.svelte';
	import { calculateAge } from '$lib/_utilities/calculate-age.js';

    export let data;
    let buddy: IPet;
    let imageURL: string = '';

    //Loaders
    let _finding = false;

    onMount(async ()=>{    
        _finding = true;    
        buddy = await $petstate?.find((pet:IPet)=>pet.$id === data.Id) as IPet;
        if(buddy.photoID!.length > 0){
            const file: URL|undefined = await petbucketstate.getPreview(buddy.photoID![0]);
            imageURL = file?.href || '';
        }
        _finding = false;
    });

    // View, Edit, Remove Buddy image
    function managePhoto(): void {
        console.log('btn pressed');
    }

    const sourceData = [
        { vaccinationDate: new Date(), vaccine: 'Rabisin', batchNo: 'A123456', diseases: ['Rabies'], nextDueDate: '04-06-2024', weight: 3.24 },
        { vaccinationDate: new Date(), vaccine: 'Malariox', batchNo: 'B123456', diseases: ['Malaria'], nextDueDate: '04-06-2024', weight: 2.24 },

    ];
    const tableSimple: TableSource = {
        // A list of heading labels.
        head: ['Date', 'Medication', 'Fights', 'Appointment'],
        // The data visibly shown in your table body UI.
        body: tableMapperValues(sourceData, ['vaccinationDate', 'vaccine', 'diseases', 'nextDueDate']),
        // Optional: The data returned when interactive is enabled and a row is clicked.
        meta: tableMapperValues(sourceData, ['vaccinationDate', 'vaccine', 'batchNo', 'diseases', 'nextDueDate', 'weight', 'clinicID', 'petID']),
        // Optional: A list of footer labels.
        // foot: ['Total', '', '<code class="code">5</code>']
    };

    // Callback for each selected table row
    function mySelectionHandler(data: any):void {
        console.log('This was selected ', data.detail);
    }

    // Edit button to edit Buddy's profile
    function editBuddy(): void {}

    // Delete button to remove Buddy from Database
    function removeBuddy():void {
        const duration: number = 3; // seconds before executing delete function

        // Prompt Modal to confirm decision to delete Buddy, with an added layer of security
        const promptModal: ModalSettings = {
            type: 'prompt',
            title: 'Remove '+buddy.name+'?',
            body: 'Enter your Buddy\'s name below.',
            // Populates the input value and attributes
            value: '',
            valueAttr: { type: 'text', minlength: 2, maxlength: 18, required: true },
            // Returns the updated response value
            response: async (r: string) => {
                // Verify input name and pet's name are the same, then delete pet
                if(r !== buddy.name)return;
                await petstate.removePet(buddy);
                goto('/pets');
                toast.success(buddy.name+' was removed.')
            },
        };
        modalStore.trigger(promptModal);
        
        // Implement a countdown toast to allow User to change their mind
    }
        
</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | Buddy</title>
	<meta name="description" content="View my Furr Buddy" />
</svelte:head>

<!-- HTML body -->
<main>
    <div class="w-full flex justify-center items-center py-6 relative bg-primary-300 bg-opacity-10">
        <div class="w-40 h-40 bg-red-300 rounded-full overflow-hidden">
        <img on:click={managePhoto} on:keypress src={imageURL} alt='' in:fade={{ duration: 300 }} class="w-full h-full object-cover">
        </div>
    </div>

    <!-- Buddy's Profile -->
    <section class="text-lg xl:text-2xl mt-6 text-center px-{data.padding}">
        <h2 class="title p-0 flex justify-center gap-2 text-4xl">{buddy?.name || ''} {#if _finding}<iconify-icon icon="line-md:loading-alt-loop"></iconify-icon>{/if}</h2>
        { #if buddy?.dob }<p class="m-0 text-500">
            <iconify-icon icon="mdi:calendar" type="date" class="mr-2 opacity-60"></iconify-icon>
            <small title={ 'Born: '+buddy?.dob.toString() }>{ calculateAge(buddy?.dob) } </small></p>
        {/if}
        
        <hr class="my-6">

        <div class="flex justify-between md:justify-evenly px-6 md:p-0 text-base md:text-xl">
            <p class="m-0 flex items-center gap-3"><span><iconify-icon icon="mdi:paw" type="dog"></iconify-icon> </span>{ buddy?.type || 'N/A' }</p>
            <p class="m-0 flex items-center gap-3"><span><iconify-icon icon="ph:gender-intersex-bold" type="gender"></iconify-icon> </span>{ buddy?.gender || 'N/A' }</p>
            <p class="m-0 flex items-center gap-3"><span><iconify-icon icon="material-symbols:genetics" type="breed"></iconify-icon> </span>{ buddy?.breed || 'N/A' }</p>        
        </div>

        <hr class="my-6">
    </section>

    <section class="xl:text-xl px-{data.padding}">
        <h3 class="text-lg font-light my-3 opacity-60">Vaccinations</h3>
        <Table source={tableSimple} interactive={true} on:selected={(mySelectionHandler)} />
    </section>

    <hr class="my-6">

    <section class="surface-300 flex justify-evenly py-12 px-{data.padding}">
        <button class="btn variant-ghost-success hover:bg-green-700" on:click={editBuddy}>Edit {buddy?.name || 'Buddy'}</button>
        <button class="btn variant-ghost-warning hover:bg-red-600" on:click={removeBuddy}>Delete {buddy?.name || 'Buddy'}</button>
    </section>

</main>


<style>
    div > p > span {
        opacity: 0.6;
    }
</style>