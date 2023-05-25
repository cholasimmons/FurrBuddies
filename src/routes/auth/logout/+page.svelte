<script lang="ts">
	import { goto } from "$app/navigation";
    import { state } from "$lib/store";
	import { onMount } from "svelte";


    onMount(async ()=>{
        try {
            console.log('attempting sign out');
            
            await state.logout();
            goto('/');
        } catch (error) {
            
        }
        
    })
</script>

<main>
    <h3 class="title text-center">Signing Out</h3>
    <p class="mt-0 p-0 text-center">
        Please hold on...
    </p>
</main>

<style>
    * {
        outline: none
    }
</style>