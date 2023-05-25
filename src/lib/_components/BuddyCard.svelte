<script lang="ts">
	import type { Pet } from "$lib/_models/pet-model";

    export let petName: string;
    export let src: string = "";
</script>

<main>
    <div class="circle">
        <img {src} alt={src ? petName : ''}>
    </div>
    <p>{petName}</p>
</main>

<style>
    main {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
    }
    main div {
        transition: scale 0.2s ease-in-out;
    }
    main:hover div{
        scale: 108%;
        
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