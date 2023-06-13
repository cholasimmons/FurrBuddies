<script lang="ts">

    // Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-hamlindigo.css';

    // This contains the bulk of Skeletons required styles:
    // NOTE: this will be renamed skeleton.css in the v2.x release.
    import '@skeletonlabs/skeleton/styles/skeleton.css';

    // Finally, your application's global stylesheet (sometimes labeled 'app.css')
    import '../../global.postcss';

    import {AppShell, AppBar, Avatar, LightSwitch, setModeUserPrefers, setModeCurrent, modeCurrent, getModeUserPrefers } from '@skeletonlabs/skeleton';
	import { storePopup, popup, Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent, PopupSettings } from '@skeletonlabs/skeleton';

	// Theme features
	// import { setInitialClassState } from '@skeletonlabs/skeleton';
	// import { autoModeWatcher } from '@skeletonlabs/skeleton';

	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

	
    import PageTransition from '$lib/_components/Transition.svelte';
	import Sidebar from '$lib/_components/Sidebar.svelte';
	import UserSVG from '$lib/_components/icons/UserSVG.svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import type { LayoutData } from './auth/$types';
	import { onMount } from 'svelte';
	import { state, userbucketstate } from '$lib/_stores/auth_store';
	import { fade, slide } from 'svelte/transition';
	import BackButton from '$lib/_components/icons/BackButton.svelte';
	import { page } from '$app/stores';
	import RightPage from '$lib/_components/RightPage.svelte';
	import { goto } from '$app/navigation';
	import { getFirstName, removePrefix } from '$lib/_utilities/split-names';
	import { appSettings } from '$lib/_stores/settings_store';

	// "isLoading" type of boolean
	export let data: LayoutData;

	// User avatar
	let imageURL: string = '';
	const fallbackImage = '/images/FurrPrints.webp';

	// Routes to display in the AppBar via getRouteName() function below
	const routes: { [key: string]: string } = {
		// '/': 'Home',
		'/pets': 'My Buddies',
		'/pets/add': 'Add a Buddy',
		'/clinics': 'Clinics',
		'/clinics/register': 'Register your Clinic',
		'/mail': 'Mail',
		'/shop': 'Shop',
		'/setup': 'Setup',
		'/contact': 'Contact',
		'/auth/login': 'Login',
		'/auth/register': 'Sign Up',
		'/auth/pass-forgot': 'Forgotten Password',
		'/auth/pass-reset': 'Password Reset',
		'/user/profile': 'User Profile',
		'/legal/terms': 'Terms and Conditions'
	};

	onMount(async ()=>{
		try {
			await state.checkLoggedIn();
			
			toast.success('Welcome back '+getFirstName($state.account?.name || 'Stranger')+'!' );

			// Personalize App
			setModeUserPrefers($state.account?.prefs.lightMode ?? $appSettings.lightMode);
			setModeCurrent($state.account?.prefs.lightMode ?? $appSettings.lightMode);
			setModeCurrent($modeCurrent); 
			
			// state.updateUserPrefs({'lightMode':$modeCurrent})
			// Demo of User Prefs as settings
			// appSettings.setSettings('showCarousel', $state.account?.prefs.showCarousel ?? $appSettings.showCarousel)
		} catch (error) {
			// console.warn('No signed in User.');
			toast.error('Hello there Stranger', {icon: '👋🏾'});
			modeCurrent.set($appSettings.lightMode ? true : false);
		}
	});

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
		return data.appName;
	}

	// Dropdown menu from the avatar icon
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	const popupCloseQuery: PopupSettings = {
		event: 'click',
		target: 'popupCloseQuery',
		closeQuery: '#will-close'
	};

	function debug(e:any) {
		console.log(e);
	}

	$: imageURL = $userbucketstate.userPhoto?.href ?? '';
	$: initials = $state.initials ?? 'ZM';
	$: { state.updateUserPrefs({'lightMode': $modeCurrent}); }
	
</script>

<!-- Dark Mode feature -->
<!--svelte:head>{@html `<script>(${setInitialClassState.toString()})();</script>`}</svelte:head-->
<!--svelte:head>{@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}</svelte:head-->

<Modal/>

<AppShell class="min-w-[16rem]" regionPage="relative" slotHeader="z-20 p-0 m-0" slotPageContent=""
slotFooter="h-1rem md:h-0 w-full transition-transform ease-in-out translate-y-0 md:translate-y-20 delay-50 duration-800 animation motion-reduce:transition-none"
slotSidebarLeft="w-0 md:w-[11rem] h-full scroll-none transition ease-in-out -translate-x-60 md:translate-x-1 delay-150 duration-800 motion-reduce:transition-none">
	<svelte:fragment slot="header">

		<!-- Skeleton UI Appbar -->

		<AppBar background="">
			<svelte:fragment slot="lead">
				{#if ['/pets/', '/clinics/', '/mail/'].some(path => $page.url.pathname.startsWith(path))}
				<button in:slide={{ duration: 300, axis: 'x'}} out:slide={{ duration:200, axis: 'x' }} on:click={()=>{history.back()}}>
					<BackButton />
				</button>
				{/if}
			</svelte:fragment>
				<p class="text-xl md:text-2xl font-semibold uppercase">{ getRouteName($page.url.pathname) } </p>
			<svelte:fragment slot="trail">
				<LightSwitch/>
				<button use:popup={popupCloseQuery} on:keypress>
					{#if !$state.account}
						<UserSVG/>
					{:else}
						<Avatar src={ imageURL ? imageURL : initials }  fallback={fallbackImage} border="{ $state.account?.emailVerification ? 'border-2 border-surface-500' : 'border-[2px] border-red-400'}" width="w-[3rem]" title={ getFirstName($state.account.name ?? '')} background="bg-surface-900" />
					{/if}
				</button>
			</svelte:fragment>

			<!-- Appbar Menu (top-right) -->

			<div class="surface-card p-4 max-w-sm -ml-4" data-popup="popupCloseQuery">
				<div class="grid grid-cols-1 gap-3 text-right z-50" id="userMenu">
					{#if !$state.account}
						<button class="bg-surface-100 hover:bg-green-300 hover:rotate-3 btn btn-lg" on:click={()=>goto('/auth/login')} id="will-close"><iconify-icon icon="mdi:lock-open"></iconify-icon> Log In</button>
						<button class="bg-gray-100 hover:bg-orange-200 hover:rotate-3 btn btn-lg" on:click={()=>goto('/auth/register')} id="will-close"><iconify-icon icon="mdi:edit"></iconify-icon> Sign Up</button>
					{:else if $state.account}
						<button class="bg-surface-100 hover:bg-green-300 hover:-rotate-3 btn btn-lg" on:click={()=>goto('/user/profile')} id="will-close"><iconify-icon icon="mdi:user"></iconify-icon> My Account</button>
						<button class="bg-gray-100 hover:bg-red-400 hover:-rotate-3 btn btn-lg" on:click={()=>goto('/auth/logout')} id="will-close"><iconify-icon icon="mdi:lock"></iconify-icon> Log Out</button>
						<button class="bg-gray-100 hover:bg-indigo-400 hover:rotate-3 btn btn-lg" on:click={()=>goto('/help/bugs')} id="will-close"><iconify-icon icon="mdi:bug"></iconify-icon> Report a Bug</button>
					{/if}
						<button class="bg-gray-100 hover:bg-pink-300 hover:-rotate-3 btn btn-lg" on:click={()=>goto('/about')} id="will-close"><iconify-icon icon="mdi:about"></iconify-icon> About</button>
					
				</div>
				<!--div class="arrow bg-surface-100-800-token" /-->
			</div>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<!-- Hidden below Tailwind's medium breakpoint -->
		<div id="sidebar-left" class="hidden md:block">
			<Sidebar/>
		</div>
	</svelte:fragment>

	<div class="flex h-full justify-center">
		<div class="min-h-full w-full lg:max-w-3xl">
			<PageTransition key="{data.pathname}">
				<slot/>
			</PageTransition>
		</div>
		<!--div class="hidden p-4 min-h-full xl:block pr-8 bg-gray-800 bg-opacity-10">
			<RightPage/>
		</div-->
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

	#userMenu > button {
		@apply bg-opacity-80 text-black px-5 py-1 text-left rounded-lg flex items-center gap-2 transition ease-in-out;
	}
	#userMenu > button:hover {
		@apply bg-opacity-80 -translate-x-1;
	}
	
</style>
