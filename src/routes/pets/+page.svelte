<script lang="ts">
	import { goto } from '$app/navigation';
    import { state, petstate, petbucketstate } from '$lib/store';
	import { toastStore, type ToastSettings, type ModalSettings, type ModalComponent, Modal, modalStore } from '@skeletonlabs/skeleton';
    import 'iconify-icon';
	import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
	import toast from 'svelte-french-toast';
	import BuddyCard from '$lib/_components/BuddyCard.svelte';
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';

    export let data;

    // "isLoading" type of boolean
    let _loading: boolean = false;

    onMount(async ()=>{
        _loading = true;
        try {
            // Check if User is logged in so we can fetch buddies
            await state.checkLoggedIn();
            await petstate.fetch();
            await petbucketstate.fetch();
        } catch (error: any) {
            console.warn('Unable to fetch Pets. ',error.message);
        } finally {
            _loading=false;
        }
    });
</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | My Buddies</title>
	<meta name="description" content="A collection of your Furr Buddies" />
</svelte:head>

<!-- HTML body -->
<main>
    <!-- Display "Add Buddy" if User is logged in, otherwise prompted to log in -->
    <h3 class="title flex justify-between items-center">
        {#if $state.account?.$id}
        <button on:click|preventDefault={()=>goto('/pets/add')}  type="button" class="btn btn-sm variant-ghost-warning">
            <span class=" flex items-center"><iconify-icon icon="mdi:paw"></iconify-icon></span><span>Add Buddy</span>
        </button>
        {:else}
        <button on:click|preventDefault={()=>goto('/auth/login')}  type="button" class="btn btn-sm variant-ghost-warning">
            <span class=" flex items-center"><iconify-icon icon="mdi:lock-open"></iconify-icon></span><span>Log In</span>
        </button>
        {/if}

        {#if _loading}<LoadingClock/>{/if}
    </h3>

    <!-- Display Buddies if logged in and has buddies, otherwise prompted to log in-->
    {#if !$petstate?.length }
    <section in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-center mt-16">
        <p class="text-3xl opacity-70 m-0 mb-3">No Buddies yet</p>
        {#if !$state.account?.$id}
            <p in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-sm"><a href="/auth/login">Log In</a> and add some Furr Buddies!</p>
        {:else if _loading}            
            <p in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-sm animate-pulse">Searching...</p>
        {:else}
        <p in:fade={{ duration: 300, delay: 400 }} out:fade={{ duration:200 }} class="text-sm">Click <a href="/pets/add">Add Buddy</a> to add a new member to the family</p>
        <!--button in:fade={{ duration: 300, delay: 200 }} hidden="{!$state.account?.$id}" on:click|preventDefault={()=>goto('/pets/add')} type="button" class="ml-4 btn rounded-xl variant-ghost-warning">
            <span class=" flex items-center"><iconify-icon icon="mdi:paw"></iconify-icon></span><span>Add a Buddy</span></button-->
        {/if}
    </section>
    {:else}
    <div in:fade={{ duration: 300, delay: 250 }} class="my-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {#each $petstate as pet}
        <a href="/pets/{pet.$id}" on:click|preventDefault={()=>goto('/pets/'+pet.$id)} on:keypress>
            <BuddyCard petName={pet.name} photoID={pet.photoID} />
        </a>
        {/each}
    </div>
    {/if}
</main>

<style>
    p > a {
        font-weight: 400;
    }
</style>