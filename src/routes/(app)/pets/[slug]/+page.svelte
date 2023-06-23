<script lang="ts">
	import type { IPet } from '$lib/_models/pet-model.js';
	import { petbucketstate, petstate, state } from '$lib/_stores/auth_store.js';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
    import { Table, tableMapperValues, modalStore, type ModalSettings, type ModalComponent, Avatar, type PopupSettings, popup } from '@skeletonlabs/skeleton';
    import type {  TableSource } from '@skeletonlabs/skeleton';
	import { toast } from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import RichToast from '$lib/_components/RichToast.svelte';
	import { calculateAge, monthsToYears } from '$lib/_utilities/calculate-age.js';
    import QRViewComponent from '$lib/_components/QRViewComponent.svelte';
    import ImageViewComponent from '$lib/_components/ImageViewComponent.svelte';
	import { sdk } from '$lib/appwrite';
	import { page } from '$app/stores';
	import BuddyEditForm from '$lib/_components/forms/BuddyEditForm.svelte';
	import BuddyCard from '$lib/_components/BuddyCard.svelte';

    // Carbon
    import { BarChartSimple } from "@carbon/charts-svelte";

    // Vincjo Datatables stuff
    import { DataHandler } from '@vincjo/datatables';
    import Datatable from '$lib/_components/datatable/Datatable.svelte';
    import ThFilter from '$lib/_components/datatable/ThFilter.svelte';
    import Th from '$lib/_components/datatable/Th.svelte';
    import { groomData, sourceData } from './data'

    const handler = new DataHandler(groomData, { rowsPerPage: 10 })
    const rows = handler.getRows()

    export let data;
    let bud: IPet;
    let imageURL: string = '/icons/FurrPrints.svg';
    let QRcodeURL: string = '';
    let hasPhoto: boolean = false;

    //Loaders
    let _finding: boolean = true;

    onMount(async ()=>{
        if($state.account == null)
            await state.checkLoggedIn();

        if(state.checkVerificationStatus() === false) goto('/pets', {replaceState:true});
        
		if($petstate.pets.length < 1) 
            await petstate.fetch();

        bud = await petstate.viewPet($page.params.slug) as IPet;
        // bud = $petstate.pets.find(pet => { pet.$id === $page.params.slug })!;
        _finding = false;
        console.log(bud)

        if(bud.photoID!.length > 0){
            _finding = true;
            try {
                const file: URL|undefined = await petbucketstate.getPreview(bud.photoID![0]);
                imageURL = file?.href ?? '';
                hasPhoto = true;
                _finding = false;
            } catch (error) {
                console.log('Could not retrieve preview. ',error);
                _finding = false;       
            }
        }

        QRcodeURL = sdk.avatars.getQR(bud.$id, 128).href;
        
    });

    // View Buddy image
    function viewPhoto(): void {
        if(!hasPhoto) return;

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


    const tableVaccinations: TableSource = {
        // A list of heading labels.
        head: ['Date', 'Medication', 'Against', 'Next Vaccine'],
        // The data visibly shown in your table body UI.
        body: tableMapperValues(sourceData, ['vaccinationDate', 'vaccine', 'diseases', 'nextDueDate']),
        // Optional: The data returned when interactive is enabled and a row is clicked.
        meta: tableMapperValues(sourceData, ['vaccinationDate', 'vaccine', 'batchNo', 'diseases', 'nextDueDate', 'weight', 'clinicID', 'petID']),
        // Optional: A list of footer labels.
        // foot: ['Total', '', '<code class="code">5</code>']
    };

    // Grooming Table data
    const tableGrooming: TableSource = {
        // A list of heading labels.
        head: ['Date', 'Groomer', 'Venue'],
        // The data visibly shown in your table body UI.
        body: tableMapperValues(sourceData, ['groomDate', 'groomer', 'venue']),
        // Optional: The data returned when interactive is enabled and a row is clicked.
        meta: tableMapperValues(sourceData, ['gromDate', 'groomer', 'venue']),
        // Optional: A list of footer labels.
        // foot: ['Total', '', '<code class="code">5</code>']
    };

    // Callback for each selected table row
    function mySelectionHandler(data: any):void {
        // Displays raw meta data not all visible in table
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

    // SkeletonUI popup data
    const popupClick: PopupSettings = {
        event: 'click',
        target: 'popupClick',
        placement: 'left'
    };	

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

        <div on:click={viewPhoto} on:keypress class="w-48 absolute top-2">
            <!--img src={ _finding ? '' : imageURL} alt='' in:fade={{ duration: 300 }} class="w-full h-full object-cover"-->
            {#if _finding}
                <div out:fade={{duration:200}} class="mx-auto flex flex-col justify-center items-center w-44 h-44 placeholder-circle animate-pulse">
                    <iconify-icon icon="material-symbols:pet-supplies-outline" class="animate-spin text-3xl"></iconify-icon>
                </div>
            {:else}
                <span in:fade={{duration:200, delay:250}}>
                    <BuddyCard photoID={ buddy.photoID?.[0] } petName={ buddy.name } />
                </span>
            {/if}
        </div>

        <span on:click={ viewQR } on:keypress class="absolute top-1 ml-44 hover:scale-105 origin-center transition-transform ease-out">
            <Avatar src={ QRcodeURL } initials="QR" class="cursor-pointer border-2 border-surface-700 dark:border-surface-300"/>
        </span>
    </div>

    <!-- Buddy's Profile -->
    <section class="text-lg xl:text-2xl mt-[12rem] text-center px-{data.padding}">
        { #if buddy?.dob }<p in:fade={{duration:300}} class="m-0 text-500 flex items-center justify-center">
            <iconify-icon icon="mdi:calendar" type="date" class="mr-2 opacity-60"></iconify-icon>
            <small title={ 'Born: '+(buddy?.dob).toString() }>{ monthsToYears(calculateAge(buddy?.dob??'')) }</small></p>
        {/if}
        

        <div class="flex justify-between md:justify-evenly py-4 px-12 md:p-6 my-4 text-base md:text-xl  bg-gradient-to-r from-transparent via-tertiary-800  to-transparent">
            <p class="m-0 flex items-center gap-3"><span><iconify-icon icon="mdi:paw" type="dog"></iconify-icon> </span>{ buddy?.type || 'N/A' }</p>
            <p class="m-0 flex items-center gap-3"><span><iconify-icon icon="ph:gender-intersex-bold" type="gender"></iconify-icon> </span>{ buddy?.gender ?? 'N/A' }</p>
            <p class="m-0 flex items-center gap-3"><span><iconify-icon icon="material-symbols:genetics" type="breed"></iconify-icon> </span>{ buddy?.breed ?? 'N/A' }</p>        
        </div>

    </section>

    <!-- Vaccinations table -->
    <section class="my-12 xl:text-xl px-{data.padding}">
        <!-- Section Header -->
        <div class="flex justify-between items-center">
            <p class="text-lg font-light my-3 opacity-60">Vaccinations</p>
            <p><button use:popup={popupClick} type="button" class="btn btn-sm variant-ghost-warning">Sort</button></p>
        </div>
        
        <Table source={tableVaccinations} interactive={true} on:selected={(mySelectionHandler)} />
    </section>

    <hr class="my-6">

    <!-- Grooming table -->
    <section class="my-12 xl:text-xl px-{data.padding}">
        <!-- Section Header -->
        <div class="flex justify-start items-center">
            <p class="text-lg font-light opacity-60">Grooming</p>
            <!--p><button use:popup={popupClick} type="button" class="btn btn-sm variant-ghost-warning">Sort</button></p-->
        </div>

        <Datatable {handler}>
            <table>
                <thead>
                    <tr class="bg-tertiary-300 dark:bg-tertiary-600 border-none">
                        <Th {handler} orderBy="appointment_date">Appointment</Th>
                        <Th {handler} orderBy="groomer_name">Groomer</Th>
                        <Th {handler} orderBy="venue">Venue</Th>
                    </tr>
                    <tr class=" bg-opacity-60 bg-tertiary-400 dark:bg-tertiary-800">
                        <ThFilter {handler} filterBy="appointment_date"/>
                        <ThFilter {handler} filterBy="groomer_name" />
                        <ThFilter {handler} filterBy="venue"/>
                    </tr>
                </thead>
                <tbody class="bg-tertiary-200 dark:bg-tertiary-900">
                    {#each $rows as row}
                        <tr on:click={()=>{console.log(row)}} class="cursor-pointer hover:bg-tertiary-300 hover:dark:bg-tertiary-800">
                            <td>{row.appointment_date.toLocaleDateString()}</td>
                            <td>{row.groomer_name}</td>
                            <td>{row.venue}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </Datatable>
    </section>

    <hr class="my-6">

    <!-- Carbon Chart -->
    <section class="w-full xl:text-xl px-{data.padding}">
        <!-- Section Header -->
        <!--<div class="flex justify-between items-center">
            <p class="text-lg font-light my-3 opacity-60">Health Charts</p>
            <p><button use:popup={popupClick} type="button" class="btn btn-sm variant-ghost-warning">Sort</button></p>
        </div>
        
        <BarChartSimple class="w-full inline-block"
            data={[
                { group: "Date", value: new Date() },
                { group: "Weight", value: 13 },
            ]}
            options={{
                title: "Discrete bar",
                height: "400px",
                axes: {
                right: { mapsTo: "value" },
                bottom: { mapsTo: "group", },
                },
            }}/>
        -->
    </section>


    <section class="surface-300 flex justify-evenly py-12 px-{data.padding}">
        <button class="btn variant-ghost-success hover:bg-green-700" on:click={editBuddy}>Edit {bud?.name || 'Buddy'}</button>
        <button class="btn variant-ghost-warning hover:bg-red-600" on:click={removeBuddy}>Delete {bud?.name || 'Buddy'}</button>
    </section>

</main>

<!-- SkeletonUI Popop content-->
<div class="p-2 rounded-lg text-rightorigin-right" data-popup="popupClick">
	<p><button type="button" class="btn variant-filled-secondary">Date</button></p>
	<p><button type="button" class="btn variant-filled-error">Medication</button></p>
	<p><button type="button" class="btn variant-filled-success">Appointment</button></p>
	<div class="arrow variant-filled-tertiary" />
</div>


<style>
    div > p > span {
        opacity: 0.6;
    }

    /* Vincjo Datatables */
    td, tr > * {
        @apply px-4 py-3 m-0 ;
    }
</style>