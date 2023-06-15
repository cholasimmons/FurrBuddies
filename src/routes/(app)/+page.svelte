<script lang="ts">
	import Carousel from 'svelte-carousel';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { ads, clinicstate, petstate, state } from '$lib/_stores/auth_store.js';
	import { onMount } from 'svelte';
	import { fade, fly, slide, type crossfade } from 'svelte/transition';
	import { Gender, Type } from '$lib/_models/pet-model.js';
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
	import BuddyCard from '$lib/_components/BuddyCard.svelte';
	import { getFirstName } from '$lib/_utilities/split-names';
	import { appSettings } from '$lib/_stores/settings_store.js';
	import { cubicInOut } from 'svelte/easing';

	export let data;

	// Loaders
	let _loadingVets: boolean = true;
	let _loadingPets: boolean = true;

	// Activation Email Loader
	let _sending: boolean = false;
	let _sent: boolean = false;

	onMount(async ()=>{
		try {
			await state.checkLoggedIn();

			if($state.account?.prefs.showCarousel){
				ads.fetch();
			}

			await petstate.fetch();
			_loadingPets = false;

			await clinicstate.fetch();
			_loadingVets = false;
			dashboardItems;
		} catch (error) {
			console.warn('Error . ', error);
			_loadingPets = false;
			_loadingVets = false;
		}
	});

	let petCount:number;

	// Count types of owned animals for dashboard
	function countAnimalTypes(type: string): number {
		petCount = 0;

		// check pet state
		if($petstate.pets.length < 1) return petCount;

		// iterate through number of different animal types
		$petstate.pets.forEach(pet => 
			pet.type === type ? petCount += 1 : null
		)
		return petCount;
	}

	// Resend email with verification link
    async function resendActivationEmail() {
        _sending = true;
        await state.sendVerificationEmail();
        _sent = true;
        _sending = false;
    }

	const dashboardItems = [
		{name: 'Dog', value: countAnimalTypes(Type.DOG), icon: 'mdi:dog', title: 'Your available Dog\'s'},
		{name: 'Cat', value: countAnimalTypes(Type.CAT), icon: 'mdi:cat', title: 'Your available Cat\'s'},
		{name: 'Bird', value: countAnimalTypes(Type.BIRD), icon: 'mdi:bird', title: 'Your available Bird\'s'},
		{name: 'Doctor', value: $clinicstate.length, icon: 'mdi:doctor', title: 'Available Vet\'s'}
/*		
		{name: 'Injection', value: 95434, icon: 'mdi:injection'},
		{name: 'Medicine', value: 127890, icon: 'mdi:pill'}
*/
	]

	$:carousel = $ads;

</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName}</title>
	<meta name="description" content="{data.appName} Home" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">

	<!-- Carousel slideshow -->	

	{#if browser && carousel.length>0 && $appSettings.showCarousel }
		<!-- Carousel containing information/ads from the server -->
		<div class="max-w-xl mx-auto max-h-[14rem] rounded-2xl overflow-hidden">
		<Carousel autoplay autoplayDuration={4400} pauseOnFocus={false} dots={false} arrows={false} swiping={true}>
			{#each carousel as { image, title, details, link }}
				<a href={link}  target="_blank">
					<div class="w-full h-[14rem] relative">
						<img src={image} alt='' class="w-full h-[14rem] object-cover object-center">
						{#if title}
							<div class="absolute bottom-0 py-2 px-6 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 bg-opacity-90 min-w-1/3 rounded-tr-xl">
								<h2 class="m-0 font-medium">{title}</h2>
								<p class="m-0 text-sm">{details}</p>
							</div>
						{/if}
					</div>
				</a>
			{/each}
		</Carousel>
		</div>
	{:else if $appSettings.showLandingImage}
		<!-- If no carousel items, display default static landing image -->
		<div class=" mx-auto w-full max-h-[12rem] rounded-2xl overflow-hidden">
			<img src={ $appSettings.landingImage } alt="Welcome" class="w-full h-[12rem] object-cover object-center">
		</div>
	{/if}

	<!-- "Dashboard" -->

	<section class="px-{data.padding}">

		<!-- If no signed in User -->

		{#if !$state.account || !$state.account.emailVerification}
			<div in:fade={{ duration:300 }} out:fade={{ duration: 150 }} class="my-8 w-full flex flex-col items-center justify-center">
				<h3 class="w-full title text-center">{ !$state.account ? 'A' : 'Your' } new account awaits you { !$state.account?.emailVerification ? getFirstName($state.account?.name??'') : '' }</h3>
				{#if $state.account?.emailVerification === false}

					<section class="my-6 p-6 bg-surface-800 dark:bg-surface-200 bg-opacity-10 dark:bg-opacity-10 rounded-lg">
						<div class="flex flex-col items-center">
							<small class="font-light opacity-70">Your account is not verified, check your email for the activation link.</small>
							<button in:fade={{duration:1000, delay: 4000, easing: cubicInOut}} class="text-500 btn gap-2 hover:bg-white hover:bg-opacity-20" on:click={resendActivationEmail} disabled={_sent}>
								<iconify-icon icon="mdi:mail"></iconify-icon>{ _sending ? 'Sending' : _sent ? '' : 'Resend' } Activation Link { _sent ? 'Sent' : '' }
							</button>
						</div>
					</section>
				{:else}
					<button on:click={()=>goto('/auth/login')} class="btn btn-sm variant-ghost w-[10rem]">
						Log In
					</button>
				{/if}
			</div>

		<!-- Signe In -->
		{:else}
			<hr>

			<!-- Dashboard circles - Signed in User -->
			<div in:fade={{ duration:100, delay: 160 }} class="my-8 h-[3rem] flex justify-evenly gap-2">
				{#if _loadingPets || _loadingVets}
					<div out:fade={{ duration:90 }} class="mx-auto w-full h-[2rem] rounded-xl placeholder animate-pulse bg-surface-800 bg-opacity-20">&nbsp;
					</div>
				{:else}
					<!-- Display animal status -->
					{#each dashboardItems as item, index}
						<div in:fade={{ duration:300, delay: 100*(index+1) }} title={ item.title }
							class="rounded-xl border-2 border-surface-500 shadow-[0_0.4rem_0.4rem_rgba(0,0,0,0.2)] hover:shadow-none transition-opacity bg-surface-50 dark:bg-surface-900 h-min">
							<button on:click={()=>console.info('Button tapped')} class="btn btn-sm text-left flex items-center py-1 px-3">
								<iconify-icon icon={item.icon ?? ''} class=" text-2xl"></iconify-icon>
								<span class="text-lg text-center">{ item.value }</span>
							</button>
						</div>
					{/each}
				{/if}
			</div>
			
			<!-- Display buddies if available -->
			{#if _loadingPets }
					<span class="animate-pulse" out:fade={{ duration:150}}>Checking on your buddies...</span>
			{:else}
				<!-- Display each available buddy -->
				<div in:fade={{ duration:500, delay: 180 }} class="my-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-6 gap-6  justify-center">
					
					<!-- Add a new Buddy -->
					<span on:click|preventDefault={()=>goto('/pets/add')} on:keypress in:fade={{ duration:300 }}>
						<main class="flex flex-col justify-center items-center text-center ">
							<div class="rounded-full w-[80%] pb-[50%] border-[50%] pt-8 relative flex flex-col justify-center items-center">
								Add Buddy
								<iconify-icon icon="mdi:plus" class="animate-ping text-3xl "></iconify-icon>
							</div>
						</main>
					</span>

					{#each $petstate.pets as pet, i}
						<span on:click|preventDefault={()=>goto('/pets/'+pet.$id)} on:keypress in:fade={{ duration:300, delay: 200*(i+1)}}>
							<BuddyCard petName={pet.name} photoID={ pet.photoID?.[0] ?? '' } />
						</span>
					{/each}
				</div>
			{/if}

		{/if}

		<div class="mt-[2rem] hidden flex-col items-center justify-center transition-transform">
			<p>{ $clinicstate?.length??0 } Clinics available</p>
		</div>
	</section>
</main>

<style>
	main {
        padding-bottom:50%; /* Maintain 1:1 aspect ratio */
	}
    .circle{
        position: absolute;
        border-radius: 50%;
        overflow: hidden;
    }
</style>