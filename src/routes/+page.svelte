<script lang="ts">
	import Carousel from 'svelte-carousel';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { clinicstate, petstate, state } from '$lib/store';
	import { onMount } from 'svelte';
	import { fade, fly, slide, type crossfade } from 'svelte/transition';

	export let data;

	onMount(async ()=>{
		try {
			// await clinicstate.fetch();
		} catch (error) {
			console.warn('Error fetching clinics. ', error);
			
		}
	});

	function countAnimalTypes(): void {
		// check pet state
		// iterate through number of different animal types
	}

	const guestDashboard = [
		{name: 'Doctor', value: $clinicstate.length, icon: 'mdi:doctor', route: '/clinics'},
		{name: 'Bird', value: 330912, icon: 'mdi:bird'},
		{name: 'Cat', value: 456, icon: 'mdi:cat'},
		{name: 'Dog', value: 22, icon: 'mdi:dog'},
		{name: 'Injection', value: 95434, icon: 'mdi:injection'},
		{name: 'Medicine', value: 127890, icon: 'mdi:pill'},
	]
	const dashboardItems = [
		{name: 'Doctor', value: $clinicstate.length, icon: 'mdi:doctor'},
		{name: 'Bird', value: 330912, icon: 'mdi:bird'},
		{name: 'Cat', value: 456, icon: 'mdi:cat'},
		{name: 'Dog', value: 22, icon: 'mdi:dog'},
		{name: 'Injection', value: 95434, icon: 'mdi:injection'},
		{name: 'Medicine', value: 127890, icon: 'mdi:pill'},
	]
	const carouselStories:any = [
		{ image: '/images/slider1.jpg', title: 'Council to ban certain breeds', story: 'Description goes here', link: 'https://simmons.studio', isActive: true },
		{ image: 'https://th.bing.com/th/id/OIP.O7ynhEfTIg0w3eUBu1SZ9wEyDM', title: 'Stray dogs on the rise', story: 'Description goes here', link: 'https://appwrite.io', isActive: true },
		{ image: 'https://th.bing.com/th/id/OIP.sz0-7EhYcQUFDQD7SPxUgAHaEA', title: null, story: 'Description goes here', link: null, isActive: true },
		{ image: 'https://res.cloudinary.com/petrescue/image/upload/h_638,w_638,c_pad,q_auto:best,f_auto/v1561053876/gjehpvxtpqmfcl9qtizu.jpg', title: 'Lost but found', story: 'Description goes here', link: null, isActive: true },
	]
</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName}</title>
	<meta name="description" content="{data.appName} Home" />
</svelte:head>

<!-- HTML body -->
<main>

	<!-- Carousel -->	

	{#if browser && carouselStories.length>0}
	<!-- Carousel containing information/ads from the server -->
	<Carousel autoplay autoplayDuration={4800} pauseOnFocus={false} dots={false} arrows={false} swiping={true}>
		{#each carouselStories as { image, title, story, link }}
			<a href={link}  target="_blank">
				<div class="w-full h-[14rem] relative">
					<img src={image} alt='' class="w-full h-full object-cover object-center">
					{#if title}
						<div class="absolute bottom-0 py-2 px-6 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 bg-opacity-80 min-w-1/3">
							<h2 class="m-0 font-medium">{title}</h2>
							<p class="m-0 text-sm">{story}</p>
						</div>
					{/if}
				</div>
			</a>
		{/each}
	</Carousel>
	{:else}
		<!-- If no carousel items, display default welcome image -->

		<div class="w-full h-[8rem] relative">
			<img src="images/Welcome.webp" alt="Welcome" class="w-full">
		</div>
	{/if}

	<!-- "Dashboard" -->

	<section class="px-{data.padding}">
		<!-- If no signed in User -->

		{#if !$state.account?.$id}
			<div class="my-8 w-full flex flex-col items-center justify-center">
				<h3 class="w-full title text-center">You're not logged in</h3>
				<button on:click={()=>goto('/auth/login')} class="btn variant-filled w-[10rem]">
					Log In
				</button>
			</div>
		{:else}

			<!-- Signed in User -->
			<div class="my-7 grid grid-cols-3 gap-6 col-gap-3">
				{#each dashboardItems as item, index}
					<div class="flex items-center justify-center text-center rounded-lg shadow-[0_1rem_1rem_rgba(0,0,0,0.2)] hover:shadow-none w-[6rem] h-[6rem] transition-shadow">
						<button on:click={()=>console.info('Button tapped')} class="btn  flex flex-col items-center justify-center gap-2">
							<iconify-icon icon={item.icon || ''} class=" text-4xl"></iconify-icon>
							{ item.value }
						</button>
					</div>
				{/each}
			</div>
		{/if}

		<div class="mt-[4rem] flex flex-col items-center justify-center">
			<p>{ $petstate?.length??0 } Clinics available</p>
			<button on:click={()=>goto('/clinics/register')} class="btn variant-filled-warning min-w-[12rem]">
				Register your Clinic
			</button>
		</div>
	</section>
</main>