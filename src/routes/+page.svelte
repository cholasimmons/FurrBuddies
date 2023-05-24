<script lang="ts">
	import { state } from '$lib/store';
	import { fade, fly, slide, type crossfade } from 'svelte/transition';

	export let data;
</script>

<svelte:head>
	<title>{data.appName}</title>
	<meta name="description" content="{data.appName} Home" />
</svelte:head>

<main>
	<div class="w-full h-[10rem] bg-pink-800 bg-[url('/images/hero.jpg')] bg-cover bg-top rounded-xl">
	</div>

	<div class="mt-4 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2">
		<div class="card rounded-lg p-4">
			1
		</div>
		<div class="card rounded-lg p-4">
			2
		</div>
	</div>

	<div class="text-center">
		<p>Display nearest Clinics and most popular shops, putting into consideration the paid Clients</p>
	</div>
</main>


<style>
</style>
