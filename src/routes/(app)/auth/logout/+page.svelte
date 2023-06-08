<script lang="ts">
	import { goto } from "$app/navigation";
    import { state } from "$lib/store";
	import { onMount } from "svelte";

    export let data;

    onMount(async ()=>{
        try {
            await state.logout();
            
            // Return User to previous page upon successful logout
            // goto('/');
        } catch (error) {
            console.warn('Unable to log out from server');
            
        } finally {
            history.back();
        }
        
    })
</script>

<main class="px-{data.padding}">
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