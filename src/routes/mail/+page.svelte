<script lang="ts">
	export let data;

	const dummyMail = [
		{ id: 0, title: 'Thank you for coming', message: 'We appreciate you trusting us with your buddies', fromId: '12345', toId: '67890', isRead: false, date: '04-06-2023'},
		{ id: 1, title: 'We miss you', message: 'Please take note that Poopie is due for a checkup', fromId: '12345', toId: '67890', isRead: false, date: '04-06-2023'},
		{ id: 2, title: 'Check this offer', message: 'We would like to offer you 50% off...', fromId: '12345', toId: '67890', isRead: true, date: '04-06-2023'},
	]
</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | Messages</title>
	<meta name="description" content="About this app" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">
		<dl class="mt-5 list-dl">
			{#each dummyMail as mail}
			<a href="/mail/{mail.id}">
				<div class="bg-surface-500 bg-opacity-30 hover:bg-surface-hover-token">
					<span class="w-[2rem] h-[2rem]">💌</span>
					<span class="flex-auto">
						<dt class="font-light">{mail.title}</dt>
						<dd class="font-medium">{mail.message}</dd>
					</span>
				</div>
			</a>
			{/each}
		</dl>

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