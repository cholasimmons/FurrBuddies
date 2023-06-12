<script lang="ts">
	import { goto } from "$app/navigation";
	import LoadingClock from "$lib/_components/icons/Loading_Clock.svelte";
    import { Gender, Type, type IPet } from "$lib/_models/pet-model";
	import { petbucketstate, petstate } from "$lib/_stores/auth_store.js";
	import { Avatar } from "@skeletonlabs/skeleton";
	import { field, form } from "svelte-forms";
	import { email, min, pattern, required } from "svelte-forms/validators";
	import toast from "svelte-french-toast";
	import { fly } from "svelte/transition";

    // get global app name
    export let data;

    // Initializing variables
    let photoFile: File|undefined = undefined;

    // Loaders
    let _adding: boolean = false;
    let _uploadingPhoto: boolean = false;

    // svelte-forms form and validation = https://chainlist.github.io/svelte-forms/
    const fname = field('name', '', [ required(), min(2) ]);
    const ftype = field('type', Type.DOG);
    const fbreed = field('breed', '');
    const fgender = field('gender', Gender.UNSPECIFIED);
    const ffile = field('uploader', File);
    const addPetForm = form(fname,ftype,fbreed,fgender,ffile);


    // function to add a new buddy
    const addBuddy = async ()=>{
        if(!$addPetForm.valid) return;

        _adding = true;
        try {
            // Add valid form details to Appwrite collection
            const petDoc:any = await petstate.addPet($fname.value,$ftype.value,$fgender.value,$fbreed.value);
            // console.log('Returned after adding pet to appwrite: ',petDoc);
            
            // a small variable to notify us with an emoji in the toast, if a photo was uploaded too
            let _photoSuccess: boolean = false;

            // If an image was selected, upload it too
            if(photoFile)
            {
                _uploadingPhoto = true;
                const response:any = await petbucketstate.addPetPhoto(photoFile);
                
                await petstate.updatePet(petDoc, {"photoID": [response.$id]});
                _photoSuccess = true;
                _uploadingPhoto = false
            }

            toast.success('Added ' + $fname.value + ' to the family!', {icon: _photoSuccess ? '📸' : ''});
            addPetForm.clear();
            _adding = false;
            goto('/pets');
        } catch (error: any) {
            // state.alert({ color: 'red', message: petName+' was not added. '+error.message})
            console.warn('Unable to add '+$fname.value+'. ',error.message);
            _adding = false;
            _uploadingPhoto = false;
        }
    }

    // Function that creates preview of selected image
    function previewImage() {
        if (photoFile) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const imagePreview = document.getElementById('imagePreview');
                imagePreview!.innerHTML = `<img src="${e.target!.result}" alt="" class="w-28 h-28 object-fit object-cover object-center" />`;
            };

            reader.readAsDataURL(photoFile);
        }
    }

    // Function to get photo from form, ready for Appwrite bucket
    function handleFileUpload(event: any) {
        photoFile = event.target.files[0];
        // console.log('Event onchanged: ', photoFile);
        previewImage();
    };
</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | Add a Buddy</title>
	<meta name="description" content="Add a Buddy to the family" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">
    <h3 class="title text-center">Add a Buddy</h3>
    <p class="mt-0 text-center">
        Grow the family
    </p>

    <section class="flex justify-center">
        <div class="flex-grow flex flex-col max-w-lg justify-center">

            <form on:submit|preventDefault={addBuddy}>

                <!-- Pet Photo -->

                <div on:click={()=>document.getElementById('uploader')?.click()} on:keypress id="imagePreview"
                    class="w-28 h-28 bg-surface-400 bg-opacity-30 rounded-full flex justify-center items-center overflow-hidden mx-auto transition-transform hover:scale-110">
                    <iconify-icon icon="mdi:image" class="text-2xl"></iconify-icon>
                </div>
                <input type="file" id="uploader" bind:value={$ffile.value} style="display:none" accept="image/*" on:change={handleFileUpload} />

                <!-- Pet Name -->

                <label class="block mt-6" for="name"> Name</label>
                <input
                    id="name" type="text" placeholder="Pet Name"
                    class:invalid="{!$fname.valid}"
                    bind:value={$fname.value}/>
                    {#if !$fname.valid}
                        <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-surface-800 dark:text-surface-300 text-right">What do you call your Buddy?</p>
                    {/if}


                <div class="flex gap-3">
                    <!-- Animal Type -->

                    <div class="flex-grow">
                    <label class="block mt-6" for="type"> Animal Type</label>
                    <select
                        id="type" placeholder="Animal Type" class:invalid={!$ftype.valid}
                        bind:value={$ftype.value}>
                        <option value="DOG">Dog</option>
                        <option value="CAT">Cat</option>
                        <option value="BIRD">Bird</option>
                        <option value="RABBIT">Rabbit</option>
                        <option value="RODENT">Rodent</option>
                        <option value="HORSE">Horse</option>
                    </select>
                    </div>

                    <!-- Gender -->

                    <div class="flex-grow">
                    <label class="block mt-6" for="gender"> Gender</label>
                    <select
                        id="gender" placeholder="Gender" class:invalid={!$fgender.valid} bind:value={$fgender.value}>
                        <option value="UNSPECIFIED">Unspecified</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                    </div>
                </div>
                

                <!-- Breed -->

                <label class="block mt-6" for="breed"> Breed</label>
                <input
                    id="breed" type="text" placeholder="Breed" class:invalid={!$fbreed.valid}
                    bind:value={$fbreed.value}/>
                

                <!-- Form Buttons (Clear Form & Submit) -->

                <div class="mt-6 flex justify-between items-center">
                    <button disabled={!$addPetForm.dirty} on:click={addPetForm.reset} type="reset">
                        Clear Form
                    </button>
                    <span class="flex items-center justify-center gap-4">{#if _uploadingPhoto}<LoadingClock />{/if}
                    <button disabled={ _adding || !$addPetForm.valid || $fname.value.length < 2 } class="btn variant-filled-warning" type="submit">
                        {#if _uploadingPhoto}Adding...{:else if _adding}Uploading Photo{:else}Add{/if}
                    </button>
                    </span>
                </div>
            </form>
        </div>
    </section>
</main>

<style>
</style>