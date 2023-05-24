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

    export let data;
    let _loading: boolean = false;
    let _adding: boolean = false;

    onMount(async ()=>{
        _loading = true;
        try {
            await petstate.fetch();
        } catch (error: any) {
            console.warn('Unable to fetch Pets. ',error.message);
        } finally {
            _loading=false
            toast.loading('Don\'t forget to implement an FAB', {style: 'background-color: #313131; color: #ddd; padding: 6px 12px;'})
        }
    });

    const addBuddy = (petName: string)=>{
        _adding = true;
        
        try {
            console.log('Male: ',Gender.MALE);
            
            petstate.addPet(petName, Gender.MALE,'Maltese X')
                .then(()=>{
                    toastStore.trigger(t);
                    _adding=false});
            const t: ToastSettings = {
                message: 'Added '+petName||'NoName'+' to the list',
                background: 'variant-filled-warning'
                
                /*action: {
                    label: 'Greeting',
                    response: () => alert('Hello, Skeleton')
                }*/
            };
            
        } catch (error: any) {
            state.alert({ color: 'red', message: petName+' was not added. '+error.message})
            console.warn('Unable to add pet. ',error.message);
            
        } finally {
            _adding = false;
        }        
    }

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
    <h3 class="title">My Buddies</h3>

    {#if !$petstate || _loading}
    <section in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-center py-8">
        <p class="text-xl opacity-70 m-0">No Buddies yet</p>
        {#if !$petstate}
            Button to add...
        {:else}
            <p in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-sm m-0 animate-pulse">Searching for our furr buddies...</p>
        {/if}
    </section>
    {:else}
    <div class="my-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 text-slate-800">
        {#each $petstate as pet, index}
        <a href="/pets/{pet.$id}" on:click|preventDefault={()=>goto('/pets/'+pet.$id)} on:keypress>
            <div in:fade={{ duration:300, delay:(index+1)*50 }} class="rounded-xl overflow-hidden">
                <div class="w-full h-[7rem] bg-[url('/images/buddy.jpg')] bg-cover bg-center bg-no-repeat text-white"></div>
                <p class="p-4">
                    {pet.name}
                </p>
            </div>
        </a>
        {/each}
    </div>
    {/if}
</main>