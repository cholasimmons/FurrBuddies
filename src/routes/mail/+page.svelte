<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>{data.appName} | Messages</title>
	<meta name="description" content="About this app" />
</svelte:head>

<main>
	<h3 class="title">Mail</h3>

		<p>
			This is a <a href="https://kit.svelte.dev">SvelteKit</a> app. You can make your own by typing the
			following into your command line and following the prompts:
		</p>

		<pre>npm create svelte@latest</pre>

		<p>
			The page you're looking at is purely static HTML, with no client-side interactivity needed.
			Because of that, we don't need to load any JavaScript. Try viewing the page's source, or opening
			the devtools network panel and reloading.
		</p>

		<p>
			The <a href="/">Sverdle</a> page illustrates SvelteKit's data loading and form handling. Try
			using it with JavaScript disabled!
		</p>


		<dl class="mt-5 list-dl">
			<div>
				<span class="w-[2rem] h-[2rem]">💌</span>
				<span class="flex-auto">
					<dt>Message Header</dt>
					<dd>Description</dd>
				</span>
			</div>

			<div>
				<span class="w-[2rem] h-[2rem]">💌</span>
				<span class="flex-auto">
					<dt>Message Header</dt>
					<dd>Description</dd>
				</span>
			</div>
		</dl>

</main>

<style>
	dl.list-dl > div {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		background-color: rgb(110, 20, 80);
		margin-bottom: 0.6rem;
		padding: 0.8rem 1rem;
		cursor: pointer;
	}
	dl.list-dl > div:hover {
		background-color: rgb(126, 36, 96);
	}

	dl.list-dl > div dt {
		font-weight: 400;
		font-size: 1.2rem;
	}
	dl.list-dl > div dd {
		font-weight: 200;
	}
</style>