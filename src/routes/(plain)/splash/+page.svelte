<script lang="ts">
	import { goto } from '$app/navigation';
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
	import { appSettings } from '$lib/_stores/settings_store';
    import { onMount } from 'svelte';
	import { fade, fly, scale, slide } from 'svelte/transition';

    const title: string = 'Furr Buddies';

    // Simulated loading screen
    onMount(() => {
        // Simulate loading time with a timeout
        setTimeout(() => {
            goto('/');
        }, 4800); // Switch to app after 3.6 seconds
    });
</script>


<div class="w-full h-full flex flex-col items-center justify-between ">
    <span>
        &nbsp;
    </span>

    <div class="flex flex-col items-center">
        <div><img src="/images/FurrPrints.webp" alt="Furr Buddies" class="w-20"></div>
        <!--div><img src="/favicon.png" alt="Furr Buddies" class="w-20"></div-->
        <h3 in:scale={{ duration: 800, start:0.6 }} class="text-3xl mt-8 p-0">{ title }</h3>
        <small class="m-0 p-0">v { $appSettings.app.version }</small>
        <span><LoadingClock/></span>
    </div>

    <div>
        <span class="font-normal"><a href="https://appwrite.io" target="appwrite">Appwrite</a> | <a href="https://kit.svelte.dev" target="sveltekit">SvelteKit</a> | <a href="https://skeleton.dev" target="skeletonui">SkeletonUI</a> | <a href="https://simmons.studio" target="simmons">Simmons</a></span>
    </div>
    
</div>

<style>
    * {
        color: white
    }
    a {
        color: #a3c6d3
    }
    a:hover {
        text-decoration: underline;
    }
</style>