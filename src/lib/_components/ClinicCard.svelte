<script lang="ts">
	import { state } from "$lib/store";
	import { Role } from "appwrite";
	import { fade } from "svelte/transition";

    export let clinicName: string;
    export let clinicLocation: string = "Ibex, Lusaka";
</script>

<main>
    <div class="card">
        <header class="card-header p-0">
            <div class="w-full h-[10rem] bg-[url('/images/vet.jpg')] bg-cover bg-center bg-no-repeat text-white"></div>
        </header>
        <section class="px-6 py-4">
            <p class="p-0 m-0 text-lg">{clinicName}</p>
            <small>{Role.user($state.account?.$id || '0') ? clinicLocation : ''}</small>
        </section>
        <footer class="card-footer">

        </footer>
    </div>

    <!--div class="w-full h-[10rem] bg-[url('/images/vet.jpg')] bg-cover bg-center bg-no-repeat text-white"></div>
    <div class="p-4 text-left w-full ">
        <p class="m-0 p-0 text-sm md:text-lg">{clinicName}</p>
        <p class="m-0 p-0 text-sm text-gray-300">{clinicLocation}</p>
    </div-->
</main>

<style>
    main > div.card {
        text-align: left;
        justify-content:flex-start;
        align-items: center;
        transition: scale 0.2s ease-in-out;
        background-color: rgba(71, 61, 139, 0.5);
        color: wheat;
    }
    main > div.card header {
        transition: scale 0.2s ease-in-out;
    }
    main:hover div.card > header{
        scale: 103%;
    }
</style>