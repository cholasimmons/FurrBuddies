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

	export let data: LayoutData;
	let currentTile: any;

	onMount(async ()=>{
		try {
			await state.checkLoggedIn();
			toast.success('Welcome back '+splitNames()+'!', {duration:3000, style:'mb-[2rem]', position: 'bottom-center'});
		} catch (error) {
			console.warn('No signed in User.');
			toast.error('Hello there stranger', {icon: 'wave', duration: 3600});
			// console.log('Implement Toast notifications');   
		}
		
	});

	const splitNames = () => {
		const fullname = $state.account?.name || 'Stranger'
		const namesArray = fullname!.split(" "); // Split the sentence into an array of words

		if (namesArray.length >= 1) {
			if(namesArray[0]===('Mr'||'Mrs'||'Dr'||'Ms'||'Miss')){
				return namesArray[1];
			}
			return namesArray[0]; // Get the first name
		}
	}


    /*function scrollHandler(event: any & { currentTarget: EventTarget & HTMLDivElement; }) {
		// console.log(event.currentTarget.scrollTop);
	}*/

</script>

<AppShell class="min-w-[18rem]" regionPage="relative" slotHeader="z-10 px-3 py-0"
slotFooter="h-20 md:h-0 w-full transition ease-in-out translate-y-0 md:translate-y-20 delay-100 duration-800 animation motion-reduce:transition-none"
slotSidebarLeft="w-0 md:w-[11rem] h-full scroll-none text-gray-200 transition ease-in-out -translate-x-60 md:translate-x-1 delay-150 duration-800 motion-reduce:transition-none">
	<svelte:fragment slot="header">
		<AppBar background="">
			<svelte:fragment slot="lead">
				{#if $page.url.pathname.startsWith(('/pets/'||'/clinics/'||'/mail/'))}
				<button in:slide={{ duration: 300, axis: 'x'}} out:slide={{ duration:200, axis: 'x' }} on:click={()=>{history.back()}}>
					<BackButton />
				</button>
				{/if}
			</svelte:fragment>
				<p class="text-2xl font-bold uppercase">Furr Buddies</p>
			<svelte:fragment slot="trail">
				<a class="" href="/user/profile" in:fade="{{ duration: 300 }}">
					{#if $state.account?.$id}
						<Avatar src="/images/user.jpg" initials="{splitNames()}" background="bg-transparent" border="border-2" width="w-[3rem]" />
					{:else}
						<UserSVG/>
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

	<div class="px-6 min-h-full">
		<PageTransition key="{data.pathname}">
			<slot/>
		</PageTransition>
	</div>

	<svelte:fragment slot="footer">
		<Sidebar/>
	</svelte:fragment>
</AppShell>
<Toaster position="bottom-center" toastOptions="{{duration: 4000, style: 'bottom:5rem'}}"/>

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
