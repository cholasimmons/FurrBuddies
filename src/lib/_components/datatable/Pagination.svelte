<script lang="ts">
    import type { DataHandler, Row } from '@vincjo/datatables'

    type T = $$Generic<Row>

    export let handler: DataHandler<T>
    export let small = false

    const pageNumber = handler.getPageNumber()
    const pageCount = handler.getPageCount()
    const pages = handler.getPages({ ellipsis: true })
</script>

<section class={$$props.class ?? ''}>
    {#if small}
        <button
            type="button"
            class="small"
            class:disabled={$pageNumber === 1}
            on:click={() => handler.setPage(1)}
        >
            &#10092;&#10092;
        </button>
        <button
            type="button"
            class:disabled={$pageNumber === 1}
            on:click={() => handler.setPage('previous')}
        >
            &#10094;
        </button>
        <button
            class:disabled={$pageNumber === $pageCount}
            on:click={() => handler.setPage('next')}
        >
            &#10095;
        </button>
        <button
            class="small"
            class:disabled={$pageNumber === $pageCount}
            on:click={() => handler.setPage($pageCount)}
        >
            &#10093;&#10093;
        </button>
    {:else}
        <button
            type="button"
            class:disabled={$pageNumber === 1}
            on:click={() => handler.setPage('previous')}
        >
            {@html handler.i18n.previous}
        </button>
        {#each $pages as page}
            <button
                type="button"
                class:active={$pageNumber === page}
                class:ellipse={page === null}
                on:click={() => handler.setPage(page)}
            >
                {page ?? '...'}
            </button>
        {/each}
        <button
            type="button"
            class:disabled={$pageNumber === $pageCount}
            on:click={() => handler.setPage('next')}
        >
            {@html handler.i18n.next}
        </button>
    {/if}
</section>

<style>
    section {
        display: flex;
    }
    button {
        @apply bg-surface-400 dark:bg-surface-700 text-surface-700 dark:text-surface-300 px-6;
        cursor: pointer;
        font-size: 13px;
        margin: 0;
        transition: all, 0.2s;
        line-height: 32px;
        outline: none;
    }

    button:first-child:not(.small),
    button:last-child:not(.small) {
        min-width: 72px;
    }

    button:not(.active):hover {
        @apply bg-surface-300;
    }
    button.ellipse:hover {
        cursor: default;
    }
    button.active {
        @apply bg-surface-400 dark:bg-surface-600 ;
        font-weight: bold;
        cursor: default;
    }
    button.disabled:hover {
        background-color: inherit;
        cursor: default;
    }
</style>
