<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>{data.appName} | Setup</title>
	<meta name="description" content="Add to the family" />
</svelte:head>

<main>

    <p class="font-light">Configuration files such as theme mode, text size, audio notifications... shall all be placed here.</p>

	<div class="flex flex-col justify-center items-center">
		<img src="/images/logo.svg" alt="" width="256">
	</div>
</main>

<style>
</style>