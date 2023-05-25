<script lang="ts">
	import { goto } from '$app/navigation';
    import { Gender, type Pet } from '$lib/_models/pet-model';
    import { state, petstate } from '$lib/store';
	import { toastStore, type ToastSettings, type ModalSettings, type ModalComponent, Modal, modalStore } from '@skeletonlabs/skeleton';
    import 'iconify-icon';
	import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import NewPetFormComponent from '$lib/_components/forms/NewPetFormComponent.svelte'
	import toast from 'svelte-french-toast';
	import BuddyCard from '$lib/_components/BuddyCard.svelte';

    export let data;
    let _loading: boolean = false;

    onMount(async ()=>{
        _loading = true;
        try {
            // await state.checkLoggedIn();
            await petstate.fetch();
        } catch (error: any) {
            console.warn('Unable to fetch Pets. ',error.message);
        } finally {
            _loading=false
        }
    });

    const modalComponentRegistry: Record<string, ModalComponent> = {
        // Custom Modal 1
        customModal1: {
            // Pass a reference to your custom component
            ref: NewPetFormComponent,
            // Add the component properties as key/value pairs
            props: { background: 'bg-pink-400' },
            // Provide a template literal for the default component slot
            slot: '<p>Skeleton</p>'
        }
    }
    const modal: ModalSettings = {
        type: 'component',
        // Pass the component registry key as a string:
        component: 'customModal1',
    };
    // modalStore.trigger(modal)
</script>

<svelte:head>
	<title>{data.appName} | My Buddies</title>
	<meta name="description" content="A collection of your Furr Buddies" />
</svelte:head>

<Modal components={modalComponentRegistry} />
<main>
    <h3 class="title flex justify-between items-center">My Buddies <button hidden={!$petstate.length} on:click|preventDefault={()=>goto('/pets/add')}  type="button" class="ml-4 btn btn-sm variant-ghost-warning">
        <span class=" flex items-center"><iconify-icon icon="mdi:paw"></iconify-icon></span><span>Add Buddy</span></button></h3>

    {#if !$petstate.length }
    <section in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-center mt-16">
        <p class="text-3xl opacity-70 m-0 mb-3">No Buddies yet</p>
        {#if _loading}
            <p in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-sm m-0 animate-pulse">Searching for our furr buddies...</p>
        {:else}
        <!--button in:fade={{ duration: 300, delay: 200 }} hidden="{!$state.account?.$id}" on:click|preventDefault={()=>goto('/pets/add')} type="button" class="ml-4 btn rounded-xl variant-ghost-warning">
            <span class=" flex items-center"><iconify-icon icon="mdi:paw"></iconify-icon></span><span>Add a Buddy</span></button-->
        {/if}
    </section>
    {:else}
    <div class="my-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {#each $petstate as pet, index}
        <a href="/pets/{pet.$id}" on:click|preventDefault={()=>goto('/pets/'+pet.$id)} on:keypress>
            <BuddyCard {pet} src="/images/hero.jpg"/>
            
            <!--div in:fade={{ duration:300, delay:(index+1)*50 }} class="rounded-xl overflow-hidden">
                <div class="w-full h-[7rem] bg-[url('/images/buddy.jpg')] bg-cover bg-center bg-no-repeat text-white"></div>
                <p class="p-4">
                    {pet.name}
                </p>
            </div-->
        </a>
        {/each}
    </div>
    {/if}
</main>