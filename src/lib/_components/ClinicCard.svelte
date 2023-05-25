<script lang="ts">
	import { fade } from "svelte/transition";

    export let clinicName: string;
    export let clinicLocation: string = "Ibex, Lusaka";
</script>

<main>
    <div class="w-full h-[10rem] bg-[url('/images/vet.jpg')] bg-cover bg-center bg-no-repeat text-white"></div>
    <div class="p-4 text-left w-full ">
        <p class="m-0 p-0 text-sm md:text-lg">{clinicName}</p>
        <p class="m-0 p-0 text-sm text-gray-300">{clinicLocation}</p>
    </div>
</main>

<style>
    main {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content:flex-start;
        align-items: center;
    }
    main div {
        transition: scale 0.2s ease-in-out;
    }
    main:hover div:nth-child(1){
        scale: 104%;
        
    }
</style>