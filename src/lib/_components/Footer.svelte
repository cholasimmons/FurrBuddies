<script>
	import { page } from '$app/stores';
</script>

<footer>
		<div class="grid">
				<div aria-current={$page.url.pathname.startsWith('/pets') ? 'page' : undefined}>
					<a href="/pets">Pets</a>
				</div>
				<div aria-current={$page.url.pathname.startsWith('/clinics') ? 'page' : undefined}>
					<a href="/clinics">Clinics</a>
				</div>

				<div aria-current={$page.url.pathname.startsWith('/clinics') ? 'page' : undefined}>
					<a href="/">Home</a>
				</div>

				<div aria-current={$page.url.pathname.startsWith('/mail') ? 'page' : undefined}>
					<a href="/mail">Mail</a>
				</div>
				<div aria-current={$page.url.pathname === '/setup' ? 'page' : undefined}>
					<a href="/setup">Setup</a>
				</div>
		</div>
</footer>

<style>
	footer {
		height: 100%
	}
	div.grid {
		padding: 0 2rem;
		display: flex;
		justify-content: space-between;
		height: 100%;
	}
	div.grid > div {
		display: flex;
		align-items: center;
		align-content: center;
	}
</style>
