<script lang="ts">
	import type { IMail } from '$lib/_models/mail-model.js';
	import { mail, state } from '$lib/_stores/auth_store.js';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
    import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import type {  TableSource } from '@skeletonlabs/skeleton';
	import { toast } from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
	import { appSettings } from '$lib/_stores/settings_store.js';

    export let data;
    let message: IMail|null = null;

    //Loaders
    let _loading = false;

    onMount(async ()=>{  
        _loading = true;    
        try {
            if(!$state.account)
                await state.checkLoggedIn();
            
            await mail.openMessage($page.params.slug);
            
            message = $mail.find((mail) => mail.$id === $page.params.slug) ?? null

            _loading = false;
            // console.log('Message: ',message);
        } catch (error:any) {
            console.warn('Could not load message. ', error.message);
            _loading = false;
        }
    });
</script>

<!-- HTML head -->
<svelte:head>
	<title>{$appSettings.app.name} | Inbox</title>
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">

    <!-- Header -->
    <h3 class="title flex justify-center items-center h-12">
        <!-- Left Panel -->
        <!--div class="flex items-center gap-2 h-6">
            {#if _loading}<span in:fade={{duration:700}} out:fade={{duration:300}}><LoadingClock/></span>{/if}
        </div-->
        {#if _loading}<span in:fade={{duration:700}} out:fade={{duration:300}}><iconify-icon icon="mdi:mail-outline" class="text-3xl animate-bounce"></iconify-icon></span>{/if}
    </h3>

    {#if _loading}
		<section in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-center">
			<div class="flex flex-col items-center justify-center gap-3">
				<div class="flex flex-col items-center">
					<h3 class="title animate-pulse">Checking...</h3>
				</div>
			</div>
		</section>
    {:else if message}
        <section in:fade={{ duration: 300, delay: 250 }} out:fade={{ duration:200 }} class="text-center">
            <div class="flex flex-col items-start justify-start gap-y-3">
                <div class="flex flex-col items-start">
                    <h3 hidden={ !message.title } class="title">{ message.title }</h3>
                    <hr>
                    <p>{message.message}</p>
                </div>
            </div>
        </section>
    {:else}
        <section in:fade={{ duration: 300, delay: 250 }} out:fade={{ duration:200 }} class="text-center">
            <div class="flex flex-col justify-center gap-3">
                    <h3 class="title">Invalid Message ID</h3>
                    <hr class="mx-auto w-2/3">
                    <a href="/mail">Return to mailbox</a>
            </div>
        </section>
    {/if}
</main>


<style>
</style>