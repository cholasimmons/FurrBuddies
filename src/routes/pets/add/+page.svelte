<script lang="ts">
	import LoadingCircle from "$lib/_components/icons/Loading_Circle.svelte";
	import LoadingClock from "$lib/_components/icons/Loading_Clock.svelte";
import { Gender, Type, type Pet } from "$lib/_models/pet-model";
	import { petbucketstate, petstate } from "$lib/store";
	import { field, form } from "svelte-forms";
	import { email, min, pattern, required } from "svelte-forms/validators";
	import toast from "svelte-french-toast";
	import { debug } from "svelte/internal";
	import { fly } from "svelte/transition";

    // get global app name
    export let data;

    // Initializing variables
    let photoFile: File;

    // Loaders
    let _adding: boolean = false;
    let _uploadingPhoto: boolean = false;

    // svelte-forms form and validation = https://chainlist.github.io/svelte-forms/
    const fname = field('name', '', [required(), min(1)]);
    const ftype = field('type', Type.DOG, [required()]);
    const fbreed = field('breed', '', []);
    const fgender = field('gender', Gender.UNSPECIFIED, [required()]);
    const ffile = field('uploader', File, []);
    const addPetForm = form(fname,ftype,fbreed,fgender,ffile);


    // function to add a new buddy
    const addBuddy = async ()=>{
        if(!$addPetForm.valid) return;

        _adding = true;
        try {
            // Add valid form details to Appwrite collection
            const petDoc:any = await petstate.addPet($fname.value,$ftype.value,$fgender.value,$fbreed.value);
            
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
            toast.success('Added '+$fname.value+' to the family!',{icon: _photoSuccess ? '📸' : ''});   
            addPetForm.clear();  
        } catch (error: any) {
            // state.alert({ color: 'red', message: petName+' was not added. '+error.message})
            console.warn('Unable to add '+$fname.value+'. ',error.message);
        } finally {
            _adding = false;
            _uploadingPhoto = false;
        }        
    }

    // Function to get photo from form, ready for Appwrite bucket
    function handleFileUpload(event: any) {
        const file = event.target.files[0];
        // console.log('Event onchanged: ', file);
        photoFile = file;
    };
</script>

<svelte:head>
	<title>{data.appName} | Add a Buddy</title>
	<meta name="description" content="Add a Buddy to the family" />
</svelte:head>

<main>
    <h3 class="title text-center">Add a Buddy</h3>
    <p class="mt-0 text-center">
        Grow the family
    </p>

    <section class="flex justify-center">
        <div class="flex-grow flex flex-col max-w-lg justify-center">

            <form on:submit|preventDefault="{addBuddy}">

                <!-- Pet Photo -->

                <img src={ photoFile?.name   ||''} alt=""/>
                <input type="file" id="uploader" bind:value={$ffile.value} accept="image/*" on:change={handleFileUpload} />

                <!-- Pet Name -->

                <label class="block mt-6" for="name"> Name</label>
                <input
                    id="name" type="text" placeholder="Pet Name"
                    class:invalid="{!$fname.valid}"
                    bind:value="{$fname.value}"/>
                    {#if !$fname.valid}
                        <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-gray-300 text-right">What do you call your Buddy?</p>
                    {/if}

                <!-- Animal Type -->

                <label class="block mt-6" for="type"> Animal Type</label>
                <select
                    id="type" placeholder="Animal Type" class:invalid={!$ftype.valid}
                     bind:value="{$ftype.value}">
                    <option value="DOG">Dog</option>
                    <option value="CAT">Cat</option>
                    <option value="BIRD">Bird</option>
                    <option value="RABBIT">Rabbit</option>
                    <option value="RODENT">Rodent</option>
                    <option value="HORSE">Horse</option>
                </select>

                <!-- Breed -->

                <label class="block mt-6" for="breed"> Breed</label>
                <input
                    id="breed" type="text" placeholder="Breed" class:invalid={!$fbreed.valid}
                    bind:value="{$fbreed.value}"/>
                
                <!-- Gender -->

                <label class="block mt-6" for="gender"> Gender</label>
                <select
                    id="gender" placeholder="Gender" class:invalid={!$fgender.valid} bind:value="{$fgender.value}">
                    <option value="UNSPECIFIED">Unspecified</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                </select>

                <!-- Form Buttons (Clear Form & Submit) -->

                <div class="mt-6 flex justify-between items-center">
                    <button disabled={!$addPetForm.dirty} on:click={addPetForm.reset} type="reset">
                        Clear Form
                    </button>
                    <span class="flex items-center justify-center gap-4">{#if _uploadingPhoto}<LoadingClock />{/if}
                    <button disabled="{!$addPetForm.valid || _adding}" type="submit">
                        {#if _uploadingPhoto}Adding...{:else if _adding}Uploading Photo{:else}Add{/if}
                    </button>
                    </span>
                </div>
            </form>
        </div>
    </section>
</main>

<style>
* {
    outline: none
}
form input, form select {
	width: 100%;
    padding: 1.2rem;

	border-radius: 0.6rem;
	background-color: rgba(255, 255, 255, 0.2);
	color: white;
	font-size: 1.2rem;
    border: 3px transparent solid;
    transition: border 0.2s ease-in;
}
form select option {
    color: darkslateblue;
}
form label {
	opacity: 0.75
}
form button[type="submit"] {
    padding: 1rem 3rem;
    font-size: 1.2rem;
    background-color:darksalmon;
    border-radius: 6px;
    color:white
}
form button[type="submit"]:hover {
    color:gray;
    background-color: rgba(210, 200, 190);
}
form button[type="submit"]:disabled {
    color: darkslateblue;
    opacity: 0.5;
    cursor: not-allowed;
}
form button[type="reset"] {
    padding: 1rem 3rem 1rem 0;
    font-size: 1.2rem;
    background-color:none;
    color:lightsalmon
}
form button[type="reset"]:hover {
    color:lightcyan
}
.invalid {
    border: 3px red solid;
}
</style>