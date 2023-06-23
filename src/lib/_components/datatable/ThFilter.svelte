<script lang="ts">
    import type { DataHandler, FilterBy, Comparator, Row } from '@vincjo/datatables'

    type T = $$Generic<Row>

    export let handler: DataHandler<T>
    export let filterBy: FilterBy<T>
    export let align: 'left' | 'right' | 'center' = 'left'
    export let comparator: Comparator<T>|undefined = undefined;

    let value: string = ''
</script>

<th class={$$props.class ?? ''}>
    <input
        style:text-align={align}
        type="text"
        placeholder="Filter..."
        spellcheck="false"
        class="bg-transparent px-4 py-1 font-medium"
        bind:value
        on:input={() => handler.filter(value, filterBy, comparator)}
    />
</th>

<style>
    input::placeholder {
        @apply text-sm italic text-slate-600 dark:text-slate-400 font-medium;
    }
    input:focus {
        outline: none;
        border: none;
    }
</style>
