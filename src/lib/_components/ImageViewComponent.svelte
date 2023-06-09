<script lang="ts">
	import { petbucketstate } from "$lib/store";
	import { onMount } from "svelte";
	import LoadingClock from "./icons/Loading_Clock.svelte";


    // export let image: string;
    export let parent: any;
    export let ids: string[];
    export let name: string = '';

    // Loaders
    let image: string = '';
    let _loading: boolean = true;

    onMount(async ()=>{
        try {
            const urlData = await petbucketstate.getFile(ids[0]);
            image = urlData?.href ?? '';
            _loading = false;
        } catch (error) {
            console.log(error);
            _loading = false;
        }
        console.log(parent);
        
    });

</script>


<main class="mx-auto m-6 max-w-[36rem] max-h-[36rem] overflow-hidden rounded-3xl">
    {#if _loading}
        <LoadingClock/>
    {:else}
        <div class="flex flex-col relative">
            <img src={image} alt="" class="w-full  object-cover object-center">
            <div class=" absolute bottom-0 left-0 px-8 py-4 sm:py-6 rounded-tr-2xl bg-surface-100 bg-opacity-80">
                <h3 class="text-lg sm:text-2xl text-surface-800">{name}</h3>
            </div>
        </div>
    {/if}
</main>
<slot/>