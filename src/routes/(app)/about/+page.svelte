<script lang="ts">
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
	import { appSettings } from '$lib/_stores/settings_store.js';

    export let data;

    let _loading: boolean = false;
</script>

<!-- HTML head -->
<svelte:head>
	<title>{$appSettings.app.name}</title>
	<meta name="description" content="About {$appSettings.app.name}" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">
    <!--h3 class="title flex justify-between items-center">About {data.appName}
        {#if _loading}<LoadingClock/>{/if}
    </h3-->

    <!-- Furr Buddies logo, preferrably with subtle animation -->
	<div class="flex flex-col justify-center items-center">
		<img src="/icons/FurrBuddy2.webp" alt="" width="96" class="dark:block hidden m-0">
		<img src="/icons/FurrBuddy.webp" alt="" width="96" class="dark:hidden block m-0">
		<p class="m-0 p-0 text-xl">{ $appSettings.app.name }</p>
		<small class="mb-4 p-0 opacity-50">App Version: { $appSettings.app.version }</small>
	</div>

    <h3 class="title flex justify-start items-center ">Credit</h3>
    <p>Major thanks and congratulations to the team at <a href="https://kit.svelte.dev" target="">SvelteKit</a> for creating such a magnificent framework! 
        <a href="https://ppwrite.io" target="appwrite">Appwrite</a>, this would not have been possible without you guys as well.
        And to the entire open-source community,<br><b>Thank You</b>.
    </p>

    <hr>
    
    <section >
        <div>
            <span>Evelyn S. Youssef </span>
            <p>Furr Buddies name, Feature suggestions, QA</p>
        </div>

        <!--div>
            <span><a href="https://www.linkedin.com/in/francis-banda-3a4824101/" target="francisbanda">Francis Banda</a> </span>
            <p>Art direction, Design</p>
        </div-->

        <div>
            <span><a href="https://www.skeleton.dev/blog/welcome-to-the-skeleton-blog" target="chrissimmons">Chris Simmons</a> </span>
            <p>First-hand support &amp; a warm welcome to Skeleton UI</p>
        </div>

        <div>
            <span>
                <a href="https://learn.codevolution.dev/" target="codevolution">Codevolution</a> | 
                <a href="https://netninja.dev/" target="netninja">The Net Ninja</a> | 
                <a href="https://joyofcode.xyz/" target="joyofcode">Joy of Code</a> | 
                <a href="https://dev.to/armannik" target="arman">Arman</a> | 
                <a href="https://huntabyte.com/" target="huntabyte">Huntabyte</a> | 
            </span>
            <p>Your various online tutorials helped tremendously, Thank You.</p>
        </div>
    </section>

    <hr class="my-6">

	<p class="text-center"><small class="font-light opacity-70">Please report any bugs, send your sugesstions to help improve the app.</small></p>

	<div class="flex justify-evenly items-center mb-8 py-4">

		<a href="mailto:bugs@buddies.simmons.studio?subject=Report a bug | Furr Buddies" class="btn variant-soft-success"><iconify-icon icon="mdi:bug" class="mr-3"></iconify-icon>Report a Bug</a>
		<a href="mailto:app@simmons.studio?subject=App suggestions | Furr Buddies" class="btn variant-filled-tertiary"><iconify-icon icon="mdi:mail" class="mr-3"></iconify-icon>Suggestions</a>
	</div>
</main>


<style>
    section > div > span, section > div > span > a { @apply text-primary-500 text-center; }
    section > div > p { margin: 0; font-weight:200; text-align: center; }
    section > div { display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 1rem 0 }
</style>