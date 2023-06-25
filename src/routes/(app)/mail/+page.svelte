<script lang="ts">
	import { goto } from '$app/navigation';
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
	import { mail, state } from '$lib/_stores/auth_store.js';
	import { appSettings } from '$lib/_stores/settings_store.js';
	import { truncateString } from '$lib/_utilities/text-transform.js';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';


	export let data;

	// Loaders
	let _loading: boolean = true;
	let _fetching: boolean = false;

	onMount(async ()=>{
		_loading = true;
		try {
			await state.checkLoggedIn();
			if($state.account?.emailVerification){
				_fetching = true;
				try {
					await mail.fetch();
					_fetching = false;
				} catch {
					console.log('Unable to retrieve mail');
					_fetching = false;
				}
			}
			
			_loading = false;
		} catch (error) {
			console.log('Not signed in');
			_loading = false;
		}
	});

	// Manual refresh
	async function refreshInbox() {
		_fetching = true;
		try {
			await mail.fetch();
			_fetching = false;
		} catch (error) {
			_fetching = false;
		}
	}

</script>

<!-- HTML head -->
<svelte:head>
	<title>{$appSettings.app.name} | Messages</title>
	<meta name="description" content="Your personalized inbox" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">

	<!-- Header -->
    <h3 class="title flex justify-between items-center">
        <!-- Left Panel -->
        <div class="flex items-center gap-2">
                <button in:fade={{ duration:100, delay:100}} on:click|preventDefault={refreshInbox} disabled={ !$state.account?.emailVerification } type="button" class="btn btn-sm variant-ghost">
                    <span class=" flex items-center"><iconify-icon icon="mdi:refresh" class="{_fetching ? 'animate-spin' : ''}"></iconify-icon></span>
                    <span>Refresh Inbox</span>
                </button>
            {#if _loading}<span in:fade={{duration:700}} out:fade={{duration:700}}><LoadingClock/></span>{/if}
        </div>
        
        <!-- Right Panel -->
		{#if $state.account?.emailVerification }
			<div class="{ $state.account ? 'flex items-center' : 'hidden'} ">
				<button class="btn-icon btn-icon-lg" type="button"><iconify-icon icon="mdi:filter"></iconify-icon></button>
			</div>
		{/if}
    </h3>

	{#if _loading}
		<section in:fade={{ duration: 300, delay: 250 }} out:fade={{ duration:200 }} class="text-center mt-16">
			<div class="flex flex-col items-center justify-center gap-3 pt-12">
				<iconify-icon icon="mdi:mail-outline" class="text-3xl animate-bounce"></iconify-icon>
				<div class="flex flex-col items-center">
					<h3 class="title">Please hold on a moment...</h3>
				</div>
			</div>
		</section>
	{:else if $state.account && $state.account.emailVerification }
	<!-- User logged in and verified - Display Mail -->

		{#if $mail?.length < 1 }
			<section in:fade={{ duration: 300, delay: 250 }} out:fade={{ duration:200 }} class="text-center mt-16">
				<div class="flex flex-col items-center justify-center gap-3 pt-12">
					<iconify-icon icon="mdi:mail-outline" class="text-3xl"></iconify-icon>
					<div class="flex flex-col items-center">
						<h3 class="title">Having messages would be awesome!</h3>
					</div>
					
				</div>
				
			</section>
		{:else}

			<!-- Display each available message -->
			<dl in:fade={{ duration:200, delay: 250 }} out:fade={{ duration:250 }} class="mt-5 list-dl">
				{#each $mail as mail, index}
					<a href="/mail/{mail.$id}">
						<div in:fade={{ duration:200, delay: (index+1)*100 }} class="bg-surface-700 bg-opacity-30 hover:bg-surface-hover-token border-2 border-surface-300 dark:border-surface-700">
							<span class="w-[2rem] h-[2rem]">💌</span>
							<span class="flex-col overflow-x-hidden ">
								<dt class="{mail.isRead ? 'font-light' : 'font-bold'}">{mail.title}</dt>
								<dd class="font-medium">{ truncateString(mail.message)}</dd>
							</span>
						</div>
					</a>
				{/each}
			</dl>
		{/if}
	
	{:else if $state.account && !$state.account.emailVerification}
	<!-- User logged in but not verified - Notice to get verified -->

		<div in:fade={{ duration: 300, delay: 250 }} out:fade={{ duration:200 }} class="flex flex-col items-center justify-center gap-3 pt-12">
			<iconify-icon icon="mdi:mail" class="text-3xl"></iconify-icon>
			<p class="text-sm">Your account needs to be verified first</p>
		</div>
	
	{:else}
	<!-- User NOT logged in - Prompt to log in -->

		<div in:fade={{ duration: 300, delay: 250 }} out:fade={{ duration:200 }} class="flex flex-col items-center justify-center gap-3 pt-12">
			<p class="text-lg">You're missing out!</p>
			<button on:click={()=>goto('/auth/login')} class="shadow-[0_1rem_1rem_rgba(0,0,0,0.2)] hover:shadow-none btn btn-lg">
				Log in
			</button>
		</div>
	{/if}
</main>

<style>
	dl.list-dl > a > div {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		margin-bottom: 0.6rem;
		padding: 0.8rem 1rem;
	}

	dl.list-dl > a > div dt {
		font-weight: 400;
		font-size: 1.2rem;
	}
	dl.list-dl > a > div dd {
		font-weight: 200;
	}
</style>