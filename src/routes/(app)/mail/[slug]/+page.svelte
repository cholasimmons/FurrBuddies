<script lang="ts">
	import type { IMail } from '$lib/_models/mail-model.js';
	import { state } from '$lib/_stores/auth_store.js';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
    import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import type {  TableSource } from '@skeletonlabs/skeleton';
	import { toast } from 'svelte-french-toast';
	import { goto } from '$app/navigation';

    export let data;
    let message: IMail;

    //Loaders
    let _loading = false;

    onMount(async ()=>{    
        _loading = true;    

        _loading = false;
    });

    // Opened messages get marked as read after 5 seconds
    function markAsRead(): void {
        console.log('btn pressed');
    } 
</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | Inbox</title>
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">
    <p>Single e-mail</p>
</main>


<style>
</style>