<script lang="ts">
    import Carousel from 'svelte-carousel';
	import { page } from '$app/stores';
	import type { IClinic } from '$lib/_models/clinic-model';
	import { clinicstate, state } from '$lib/_stores/auth_store.js';
	import { onMount } from 'svelte';
	import { appSettings } from '$lib/_stores/settings_store.js';
	import { redirect } from '@sveltejs/kit';
	import { fade } from 'svelte/transition';
	import LoadingCircle from '$lib/_components/icons/Loading_Circle.svelte';
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
    import { filter } from '@skeletonlabs/skeleton';

    export let data;

    let clinic: IClinic;
    const defaultImage = '/images/vet.jpg';

    // Loaders
    let _loading: boolean = false;
    let _loadingPhotos: boolean = false;

    onMount(async ()=>{
        try {
            _loading = true;
            await clinicstate.fetch();
            _loading = false;
        } catch (error) {
            _loading = false;
            throw redirect(307, '/clinics')
        }
        

        clinic = $clinicstate.find(()=>$page.params.slug) as IClinic;

        console.log(clinic);
        
        
    });


    let interactions: Record<string, boolean> = {
        Recommend: false
    };


    const carouselStories:any = [
		{ image: '../images/slider1.webp', title: 'Council to ban certain breeds', details: 'Description goes here', link: 'https://simmons.studio', isActive: true },
		{ image: 'https://th.bing.com/th/id/OIP.O7ynhEfTIg0w3eUBu1SZ9wEyDM', title: 'Stray dogs on the rise', details: 'Description goes here', link: 'https://appwrite.io', isActive: true },
		{ image: 'https://th.bing.com/th/id/OIP.sz0-7EhYcQUFDQD7SPxUgAHaEA', title: '', story: 'Description goes here', link: '', isActive: true },
		{ image: 'https://res.cloudinary.com/petrescue/image/upload/h_638,w_638,c_pad,q_auto:best,f_auto/v1561053876/gjehpvxtpqmfcl9qtizu.jpg', title: 'Lost but found', details: 'Description goes here', link: '', isActive: true },
	]
    
</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | Clinic</title>
	<meta name="description" content="View Clinic" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">

    <!-- Carousel containing Clinic's photos -->
    <div class="max-w-2xl mx-auto max-h-[14rem] rounded-2xl overflow-hidden mb-8">
        <!-- svelte-ignore missing-declaration -->
        {#if !_loadingPhotos}
            <!-- display default static welcome image while loading -->
            <div class="h-full w-full">
                <img src={ defaultImage } alt="Welcome" class="w-full h-[14rem] object-cover object-center">
            </div>
        {:else if $state.account?.emailVerification}
            <Carousel autoplay autoplayDuration={4400} pauseOnFocus={false} dots={true} arrows={false} swiping={true}>
                {#each carouselStories as { image, title, details, link }}
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
        {/if}
    </div>
    
    <!-- Clinic Name -->
    <h3 class="text-2xl text-center flex justify-center" in:fade={{ duration:600}}>
        {#if _loading}<LoadingClock/>{:else}{clinic?.name}{/if}
    </h3>

    <!-- Clinic details -->
    {#if _loading }

        <section class="surface-card w-full my-4">
                <div class="w-full text-center gap-4" >
                    <div class="placeholder" />
                </div>
        </section>

    {:else}

        <div in:fade={{ duration: 600 }} class="flex justify-evenly flex-wrap">
            <div class="w-full text-center gap-4">
                <!--
                {#each Object.keys(interactions) as f}
                    <span
                        class="chip {interactions[f] ? 'variant-filled' : 'variant-soft'}"
                        on:click={()=>filter(f)} on:keypress>
                        {#if interactions[f]}<span><iconify-icon icon="mdi:thumbs-up"></iconify-icon></span>{/if}
                        <span class="capitalize">{f}</span>
                    </span>
                {/each}
                -->
            </div>
            

            <p class={clinic?.city ? 'flex' : 'hidden'}>City: { clinic?.city }</p>
            <p class={clinic?.location ? 'flex' : 'hidden'}>Location: { clinic?.location }</p>

            <hr class="w-full my-4">

            <!-- Contact Info -->
            <div class="w-full p-4 flex justify-evenly my-{data.padding}">
                <a href="tel:{clinic?.phoneNumber}" class="{clinic?.phoneNumber ? 'flex' : 'hidden'} btn variant-filled-secondary">
                    <iconify-icon icon="mdi:phone" class="mr-3"></iconify-icon>Call Us
                </a>
                <a href="mailto:{clinic?.email}" class="{clinic?.email ? 'flex' : 'hidden'} btn variant-filled-primary">
                    <iconify-icon icon="mdi:email" class="mr-3"></iconify-icon>Email Us
                </a>
                <button class="{clinic?.location ? 'flex' : 'hidden'} btn variant-filled-tertiary">
                    <iconify-icon icon="mdi:location" class="mr-3"></iconify-icon>Get Directions
                </button>
                <button class="btn variant-filled-surface">
                    <iconify-icon icon="mdi:chevron-double-down" class="mr-3"></iconify-icon>Book Appointment
                </button>
            </div>

            <hr class="w-full my-4">

            <!-- Services-->
            <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-6 my-{data.padding}">
                <div class="bg-surface-500 bg-opacity-40 p-4 flex md:flex-col items-center md:items-start gap-x-4 rounded-xl">
                    <span class="badge bg-primary-500 mx-auto p-3 mb-4">💀</span>
                    <span class="flex-auto">
                        <dt>Service Title</dt>
                        <dd>Service Description</dd>
                    </span>
                </div>

                <div class="bg-surface-500 bg-opacity-40 p-4 flex md:flex-col items-center md:items-start gap-x-4 rounded-xl">
                    <span class="badge bg-primary-500 mx-auto p-3 mb-4">💀</span>
                    <span class="flex-auto">
                        <dt>Service Title</dt>
                        <dd>Service Description</dd>
                    </span>
                </div>
            </div>
        </div>
    {/if}
    
</main>

<style>
    p {
        font-size: 1rem;
        font-weight: 200;
    }
    dt {
        font-size: 1.2rem;
        font-weight: 400;
    }
    dl {
        font-weight: 200;
    }
</style>