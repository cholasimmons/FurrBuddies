<script lang="ts">
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';

    export let data;

    let _loading: boolean = false;
</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName}</title>
	<meta name="description" content="About {data.appName}" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">
    <h3 class="title flex justify-between items-center">About {data.appName}
        {#if _loading}<LoadingClock/>{/if}
    </h3>

    <p>Lorem ipsum, dolor sit amet conse-ctetur adipisicing elit. Harum cupiditate iusto id fugiat numquam dolor? Eum quibusdam et, facere voluptate ipsum necessitatibus magnam, architecto pariatur veritatis possimus labore. Asperiores, cumque.</p>

    <h3 class="title flex justify-start items-center mt-8">Credit</h3>

    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam laudantium alias nisi illum voluptatum ullam quos expedita magnam nihil eos totam inventore, ratione qui fugiat possimus ducimus unde placeat exercitationem.</p>

    <hr>
    
    <p><span>Evelyn S. Youssef: </span>For your many contributions to this app</p>
    <p><span><a href="https://www.skeleton.dev/blog/welcome-to-the-skeleton-blog" target="_blank">Chris Simmons</a>: </span>Thank you for your warm welcome to Skeleton UI</p>
    <p><span><a href="https://joyofcode.xyz/" target="joyofcode">Joy of Code</a> | 
        <a href="https://huntabyte.com/" target="huntabyte">Huntabyte</a> | 
        <a href="https://learn.codevolution.dev/" target="codevolution">Codevolution</a> | 
        <a href="https://netninja.dev/" target="netninja">The Net Ninja</a>: </span>Your various online tutorials helped tremendously, Thank You.</p>
</main>


<style>

</style>