<script lang="ts">
	import { goto } from '$app/navigation';
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
	import { mail, state } from '$lib/store.js';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let data;

	// Loaders
	let _loading: boolean = true;

	onMount(async ()=>{
		try {
			await state.checkLoggedIn();
			_loading = false;
		} catch (error) {
			console.log('Not signed in');
			_loading = false;
		}
	});

	const dummyMail = [
		{ id: 0, title: 'Thank you for coming', message: 'We appreciate you trusting us with your buddies', fromId: '12345', toId: '67890', isRead: false, date: '04-06-2023'},
		{ id: 1, title: 'We miss you', message: 'Please take note that Poopie is due for a checkup', fromId: '12345', toId: '67890', isRead: false, date: '04-06-2023'},
		{ id: 2, title: 'Check this offer', message: 'We would like to offer you 50% off...', fromId: '12345', toId: '67890', isRead: true, date: '04-06-2023'},
	]

	$: account = $state.account;
	$: messages = $mail;
</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | Messages</title>
	<meta name="description" content="About this app" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">

	<!-- Header -->
    <h3 class="title flex justify-between items-center">
        <!-- Left Panel -->
        <div class="flex items-center gap-2">
            {#if account?.$id}
                <button on:click|preventDefault={()=>goto('/pets/add')} type="button" class="btn btn-sm bg-gradient-to-br variant-gradient-secondary-tertiary shadow-[0_4px_4px_rgba(0,0,0,0.24)] hover:shadow-none">
                    <span class=" flex items-center"><iconify-icon icon="mdi:refresh"></iconify-icon></span>
                    <span>Refresh Inbox</span>
                </button>
            {:else}
                <button on:click|preventDefault={()=>goto('/auth/login')}  type="button" class="btn btn-sm variant-filled-surface">
                    <span class=" flex items-center">
						<iconify-icon icon="mdi:lock-open"></iconify-icon>
					</span>
					<span>Log In</span>
                </button>
            {/if}
            {#if _loading}<LoadingClock/>{/if}
        </div>
        
        <!-- Right Panel -->
        <div class="{ account ? 'flex' : 'hidden'} items-center gap-2 ">
            <button class="btn-icon btn-icon-lg" type="button"><iconify-icon icon="mdi:filter"></iconify-icon></button>
            <button class="btn-icon btn-icon-lg " type="button"><iconify-icon icon="mdi:grid"></iconify-icon></button>
        </div>
    </h3>

	<!-- Display Mail if User is logged in and verified -->

	{#if account && account?.emailVerification }

		{#if messages?.length < 1 }
			<section in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-center mt-16">
				<div class="flex flex-col items-center justify-center gap-3 pt-12">
					<iconify-icon icon="mdi:mail-outline" class="text-3xl"></iconify-icon>
					<div class="flex flex-col items-center">
						<h3 class="title">Having messages would be awesome!</h3>
					</div>
					
				</div>
				
			</section>
		{:else}

			<!-- Display each available message -->
			<dl class="mt-5 list-dl">
				{#each dummyMail as mail}
					<a href="/mail/{mail.id}">
						<div class="bg-surface-700 bg-opacity-30 hover:bg-surface-hover-token">
							<span class="w-[2rem] h-[2rem]">💌</span>
							<span class="flex-auto  overflow-clip">
								<dt class="font-light">{mail.title}</dt>
								<dd class="font-medium">{mail.message}</dd>
							</span>
						</div>
					</a>
				{/each}
			</dl>

		{/if}
		
	{:else}
		
		<!-- Non-verified users -->
		<div class="flex flex-col items-center justify-center gap-3 pt-12">
			{#if !account?.emailVerification}
				<p in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-sm">Your account needs to be verified first</p>
				<button on:click={()=>goto('/auth/verify')} class="shadow-[0_1rem_1rem_rgba(0,0,0,0.2)] hover:shadow-none btn btn-lg bg-gradient-to-br variant-gradient-secondary-tertiary">
					Verify your account
				</button>
			{/if}
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