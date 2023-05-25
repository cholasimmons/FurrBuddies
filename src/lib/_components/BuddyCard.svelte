<script lang="ts">
	import type { Pet } from "$lib/_models/pet-model";

    export let pet: Pet;
    export let src: string = "";
</script>

<main>
    <div class="circle">
        <img {src} alt={src ? pet.name : ''}>
    </div>
    <p>{pet.name}</p>
</main>

<style>
    main {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
    }
    .circle{
        position: relative;
        width: 75%;
        padding-bottom: 70%; /* Maintain 1:1 aspect ratio */
        border-radius: 50%;
        border: #b8a 4px solid;
        overflow: hidden;
        background-color: burlywood;
    }
    .circle > img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    p{
        color: white;
        font-size: 1.3rem;
        font-weight: 300;
        
    }
</style>