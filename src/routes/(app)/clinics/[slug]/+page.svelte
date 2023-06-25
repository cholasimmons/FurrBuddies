<script lang="ts">
    import Carousel from 'svelte-carousel';
	import { page } from '$app/stores';
	import type { IClinic } from '$lib/_models/clinic-model';
	import { clinicstate, petbucketstate, state } from '$lib/_stores/auth_store.js';
	import { vetphotostate, vetstate } from '$lib/_stores/vet_store.js';
	import { onMount } from 'svelte';
	import { appSettings } from '$lib/_stores/settings_store.js';
	import { redirect } from '@sveltejs/kit';
	import { fade } from 'svelte/transition';
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
    import { Ratings, filter } from '@skeletonlabs/skeleton';
	import { getWorkingHours, isItNow, isItToday } from '$lib/_utilities/time-manipulation.js';

    // imported data from +layout.ts (padding)
    export let data;

    let clinic: IClinic;
    let clinicPhotos: string[] = [];
    let clinicServices: {title: string, description: string}[] = [];

    const defaultImage = '/images/vet.jpg';

    // Loaders
    let _loading: boolean = false;
    let _loadingPhotos: boolean = false;

    onMount(async ()=>{
        try {
            _loading = true;

            if(!$state.account?.$id)
                await state.checkLoggedIn();

            // Find selected clinic for detail view
            clinic = await vetstate.fetchVet($page.params.slug) as IClinic;

            if(!clinic) {_loading = false; throw new Error('Could not find Clinic')}
            
            // Load this clinic's images since clinic exists
            _loadingPhotos = true;
            clinic.photoID.forEach(async (id) => {
                if(id !== null || id !== undefined){
                    const prvw = await vetphotostate.getPreview(id);
                    if(!prvw) return;
                    clinicPhotos.push(prvw.href);
                    console.log('Loaded preview: ',prvw);
                }
            });

            _loadingPhotos = false;
            _loading = false;
        } catch (error) {
            _loading = false;
            _loadingPhotos = false;
            console.log('Problem fetching clinics. ',error);
            
            throw redirect(302, '/clinics')
        }
    });

    // verifies clinic owner with currently logged in user
    function verifyPermission(): boolean {
        if(!clinic || !$state.account) return false;
        console.log('Current User ID: ',$state.account?.$id);
        console.log('Clinic Owner ID: ',clinic.ownerID);
        
        return clinic.ownerID === $state.account?.$id ? true: false;
    }

    

    $: clinic = clinic;
    $: services = clinic?.serviceTitle.filter((service, i) => {
        clinicServices.push({title: service, description: clinic.serviceDescription?.[i] ?? ''})
        });
</script>

<!-- HTML head -->
<svelte:head>
	<title>{$appSettings.app.name} | Clinic</title>
	<meta name="description" content="View Clinic" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">

    <!-- Carousel containing Clinic's photos -->
    <div class="w-full h-[14rem] rounded-2xl overflow-hidden mb-6">

        {#if _loadingPhotos || clinicPhotos.length < 1}
            <!-- display default static welcome image while loading -->
            <!-- additional message asking to upoad images if they are the owner-->
            <div class="h-full w-full relative" out:fade={{ duration:100 }}>
                <img src={ defaultImage } alt="Welcome" class="w-full h-[14rem] object-cover object-center">

                {#if verifyPermission()}
                <div on:click={()=>{console.log('Modal to upload images')}} on:keypress aria-label="Prompt to upload photos" class="carousel-text cursor-pointer">
                    <h2 class="m-0 font-medium">Upload photos of your Clinic</h2>
                    <p class="m-0 text-sm">click here to add photos</p>
                </div>
                {/if}
            </div>
        {:else if $state.account?.emailVerification}
            <Carousel autoplay autoplayDuration={4400} pauseOnFocus={false} dots={true} arrows={false} swiping={true}>
                {#each clinicPhotos as image, index }
                    <div in:fade={{ duration:200, delay: 110 }} out:fade={{ duration:100 }} class="w-full h-full relative">
                        <img src={image} alt='' class="w-full h-[14rem] object-cover object-center">
                        <!--{#if title}
                            <div class="carousel-text">
                                <h2 class="m-0 font-medium">{title}</h2>
                                <p class="m-0 text-sm">{details}</p>
                            </div>
                        {/if}-->
                    </div>
                {/each}
            </Carousel>
        {/if}
    </div>
    
    <!-- Clinic Name -->
    <h3 class="text-2xl text-center flex justify-center" in:fade={{ duration:600}}>
        {#if _loading}<LoadingClock/>{:else}<span title={clinic?.$id ?? ''}>{clinic?.name ?? ''}</span>{/if}
    </h3>

    <!-- Clinic details -->
    {#if !_loading }

        <div in:fade={{ duration: 600 }} class="flex justify-evenly flex-wrap">
            <div class="w-full text-center gap-4">
                
                <Ratings spacing="3" max={5} value={1.5}>
                    <svelte:fragment slot="empty">&nbsp;</svelte:fragment>
                    <svelte:fragment slot="half">⭕</svelte:fragment>
                    <svelte:fragment slot="full">🔴</svelte:fragment>
                </Ratings>
                
            </div>
            

            <p class={clinic?.city ? 'flex' : 'hidden'}>{ (clinic?.address ?? '') } { clinic?.city ?? '' }</p>
            <p class={clinic?.location ? 'flex' : 'hidden'}>Location: { clinic?.location }</p>


            <!-- Contact Info -->
            <div class="w-full p-4 flex flex-col gap-y-3 items-center justify-evenly my-{data.padding} bg-gradient-to-r from-transparent via-primary-400 dark:via-tertiary-800 to-transparent">
                <!--<div class="flex justify-evenly">
                    
                    <a href="tel:{clinic?.phoneNumber}" class="{clinic?.phoneNumber ? 'flex' : 'hidden'} btn variant-filled-secondary">
                        <iconify-icon icon="mdi:phone" class="mr-3"></iconify-icon>Call Us
                    </a>
                    <a href="mailto:{clinic?.email}" class="{clinic?.email ? 'flex' : 'hidden'} btn variant-filled-primary">
                        <iconify-icon icon="mdi:email" class="mr-3"></iconify-icon>Email Us
                    </a>
                    <button class="{clinic?.location ? 'flex' : 'hidden'} btn variant-filled-tertiary">
                        <iconify-icon icon="mdi:location" class="mr-3"></iconify-icon>Get Directions
                    </button>
                </div>-->
                <div class="flex justify-center">
                    <button class="btn  hover:bg-tertiary-400 hover:text-black">
                        <iconify-icon icon="mdi:chevron-double-down" class="mr-3"></iconify-icon>Book Appointment
                    </button>
                </div>
                
            </div>

            <!-- Working Hours -->
            <section>
                <div>
                    {#if clinic?.hours_sun?.[0]}<p class={ isItToday(0) ? "font-bold" : ''}>Sunday: <span>{ getWorkingHours(clinic?.hours_sun[0]) } - { getWorkingHours(clinic?.hours_sun[1]) }</span><span class="ml-2 font-normal ">- { isItNow(clinic?.hours_sun[0],clinic?.hours_sun[1]) ? 'Open' : 'Closed'}</span></p>{/if}
                    {#if clinic?.hours_mon?.[0]}<p class={ isItToday(1) ? "font-bold" : ''}>Monday: <span>{ getWorkingHours(clinic?.hours_mon[0]) } - { getWorkingHours(clinic?.hours_mon[1]) }</span></p>{/if}
                    {#if clinic?.hours_tue?.[0]}<p class={ isItToday(2) ? "font-bold" : ''}>Tuesday: <span>{ getWorkingHours(clinic?.hours_tue[0]) } - { getWorkingHours(clinic?.hours_tue[1]) }</span></p>{/if}
                    {#if clinic?.hours_wed?.[0]}<p class={ isItToday(3) ? "font-bold" : ''}>Wednesday: <span>{ getWorkingHours(clinic?.hours_wed[0]) } - { getWorkingHours(clinic?.hours_wed[1]) }</span></p>{/if}
                    {#if clinic?.hours_thu?.[0]}<p class={ isItToday(4) ? "font-bold" : ''}>Thursday: <span>{ getWorkingHours(clinic?.hours_thu[0]) } - { getWorkingHours(clinic?.hours_thu[1]) }</span></p>{/if}
                    {#if clinic?.hours_fri?.[0]}<p class={ isItToday(5) ? "font-bold" : ''}>Friday: <span>{ getWorkingHours(clinic?.hours_fri[0]) } - { getWorkingHours(clinic?.hours_fri[1]) }</span></p>{/if}
                    {#if clinic?.hours_sat?.[0]}<p class={ isItToday(6) ? "font-bold" : ''}>Saturday: <span>{ getWorkingHours(clinic?.hours_sat[0]) } - { getWorkingHours(clinic?.hours_sat[1]) }</span></p>{/if}
                </div>
            </section>

            <!-- Services-->
            <div class="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 my-{data.padding}">
                {#each clinicServices as service}
                    <div class="bg-surface-500 bg-opacity-40 p-4 flex md:flex-col items-center md:justify-center gap-x-3 rounded-xl">
                        <span class="md:hidden badge bg-primary-800 dark:bg-primary-600 p-3">💀</span>
                        <span class="">
                            <dt>{ service.title }</dt>
                            <dd>{ service.description }</dd>
                        </span>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
    
</main>

<style>
    dt {
        font-size: 1.05rem;
        font-weight: 400;
    }
    dd {
        font-size: 0.9rem;
        font-weight: 300;
        padding: 0; margin: 0;
    }
    .carousel-text {
        @apply absolute bottom-0 py-2 px-6 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 bg-opacity-90 min-w-[1/3] rounded-tr-xl;
    }
</style>