<script lang="ts">
    import type { DataHandler, Row } from '@vincjo/datatables'

    type T = $$Generic<Row>

    export let handler: DataHandler<T>
    export let small = false

    const rowsPerPage = handler.getRowsPerPage()

    const options = [5, 10, 20, 40]
</script>

<aside class={'dark:text-surface-300 text-surface-700 '+ $$props.class ?? ''}>
    {#if !small}
        <span>{handler.i18n.show}</span>
    {/if}
    <select bind:value={$rowsPerPage} on:change={() => handler.setPage(1)}>
        {#each options as option}
            <option value={option}>
                {option}
            </option>
        {/each}
    </select>
    {#if !small}
        <span>{handler.i18n.entries}</span>
    {/if}
</aside>

<style>
    aside {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 32px;
        color: #757575;
    }
    select {
        margin: 0 8px;
        border-radius: 6px;
        padding: 6px 12px;
        color: black
    }
</style>
