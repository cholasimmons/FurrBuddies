<script lang="ts">
	import { state } from "$lib/_stores/auth_store";
	import { Role } from "appwrite";
	import { fade } from "svelte/transition";

    export let clinicName: string;
    export let clinicLocation: string = "Ibex, Lusaka";
    export const layout: boolean = true; // true: Grid, false: List
</script>

<main>
    <div class="card bg-opacity-30 text-left ">
        <header class="card-header p-0 overflow-hidden">
            <div class="w-full h-[10rem] bg-[url('/images/vet.jpg')] bg-cover transition hover:scale-[102%] bg-center bg-no-repeat"></div>
        </header>
        <footer class="card-footer pt-4">
            <p class="p-0 m-0 text-lg">{ $state.account?.$id ? clinicName : '' }</p>
            <small>{ clinicLocation }</small>
        </footer>
    </div>
</main>