<script lang="ts">
	import { petbucketstate } from "$lib/_stores/auth_store";
	import { onMount } from "svelte";
	import LoadingClock from "./icons/Loading_Clock.svelte";
	import { sdk } from "$lib/appwrite";


    // export let image: string;
    export const parent: any = null;
    export let id: string;

    // Loaders
    let image: string = '';
    let _loading: boolean = true;

    onMount(async ()=>{
        try {
            const urlData = await sdk.avatars.getQR(id, 512);
            image = urlData.href;
            _loading = false;
        } catch (error) {
            console.log(error);
            _loading = false;
        }
        // console.log(parent);
        
    });

</script>


<main class="mx-auto m-6 max-w-[36rem] max-h-[36rem] overflow-hidden rounded-2xl border-2 border-surface-300">
    {#if _loading}
        <LoadingClock/>
    {:else}
        <div>
            <img src={image} alt="" class="w-full  object-cover object-center">
        </div>
    {/if}
</main>
<slot/>