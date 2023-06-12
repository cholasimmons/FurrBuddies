<script lang="ts">
	import type { IPet } from "$lib/_models/pet-model";
	import { petbucketstate } from "$lib/_stores/auth_store";
	import type { Models } from "appwrite";
    import { onMount } from "svelte";
	import { get } from "svelte/store";
	import { fade } from "svelte/transition";

    export let petName: string;
    export let photoID: string;
    
    let _loading: boolean = true;
    let imageURL: string|undefined = '';

    onMount(async ()=>{
        if(!photoID) return;
        if(!get(petbucketstate)) return;

        _loading = true;

        const file: URL|undefined = await petbucketstate.getPreview(photoID);
        imageURL = file?.href;

        _loading = false;
/*
        await petbucketstate.fetch();

        const file: any = get(petbucketstate).find((photo: Models.File) => photo.$id === photoID);
        console.log('Photo.', file);
        imageURL = file?.href;
        // console.log('Photos.', photos);
*/
    });
</script>

<main>
    <div class="circle border-2 border-surface-500">
        <img src={ _loading ? imageURL : '' } alt='' in:fade={{ duration: 300 }}>
    </div>
    <p class="text-lg md:text-xl font-medium">{petName}</p>
</main>

<style>
    main {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    main div {
        transition: scale 0.4s ease-in-out;
        text-align: center;position: relative;
    }
    /* main:hover div, main:hover div img{
        scale: 103%;
    }*/
    .circle{
        position: relative;
        width: 80%;
        padding-bottom:76%; /* Maintain 1:1 aspect ratio */
        border-radius: 50%;
        overflow: hidden;
    }
    .circle > img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 102%;
        height: 102%;
        object-fit: cover;
        transition: scale 0.3s ease-in-out;
    }

    .circle::before {
        content: '?';
        position: absolute;
        top: 55%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        color: #b8a;
    }
</style>