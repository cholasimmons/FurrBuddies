<script lang="ts">
	import LoadingCircle from '$lib/_components/icons/Loading_Circle.svelte';
    import { Gender, type Pet } from '$lib/_models/pet-model';
    import { state, petstate } from '$lib/store';
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
    import 'iconify-icon';
	import { onMount } from 'svelte';
	import { each } from 'svelte/internal';
    import { slide, fly, fade } from 'svelte/transition'

    let pets: Pet[];
    let _loading: boolean, _adding: boolean = false;

    onMount(()=>{
        try {
            _loading = true;
            petstate.fetch().finally(()=>_loading=false);
        } catch (error: any) {
            console.warn('Unable to fetch Pets. ',error.message);
        }
        
        // console.log($petstate.length)
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
</script>

<svelte:head>
	<title>Fur Buddies | Pets</title>
	<meta name="description" content="A collection of your Fur Buddies" />
</svelte:head>

<main>
    <h2 class="title">My Fur Buddies</h2>

    <div class="mt-[4rem]">
            <button on:click|preventDefault={()=>addBuddy('Poopie')} class="btn variant-filled-warning rounded-md" type="button">
                <iconify-icon icon="{_adding ? 'svg-spinners:clock' : 'mdi:paw'}"></iconify-icon>
                <span>Add a Pet</span>
            </button>
    </div>

    <div class="my-8">
        <p class="font-light text-xl">List my pets</p>
        
        <ul>
            {#if _loading}
                <iconify-icon out:fade={{ duration:200 }} icon="svg-spinners:clock" class="text-xl"></iconify-icon>
            {:else}
                {#each $petstate as pet, index}
                    <li in:fade={{ duration:300, delay: (index+1)*100 }}>{index}: {pet.name} <small>( { pet.breed +', '+ pet.gender} )</small></li>
                {/each}
            {/if}
            
        </ul>
    </div>
</main>

<style>
</style>