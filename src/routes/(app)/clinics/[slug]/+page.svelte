<script lang="ts">
	import type { IClinic } from '$lib/_models/clinic-model';
	import { clinicstate } from '$lib/_stores/auth_store.js';
	import { onMount } from 'svelte';

    export let data;
    let clinic: IClinic;

    onMount(async ()=>{        
        clinic = await $clinicstate.find((clinic:IClinic)=>clinic.$id === data.id) as IClinic
        console.debug(clinic)
    });
</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | Clinic</title>
	<meta name="description" content="View Clinic" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">
    <h3 class="title text-center">{clinic?.name}</h3>
    <p>{ data.id }</p>
</main>