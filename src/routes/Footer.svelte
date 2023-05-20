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
			<div aria-current={$page.url.pathname.startsWith('/mail') ? 'page' : undefined}>
				<a href="/mail">Mail</a>
			</div>
			<div aria-current={$page.url.pathname === '/setup' ? 'page' : undefined}>
				<a href="/setup">Setup</a>
			</div>
		</div>
</footer>

<style>
	div.grid {
		padding: 0 3rem;
		display: flex;
		justify-content: space-between;
	}
</style>
