<script lang="ts">
	import { goto } from '$app/navigation';
    import { state, petstate, petbucketstate } from '$lib/_stores/auth_store.js';
    import 'iconify-icon';
	import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
	import { appSettings } from '$lib/_stores/settings_store.js';

    export let data;

    // Local "isLoading" type of boolean
    let _loading: boolean = false;

    onMount(async ()=>{
        _loading = true;
        try {

            _loading=false;
            
        } catch (error: any) {
            console.warn('Unable to fetch Pets. ',error.message);
            _loading=false;
        }
    });

</script>

<!-- HTML head -->
<svelte:head>
	<title>{$appSettings.app.name} | About Animals</title>
	<meta name="description" content="Some information about animals" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">

    <!-- Display "Add Buddy" if User is logged in, otherwise prompted to log in -->
    <h3 class="title hidden justify-between items-center ">
        <!-- Left Panel -->
        <div class="flex items-center gap-2">
            <p class="text-2xl opacity-70 m-0 mb-3">About </p>
            {#if _loading}<span in:fade={{duration:800}} out:fade={{duration:800}}><LoadingClock/></span>{/if}
        </div>
        
        <!-- Right Panel -->
        <div class="flex items-center gap-2">
            <button class="btn-icon btn-sm " type="button"><iconify-icon icon="mdi:filter"></iconify-icon></button>
            <button class="btn-icon btn-sm " type="button"><iconify-icon icon="mdi:grid"></iconify-icon></button>
        </div>
    </h3>

    <section in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-center mt-16">

        <p class="text-3xl opacity-70 m-0 mb-3">No Information yet</p>

        <p in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-sm">A great feature will be coming here</p>

    </section>

        <section in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-center mt-16">
            {#if !$petstate.pets}
				<iconify-icon icon="mdi:paw" class="text-2xl"></iconify-icon>

                <p class="text-3xl opacity-70 m-0 mb-3">No Buddies yet</p>

            {/if}
        </section>
</main>