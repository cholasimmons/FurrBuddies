<script lang="ts">
	import { goto } from "$app/navigation";
    import { state } from "$lib/_stores/auth_store.js";
	import { appSettings } from "$lib/_stores/settings_store.js";
	import { onMount } from "svelte";

    export let data;

    let _loading: boolean = true;

    // Cancel timeout timer if regular logout is successful
    let timerId: NodeJS.Timeout;

    onMount(()=>{
        _loading = true;
        try {
            timerId = setTimeout(async ()=>{
                _loading = false;
                await state.logout();
                // Return User to previous page upon successful logout;
                clearTimeout(timerId);
                goto("/splash", {replaceState: true});
            }, 2000);
        } catch (error) {
            console.warn('Unable to log out from server');
            _loading = false;
        } finally {
            timerId = setTimeout(()=>{
                goto("/splash", {replaceState: true});
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