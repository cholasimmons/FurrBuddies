<script lang="ts">
	import { goto } from '$app/navigation';
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
    import { onMount } from 'svelte';
	import { fade, fly, scale, slide } from 'svelte/transition';

    const title: string = 'Furr Buddies';

    // Simulated loading screen
    onMount(() => {
        // Simulate loading time with a timeout
        setTimeout(() => {
            goto('/');
        }, 3600); // Switch to app after 3.6 seconds
    });
</script>


<div class="w-full h-full flex flex-col items-center justify-between ">
    <span>
        &nbsp;
    </span>

    <div class="flex flex-col items-center">
        <div><img src="/icons/FurrBuddy.webp" alt="Furr Buddies" class="w-20"></div>
        <!--div><img src="/favicon.png" alt="Furr Buddies" class="w-20"></div-->
        <h3 in:scale={{ duration: 800, start:0.6 }} class="text-3xl mt-8 p-0">{ title }</h3>
        <small class="m-0 p-0">v 0.7.0</small>
        <span><LoadingClock/></span>
    </div>

    <div>
        <span class="font-normal"><a href="https://appwrite.io" target="appwrite">Appwrite</a> | <a href="https://kit.svelte.dev" target="sveltekit">SvelteKit</a> | <a href="https://skeleton.dev" target="skeletonui">SkeletonUI</a> | <a href="https://simmons.studio" target="simmons">Simmons</a></span>
    </div>
    
</div>