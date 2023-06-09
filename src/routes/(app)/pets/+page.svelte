<script lang="ts">
	import { goto } from '$app/navigation';
    import { state, petstate, petbucketstate } from '$lib/store';
    import 'iconify-icon';
	import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
	import BuddyCard from '$lib/_components/BuddyCard.svelte';
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';

    export let data;

    // Local "isLoading" type of boolean
    let _loading: boolean = false;

    onMount(async ()=>{
        _loading = true;
        try {
            // Check if User is logged in so we can fetch buddies
            await state.checkLoggedIn();

            // Must be logged in so fetch buddies
            await petstate.fetch();
            
            // Must be logged in so fetch buddy photos
            await petbucketstate.fetch();
            _loading=false;
            
        } catch (error: any) {
            console.warn('Unable to fetch Pets. ',error.message);
            _loading=false;
        }
    });

    $: account = $state.account;
    $: pets = $petstate.pets;
</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | My Buddies</title>
	<meta name="description" content="A collection of your Furr Buddies" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">

    <!-- Display "Add Buddy" if User is logged in, otherwise prompted to log in -->
    <h3 class="title flex justify-between items-center">
        <!-- Left Panel -->
        <div class="flex items-center gap-2">
            {#if account?.$id}
                <button on:click|preventDefault={()=>goto('/pets/add')}  type="button" class="btn btn-sm bg-gradient-to-br variant-gradient-secondary-tertiary shadow-[0_4px_4px_rgba(0,0,0,0.24)] hover:shadow-none">
                    <span class=" flex items-center"><iconify-icon icon="mdi:paw"></iconify-icon></span>
                    <span>Add Buddy</span>
                </button>
            {:else}
                <button on:click|preventDefault={()=>goto('/auth/login')}  type="button" class="btn btn-sm variant-filled-surface">
                    <span class=" flex items-center"><iconify-icon icon="mdi:lock-open"></iconify-icon></span><span>Log In</span>
                </button>
            {/if}
            {#if _loading}<LoadingClock/>{/if}
        </div>
        
        <!-- Right Panel -->
        <div class="flex items-center gap-2">
            <button class="btn-icon btn-sm " type="button"><iconify-icon icon="mdi:filter"></iconify-icon></button>
            <button class="btn-icon btn-sm " type="button"><iconify-icon icon="mdi:grid"></iconify-icon></button>
        </div>
    </h3>

    <!-- Display Buddies if User is logged in and has buddies, otherwise no Buddies shown-->

    {#if !pets?.length }
        <section in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-center mt-16">
            <p class="text-3xl opacity-70 m-0 mb-3">No Buddies yet</p>
            {#if !account?.$id}
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
        <!-- Display each available buddy -->
        <div class="my-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-6 gap-6  justify-center">
            {#each pets as pet, i}
                <span on:click|preventDefault={()=>goto('/pets/'+pet.$id)} on:keypress in:fade={{ duration:300, delay: 200*(i+1)}}>
                    <BuddyCard petName={pet.name} photoID={ pet.photoID?.[0] ?? '' } />
                </span>
            {/each}
        </div>
    {/if}
</main>

<style>
    p > a {
        font-weight: 400;
    }
</style>