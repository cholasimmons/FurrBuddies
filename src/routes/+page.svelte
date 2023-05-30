<script lang="ts">
	import { state } from '$lib/store';
	import { fade, fly, slide, type crossfade } from 'svelte/transition';

	export let data;

	const infocards = [
		{name: 'Card One', value: 'Card One Value'},
		{name: 'Card Two', value: 'Card Two Value'},
		{name: 'Card Three', value: 'Card Three Value'},
	]
</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName}</title>
	<meta name="description" content="{data.appName} Home" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">

	<!-- Carousel -->

	<div class="w-full h-[12rem] bg-pink-800 bg-[url('/images/hero.jpg')] bg-cover bg-top rounded-xl">
	</div>

	<!--  -->

	<div class="my-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
		{#each infocards as infocard, index}
		<div class="{index === 2 ? 'block sm:hidden lg:block' : ' '} box rounded-lg p-4 text-center">
			{ infocard.name }
		</div>
		{/each}
	</div>

	<div class="text-left">
		<p>Display nearest Clinics and most popular shops, putting into consideration the paid Clients</p>
	</div>
</main>


<style>
	.box {
		background-color:darksalmon;
		color: black;
		padding: 1rem
	}
</style>
