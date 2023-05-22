<script lang="ts">
    // Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-sahara.css';

    // This contains the bulk of Skeletons required styles:
    // NOTE: this will be renamed skeleton.css in the v2.x release.
    import '@skeletonlabs/skeleton/styles/skeleton.css';

    // Finally, your application's global stylesheet (sometimes labeled 'app.css')
    import '../global.postcss';

    import { page } from '$app/stores';
    import {AppShell, AppBar} from '@skeletonlabs/skeleton';
    import PageTransition from '$lib/_components/Transition.svelte';
	import Footer from '../lib/_components/Footer.svelte';
	import Sidebar from '$lib/_components/Sidebar.svelte';
	import UserSVG from '$lib/_components/icons/UserSVG.svelte';
	import { onMount } from 'svelte';
	import { state } from '$lib/store';
	import { Toast } from '@skeletonlabs/skeleton';
	import "@fontsource/kanit";
	import type { LayoutData } from './$types';

	export let data: LayoutData;


    /*function scrollHandler(event: any & { currentTarget: EventTarget & HTMLDivElement; }) {
		// console.log(event.currentTarget.scrollTop);
	}*/

</script>

<AppShell class="bg-surface-900 min-w-[20rem]" regionPage="relative" slotHeader="z-10 hidden md:block" 
slotFooter="h-20 md:h-0 bg-surface-800 w-full transition ease-in-out translate-y-0 md:translate-y-20 delay-150 duration-800 animation motion-reduce:transition-none"
slotSidebarLeft="w-0 md:w-[14rem] h-full scroll-none text-gray-200 transition ease-in-out -translate-x-60 md:translate-x-1 delay-150 duration-800 motion-reduce:transition-none">
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<strong class="text-xl uppercase">Fur Buddies</strong>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<button class="md:hidden btn btn-sm">
					<span><svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
						<rect width="100" height="20" />
						<rect y="30" width="100" height="20" />
						<rect y="60" width="100" height="20" />
					</svg></span>
				</button>

				<a class="hidden md:block" href="/user/profile">
					<UserSVG/>
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<!-- Hidden below Tailwind's medium breakpoint -->
		<div id="sidebar-left" class="hidden md:block p-1">
			<Sidebar/>
		</div>
	</svelte:fragment>

	<div class="py-3 px-6 min-h-full">
		<PageTransition key="{data.pathname}">
			<slot/>
		</PageTransition>
	</div>

	<svelte:fragment slot="footer">
		<Footer/>
	</svelte:fragment>
</AppShell>
<Toast/>

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
