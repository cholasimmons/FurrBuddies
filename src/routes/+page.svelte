<script lang="ts">
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	import { state } from '$lib/store';
	import { toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { fade, fly, slide, type crossfade } from 'svelte/transition';
</script>

<svelte:head>
	<title>Fur Buddies</title>
	<meta name="description" content="Fur Buddies home-screen" />
</svelte:head>

<section>
	<p>Hello <span in:slide={{ duration: 300, delay: 100}} out:fade={{ duration: 300 }}>{$state.account?.name || 'there!'}</span></p>
</section>

<style>
</style>
