<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";

    onMount(()=>{
        setTimeout(()=>{
            history.back();
        },2500);
    });
    
</script>

<main>
    <div class="mt-[2rem] flex items-center justify-center text-xl text-center">
        <span class="font-light">{$page.status}&nbsp;|</span>&nbsp;{$page.error?.message}
    </div>
    
</main>