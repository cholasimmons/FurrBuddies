<script lang="ts">
	import type { Clinic } from '$lib/_models/clinic-model';
	import { clinicstate } from '$lib/store';
	import { onMount } from 'svelte';

    export let data;
    let clinic: Clinic;

    onMount(async ()=>{        
        clinic = await $clinicstate.find((clinic:Clinic)=>clinic.$id === data.id) as Clinic
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