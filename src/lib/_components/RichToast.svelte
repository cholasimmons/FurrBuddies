<script lang="ts">
    import toast_ from 'svelte-french-toast';

     export let toast: any;
     // export let bud: string|undefined;

    // Use this component in your app:
    //     toast(RichContent)
</script>

<span>
    Removing <b>{ toast.name || 'Buddy'}</b>
    <button on:click={() => toast_.dismiss(toast.id)} class="ml-2 btn variant-ghost-surface">Cancel</button>
</span>