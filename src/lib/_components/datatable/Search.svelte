<script lang="ts">
    import type { DataHandler, Row } from '@vincjo/datatables'

    type T = $$Generic<Row>

    export let handler: DataHandler<T>
    let value = ''
</script>

<input
    class={$$props.class ?? 'py-4'}
    bind:value
    placeholder={handler.i18n.search}
    spellcheck="false"
    on:input={() => handler.search(value)}
/>

<style>
    input {
        border-radius: 6px;
        outline: none;
        padding: 1rem;
        line-height: 36px;
        margin: 0;
        height: 36px;
        background: transparent;
        width: 50%;
        max-width: 196px;
        min-width: 96px;
        transition: all, 0.1s;
    }
    input:focus, input:hover {
        @apply dark:bg-surface-700 bg-surface-300;
    }
</style>
