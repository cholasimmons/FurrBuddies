<script lang="ts">
	import type { IPet } from "$lib/_models/pet-model";
	import { petbucketstate } from "$lib/_stores/auth_store";
	import { appSettings } from "$lib/_stores/settings_store";
    import { onMount } from "svelte";
	import { fade } from "svelte/transition";

    export let petName: string;
    export let photoID: string|undefined;
    
    let _loading: boolean = true;
    let imageURL: string|undefined;

    onMount(async ()=>{
        // if(!photoID) return;

        // if(!$petbucketstate) return;

        try {
            _loading = true;

            if(!photoID || photoID === ''){
                _loading = false;
                return;
            }
            const file: URL|undefined = await petbucketstate.getPreview(photoID);

            if(file){
                imageURL = file?.href;
                _loading = false;
            }
            _loading = false;
        } catch (error) {
            _loading = false;
        }
       
/*
        await petbucketstate.fetch();

        const file: any = get(petbucketstate).find((photo: Models.File) => photo.$id === photoID);
        console.log('Photo.', file);
        imageURL = file?.href;
        // console.log('Photos.', photos);
*/
    });

</script>

<main class="w-full h-full">
    <div class=" cursor-pointer circle border-2 border-surface-500 hover:scale-110 transition-transform duration-200 ease-out">
        <img src={ _loading ? null : imageURL } alt='' in:fade={{ duration: 300 }} class="object-cover object-center h-full w-full scale-110 hover:scale-100 transition-transform duration-200 ease-out">
    </div>
    <p class="mt-4 text-2xl md:text-xl font-medium">{petName}</p>
</main>

<style>
    main {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .circle{
        position: relative;
        width: 90%;
        padding-bottom:88%; /* Maintain 1:1 aspect ratio */
        border-radius: 50%;
        overflow: hidden;
    }
    .circle > img {
        position: absolute;
    }

    .circle::before {
        content: url('icons/FurrPrints.svg') /*'🐾'*/;
        position: absolute;
        top: 55%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 4rem;
        border: none;
        outline: none;
    }

</style>