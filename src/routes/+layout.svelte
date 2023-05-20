<script lang="ts">
	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';

	// This contains the bulk of Skeletons required styles:
	// NOTE: this will be renamed skeleton.css in the v2.x release.
	import '@skeletonlabs/skeleton/styles/skeleton.css';

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	import '/src/app.postcss';

	import { page } from '$app/stores';
	import {AppShell, AppBar} from '@skeletonlabs/skeleton';
	import PageTransition from '$lib/_components/Transition.svelte';


	function scrollHandler(event: UIEvent & { currentTarget: EventTarget & HTMLDivElement; }) {
		console.log(event.currentTarget.scrollTop);
	}

</script>

<AppShell class="bg-surface-900 min-w-[20rem]" regionPage="relative" slotHeader="z-10 hidden md:block"
slotSidebarLeft="w-0 md:w-60 min-h-full bg-transparent text-gray-200 transition ease-in-out -translate-x-60 md:translate-x-1 delay-150 duration-800 motion-reduce:transition-none" slotFooter="h-20 md:h-0 bg-surface-800 w-full transition ease-in-out translate-y-0 md:translate-y-20 delay-150 duration-800 animation motion-reduce:transition-none"> <!-- on:scroll={scrollHandler} -->
	<svelte:fragment slot="header">
		<AppBar>Skeleton</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<!-- Hidden below Tailwind's large breakpoint -->
		<div id="sidebar-left" class="hidden lg:block">Sidebar</div>
	</svelte:fragment>
	<div class="text-gray-300 min-h-full">
		<PageTransition key={$page.url.pathname} duration={400}>
			<slot />
		</PageTransition>
	</div>
</AppShell>

<style>
	* {
		user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
	}
	*:focus {
		outline: none;
	}
</style>
