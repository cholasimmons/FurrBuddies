<script lang="ts">
	import type { Pet } from "$lib/_models/pet-model";

    let pet: Pet;
</script>

<svelte:head>
	<title>Furr Buddies | Add a Buddy</title>
	<meta name="description" content="Add to the family" />
</svelte:head>

<main>
    <h3 class="title">Add a Buddy</h3>

    <div class="p-2">
        <form class="grid grid-rows-4 grid-flow-col gap-6">
            <div class="">
                <input type="text" value="" placeholder="Pet Name" id="petname"/>
            </div>
            <div class="">
                <input type="text" value="" placeholder="Breed"/>
            </div>
            <div class="">
                <option value="" placeholder="Gender"></option>
            </div>
        </form>
    </div>
</main>

<style>
    *:focus {
        outline: none;
    }
    form > div > input {
        @apply bg-violet-900 bg-opacity-40 py-2 px-4 w-full rounded-md text-xl font-light;
    }
</style>