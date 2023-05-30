<script lang="ts">
    // Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-sahara.css';

    // This contains the bulk of Skeletons required styles:
    // NOTE: this will be renamed skeleton.css in the v2.x release.
    import '@skeletonlabs/skeleton/styles/skeleton.css';

    // Finally, your application's global stylesheet (sometimes labeled 'app.css')
    import '../global.postcss';

    import {AppShell, AppBar, Avatar, AppRail, AppRailTile, AppRailAnchor} from '@skeletonlabs/skeleton';
    import PageTransition from '$lib/_components/Transition.svelte';
	import Sidebar from '$lib/_components/Sidebar.svelte';
	import UserSVG from '$lib/_components/icons/UserSVG.svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';
	import { state } from '$lib/store';
	import { fade, scale, slide } from 'svelte/transition';
	import BackButton from '$lib/_components/icons/BackButton.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Shop from './shop/+page.svelte';
	import BuddyCard from '$lib/_components/BuddyCard.svelte';
	import RightPage from '$lib/_components/RightPage.svelte';

	// "isLoading" type of boolean
	export let data: LayoutData;

	// Disregard
	let currentTile: any;

	// Routes to display in the AppBar via getRouteName() function
	const routes: { [key: string]: string } = {
		// '/': 'Home',
		'/pets': 'My Buddies',
		'/pets/add': 'Add a Buddy',
		'/clinics': 'Clinics',
		'/clinics/register': 'Register a Clinic',
		'/mail': 'Mail',
		'/shop': 'Shop',
		'/setup': 'Setup',
		'/contact': 'Contact',
		'/auth/login': 'Login',
		'/auth/register': 'Sign Up',
		'/auth/pass-forgot': 'Forgotten Password',
		'/auth/pass-reset': 'Password Reset',
		'/user/profile': 'User Profile',
	};

	onMount(async ()=>{
		try {
			await state.checkLoggedIn();
			toast.success('Welcome back '+splitNames()+'!' );
		} catch (error) {
			// console.warn('No signed in User.');
			toast.error('Hello there stranger', {icon: '👋🏾'});
		}
	});

	// Divides a full name object and retrieves the first name, for the toast greeting, putting aside titles
	const splitNames = () => {
		const fullname = $state.account?.name || 'Stranger'
		const namesArray = fullname!.split(" "); // Split the sentence into an array of words

		if (namesArray.length >= 1) {
			if(['Mr','Mrs','Dr','Ms','Miss','Sir'].includes(namesArray[0])){
				return namesArray[1];
			}
			return namesArray[0]; // Get the first name
		}
	}

	// Function that returns name to display in AppBar, from routes list above
	function getRouteName(route: string):string {
		const routeKeys = Object.keys(routes);

		// Check if the current route is an exact match
		if (routes.hasOwnProperty(route)) {
			return routes[route];
		}

		// Check if the current route is a child of a listed route
		for (let i = 0; i < routeKeys.length; i++) {
			if (route.startsWith(routeKeys[i])) {
			return routes[routeKeys[i]];
			}
		}
		return 'Furr Buddies';
	}

    /*function scrollHandler(event: any & { currentTarget: EventTarget & HTMLDivElement; }) {
		// console.log(event.currentTarget.scrollTop);
	}*/

</script>

<AppShell class="min-w-[18rem]" regionPage="relative" slotHeader="z-10 p-0 m-0" slotPageContent=""
slotFooter="h-1rem md:h-0 w-full transition ease-in-out translate-y-0 md:translate-y-20 delay-100 duration-800 animation motion-reduce:transition-none"
slotSidebarLeft="w-0 md:w-[11rem] h-full scroll-none text-gray-200 transition ease-in-out -translate-x-60 md:translate-x-1 delay-150 duration-800 motion-reduce:transition-none">
	<svelte:fragment slot="header">
		<AppBar background="">
			<svelte:fragment slot="lead">
				{#if ['/pets/', '/clinics/', '/mail/'].some(path => $page.url.pathname.startsWith(path))}
				<button in:slide={{ duration: 300, axis: 'x'}} out:slide={{ duration:200, axis: 'x' }} on:click={()=>{history.back()}}>
					<BackButton />
				</button>
				{/if}
			</svelte:fragment>
				<p class="text-2xl font-semibold uppercase">{ getRouteName($page.url.pathname) } </p>
			<svelte:fragment slot="trail">
				<a class="" href="/user/profile">
					{#if $state.account?.$id === undefined}
						<UserSVG/>
					{:else}
					<span in:fade={{ duration: 400 }}>
						<Avatar src="/images/user.jpg" initials="{splitNames()}" border="{ $state.account?.emailVerification ? 'border-2' : 'border-[4px] border-red-500'}" width="w-[3rem]" />
					</span>
					{/if}
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<!-- Hidden below Tailwind's medium breakpoint -->
		<div id="sidebar-left" class="hidden md:block">
			<Sidebar/>
		</div>
<!--
		<AppRail>
			<svelte:fragment slot="lead">
				<AppRailAnchor href="/" >(icon)</AppRailAnchor>
			</svelte:fragment>

			<AppRailTile bind:group={currentTile} name="tile-1" value={0}>
				<svelte:fragment slot="lead">(icon)</svelte:fragment>
				<span>Tile 1</span>
			</AppRailTile>
			<AppRailTile bind:group={currentTile} name="tile-2" value={1}>
				<svelte:fragment slot="lead">(icon)</svelte:fragment>
				<span>Tile 2</span>
			</AppRailTile>
			<AppRailTile bind:group={currentTile} name="tile-3" value={2}>
				<svelte:fragment slot="lead">(icon)</svelte:fragment>
				<span>Tile 3</span>
			</AppRailTile>

			<svelte:fragment slot="trail">
				<AppRailAnchor href="/" target="_blank" title="Account">(icon)</AppRailAnchor>
			</svelte:fragment>
		</AppRail>
-->
	</svelte:fragment>

	<div class="flex h-full">
		<div class="min-h-full w-full xl:max-w">
			<PageTransition key="{data.pathname}">
				<slot/>
			</PageTransition>
		</div>
		<div class="hidden p-4 min-h-full xl:block xl:w-[28rem] bg-gray-800 bg-opacity-10">
			<RightPage/>
			<!-- Possibility to add more views on larger screens -->
		</div>
	</div>

	<svelte:fragment slot="footer">
		<Sidebar/>
	</svelte:fragment>
</AppShell>

<!-- Buttery smooth and simple toast, from Svelte French Toast = https://svelte-french-toast.com/ -->
<Toaster position="bottom-center" toastOptions="{{duration: 3600, style: 'position:relative; bottom:4rem'}}"/>

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
