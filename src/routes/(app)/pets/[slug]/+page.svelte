<script lang="ts">
	import type { IPet } from '$lib/_models/pet-model.js';
	import { petbucketstate, petstate, state } from '$lib/_stores/auth_store.js';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
    import { Table, tableMapperValues, modalStore, type ModalSettings, type ModalComponent, Avatar } from '@skeletonlabs/skeleton';
    import type {  TableSource } from '@skeletonlabs/skeleton';
	import { toast } from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import RichToast from '$lib/_components/RichToast.svelte';
	import { calculateAge } from '$lib/_utilities/calculate-age.js';
    import QRViewComponent from '$lib/_components/QRViewComponent.svelte';
    import ImageViewComponent from '$lib/_components/ImageViewComponent.svelte';
	import { sdk } from '$lib/appwrite.js';
	import { page } from '$app/stores';
	import BuddyEditForm from '$lib/_components/forms/BuddyEditForm.svelte';
    

    export let data;
    let bud: IPet;
    let imageURL: string = '/images/FurrPrints.jpg';
    let QRcodeURL: string = '';

    //Loaders
    let _finding: boolean = true;

    onMount(async ()=>{
        await state.checkLoggedIn();

        if(state.checkVerificationStatus() === false) goto('pets', {replaceState:true});
        
		if($petstate.pets.length < 1) {await petstate.fetch();}

        bud = await petstate.viewPet($page.params.slug) as IPet;
        _finding = false;

        if(bud.photoID!.length > 0){
            _finding = true;
            try {
                const file: URL|undefined = await petbucketstate.getPreview(bud.photoID![0]);
                imageURL = file?.href ?? '';
                _finding = false;
            } catch (error) {
                console.log('Could not retrieve preview. ',error);
                _finding = false;       
            }
        }

        QRcodeURL = sdk.avatars.getQR(bud.$id, 64).href;
        
    });

    // View Buddy image
    function viewPhoto(): void {
        const modalComponent: ModalComponent = {
            // Pass a reference to your custom component
            ref: ImageViewComponent,
            // Add the component properties as key/value pairs
            props: {ids: bud.photoID, name: bud.name},
            // Provide a template literal for the default component slot
            // slot: undefined
        };
        const viewImage: ModalSettings = {
            type: 'component',
            // Pass the component directly:
            component: modalComponent,
        };
    
        if(imageURL === '')return;
        modalStore.trigger(viewImage);
    }

    // View Buddy's QRcode for detail scanning
    function viewQR() {
        const modalComponent2: ModalComponent = {
            // Pass a reference to your custom component
            ref: QRViewComponent,
            // Add the component properties as key/value pairs
            props: {id: bud.$id},
            // Provide a template literal for the default component slot
            // slot: undefined
        };
        const viewQRimage: ModalSettings = {
            type: 'component',
            // Pass the component directly:
            component: modalComponent2,
        };
    
        if(imageURL === '')return;
        modalStore.trigger(viewQRimage);
    }

    const sourceData = [
        { vaccinationDate: new Date().getFullYear(), vaccine: 'Rabisin', batchNo: 'A123456', diseases: ['Rabies'], nextDueDate: new Date().getUTCFullYear(), weight: 3.24 },
        { vaccinationDate: new Date().getUTCFullYear(), vaccine: 'Malariox', batchNo: 'B123456', diseases: ['Malaria'], nextDueDate: new Date().getUTCFullYear(), weight: 2.24 },

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
    function editBuddy(): void {
        // Skeleton Form stuff
        const modalComponent: ModalComponent = {
            // Pass a reference to your custom component
            ref: BuddyEditForm,
            // Add the component properties as key/value pairs
            props: { buddy },
            // Provide a template literal for the default component slot
            // slot: '<p>Skeleton</p>'
        };

        const modal: ModalSettings = {
            type: 'component',
            // Pass the component directly:
            component: modalComponent,
        };

        modalStore.trigger(modal);
    }

    // Delete button to remove Buddy from Database
    function removeBuddy():void {
        const duration: number = 3; // seconds before executing delete function

        // Prompt Modal to confirm decision to delete Buddy, with an added layer of security
        const promptModal: ModalSettings = {
            type: 'prompt',
            title: 'Remove this Buddy?',
            body: 'If you\'re sure, enter your Buddy\'s name below.',
            // Populates the input value and attributes
            value: '',
            valueAttr: { type: 'text', minlength: 2, maxlength: 18, required: true },
            // Returns the updated response value
            response: async (r: string) => {
                // Verify input name and pet's name are the same, then delete pet
                if(r !== bud.name)return;
                await petstate.removePet(bud);
                toast.success(bud.name+' was removed.');
                goto('/pets');
            },
        };
        modalStore.trigger(promptModal);
        
        // Implement a countdown toast to allow User to change their mind
    }

    $: buddy = bud;
</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | Buddy</title>
	<meta name="description" content="View my Furr Buddy" />
</svelte:head>

<!-- HTML body -->
<main>
    <div class="w-full flex justify-evenly items-center py-6 relative ">
        <span></span>

        <div class="w-40 h-40 bg-red-300 rounded-full overflow-hidden absolute top-0">
            <img on:click={viewPhoto} on:keypress src={ _finding ? '' : imageURL} alt='' in:fade={{ duration: 300 }} class="w-full h-full object-cover">
        </div>

        <span on:click={viewQR} on:keypress class="absolute top-0 ml-44">
            <Avatar src={QRcodeURL} initials="QR" class="border-2"/>
        </span>
    </div>

    <!-- Buddy's Profile -->
    <section class="text-lg xl:text-2xl mt-[8rem] text-center px-{data.padding}">
        {#if _finding}
            <iconify-icon icon="line-md:loading-alt-loop"></iconify-icon>
        {:else}
            <h2 class="title p-0 flex justify-center gap-2 text-4xl">
                {buddy?.name || ''}
            </h2>
        {/if}
        { #if bud?.dob }<p class="m-0 text-500 flex items-center justify-center">
            <iconify-icon icon="mdi:calendar" type="date" class="mr-2 opacity-60"></iconify-icon>
            <small title={ 'Born: '+(buddy?.dob??'').toString() }>{ calculateAge(buddy?.dob??'') } Months</small></p>
        {/if}
        
        <hr class="my-6">

        <div class="flex justify-between md:justify-evenly px-6 md:p-0 text-base md:text-xl">
            <p class="m-0 flex items-center gap-3"><span><iconify-icon icon="mdi:paw" type="dog"></iconify-icon> </span>{ buddy?.type || 'N/A' }</p>
            <p class="m-0 flex items-center gap-3"><span><iconify-icon icon="ph:gender-intersex-bold" type="gender"></iconify-icon> </span>{ buddy?.gender || 'N/A' }</p>
            <p class="m-0 flex items-center gap-3"><span><iconify-icon icon="material-symbols:genetics" type="breed"></iconify-icon> </span>{ buddy?.breed || 'N/A' }</p>        
        </div>

        <hr class="my-6">
    </section>

    <!-- Vaccinations table -->
    <section class="xl:text-xl px-{data.padding}">
        <h3 class="text-lg font-light my-3 opacity-60">Vaccinations</h3>
        <Table source={tableSimple} interactive={true} on:selected={(mySelectionHandler)} />
    </section>

    <hr class="my-6">

    <!-- Grooming table -->
    <section class="xl:text-xl px-{data.padding}">
        <h3 class="text-lg font-light my-3 opacity-60">Grooming</h3>
        <Table source={tableSimple} interactive={true} on:selected={(mySelectionHandler)} />
    </section>

    <hr class="my-6">

    <section class="surface-300 flex justify-evenly py-12 px-{data.padding}">
        <button class="btn variant-ghost-success hover:bg-green-700" on:click={editBuddy}>Edit {bud?.name || 'Buddy'}</button>
        <button class="btn variant-ghost-warning hover:bg-red-600" on:click={removeBuddy}>Delete {bud?.name || 'Buddy'}</button>
    </section>

</main>


<style>
    div > p > span {
        opacity: 0.6;
    }
</style>