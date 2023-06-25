<script lang="ts">
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
	import { appSettings } from '$lib/_stores/settings_store.js';

    export let data;

    let _loading: boolean = false;
</script>

<!-- HTML head -->
<svelte:head>
	<title>{$appSettings.app.name}</title>
	<meta name="description" content="{$appSettings.app.name} Terms & Conditions" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding} pb-{data.padding}">
    <!--h3 class="title flex justify-between items-center">About {data.appName}
        {#if _loading}<LoadingClock/>{/if}
    </h3-->

    <!-- Furr Buddies logo, preferrably with subtle animation -->
	<div class="flex flex-col justify-center items-center">
		<img src={$appSettings.app.mascot_dark} alt="" width="96" class="dark:block hidden m-0">
		<img src={$appSettings.app.mascot_light} alt="" width="96" class="dark:hidden block m-0">
		<p class="m-0 p-0 text-xl">{ $appSettings.app.name }</p>
		<small class="mb-4 p-0 opacity-50">App Version: { $appSettings.app.version }</small>
	</div>

    <h3 class="title flex justify-start items-center mt-4">Terms & Conditions</h3>
    <p>Kindly note this application is still in early phase testing, a proper T's and C's document shall be shared as soon as it's preparation is complete.</p>

    <hr>
    
    <section >

        <div>
            <!--span>
                <a href="https://learn.codevolution.dev/" target="codevolution">Codevolution</a>
            </span>
            <p>Your various online tutorials helped tremendously, Thank You.</p-->
        </div>
    </section>

    <hr class="my-6">

	<p class="text-center"><small class="font-light opacity-70">Last updated: Tuesday 13, June 2023</p>
</main>


<style>
    section > div > span, section > div > span > a { @apply text-primary-500; text-align: center }
    section > div > p { margin: 0; font-weight:200; text-align: center; }
    section > div { display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 1rem 0 }
</style>