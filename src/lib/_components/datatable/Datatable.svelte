<script lang="ts">

    import type { DataHandler, Row } from '@vincjo/datatables';
    import Search from './Search.svelte';
    import RowsPerPage from './RowsPerPage.svelte';
    import Pagination from './Pagination.svelte';
	import RowCount from './RowCount.svelte';

    type T = $$Generic<Row>

    export let handler: DataHandler<T>

    export let search       = true
    export let rowsPerPage  = true
    export let rowCount     = true
    export let pagination   = true

    let element: HTMLElement
    let clientWidth = 576

    const height = (search || rowsPerPage ? 48 : 8) + (rowCount || pagination ? 48 : 8)

    const triggerChange = handler.getTriggerChange()
    $: $triggerChange, scrollTop()

    const scrollTop = () => {
        if (element) element.scrollTop = 0
    }
</script>

<section bind:clientWidth class={$$props.class ?? ''}>
    <header class:container={search || rowsPerPage}>
        {#if search}
            <Search {handler} />
        {/if}
        {#if rowsPerPage}
            <RowsPerPage {handler} small={clientWidth < 600} />
        {/if}
    </header>

    <article bind:this={element} style="height:calc(100% - {height}px)">
        <slot />
    </article>

    <footer class:container={rowCount || pagination} class="w-full bg-surface-300 dark:bg-surface-800">
        {#if rowCount}
            <RowCount {handler} small={clientWidth < 576} />
        {/if}
        {#if pagination}
            <Pagination {handler} small={clientWidth < 576} />
        {/if}
    </footer>
</section>

<style>
    section {
        height: 100%;
    }

    section :global(table) {
        border-collapse: separate;
        border-spacing: 0;
        width: 100%;
    }

    section :global(thead) {
        position: sticky;
        inset-block-start: 0;
        z-index: 1;
    }

    header, footer {
        min-height: 8px;
        padding: 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    header.container, footer.container {
        height: 48px;
    }

    article {
        position: relative;
        /* height:calc(100% - 96px); */
        overflow: auto;
        scrollbar-width: thin;
    }

    article::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    article::-webkit-scrollbar-track {
        background: #f5f5f5;
    }
    article::-webkit-scrollbar-thumb {
        background: #c2c2c2;
    }
    article::-webkit-scrollbar-thumb:hover {
        background: #9e9e9e;
    }
</style>
