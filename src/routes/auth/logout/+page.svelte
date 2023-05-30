<script lang="ts">
	import { goto } from "$app/navigation";
    import { state } from "$lib/store";
	import { onMount } from "svelte";


    onMount(async ()=>{
        try {
            await state.logout();
            history.back();
            // Return User to previous page upon successful logout
            // goto('/');
        } catch (error) {
            console.warn('Unable to log out from server');
            
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