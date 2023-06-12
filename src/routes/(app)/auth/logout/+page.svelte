<script lang="ts">
	import { goto } from "$app/navigation";
    import { state } from "$lib/_stores/auth_store.js";
	import { onMount } from "svelte";

    export let data;

    let _loading: boolean = true;

    onMount(()=>{
        _loading = true;
        try {
            setTimeout(async ()=>{
                await state.logout();
                _loading = false;

                // Return User to previous page upon successful logout
                goto("/splash");
            }, 2000);
        } catch (error) {
            console.warn('Unable to log out from server');
            _loading = false;
        } finally {
            setTimeout(()=>{
                goto("/splash");
            }, 5000);
        }
    })
</script>

<main class="px-{data.padding}">
    <h3 class="title text-center">Signing Out</h3>
    <p class="mt-0 p-0 text-center animate-pulse">
        { #if _loading } Please hold on... {/if}
    </p>
</main>

<style>
    * {
        outline: none
    }
</style>