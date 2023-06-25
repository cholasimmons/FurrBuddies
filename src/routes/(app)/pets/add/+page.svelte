<script lang="ts">
	import { goto } from "$app/navigation";
	import LoadingClock from "$lib/_components/icons/Loading_Clock.svelte";
    import { Gender, Type, type IPet } from "$lib/_models/pet-model";
	import { petbucketstate, petstate, state } from "$lib/_stores/auth_store.js";
	import { appSettings } from "$lib/_stores/settings_store.js";
	import { Avatar } from "@skeletonlabs/skeleton";
	import { redirect } from "@sveltejs/kit";
	import { onMount } from "svelte";
	import { field, form } from "svelte-forms";
	import { email, max, min, pattern, required } from "svelte-forms/validators";
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
    const fdob = field('dob', '');
    const fcolor = field('color', '');
    const fremarks = field('remarks', '');
    const ffile = field('uploader', File);
    const addPetForm = form(fname,ftype,fbreed,fgender,fdob,fcolor,fremarks,ffile);

    onMount(async ()=>{
        try {
            // Check if User is signed in
            await state.checkLoggedIn();
            
            // Check if User account is verified
            if(!state.checkVerificationStatus()) {
                toast.error('Please verify your account');
                throw redirect(307, '/user/profile');
            }
        } catch (error:any) {
            console.warn('Access Denied: ',error);
            toast.error('You are not authorized to add a new Buddy')
            throw redirect(307,'/pets');
        }
    });

/*
    function validateDate(value) {
        const regex = /^\d{2}\/\d{2}\/\d{2}$/;
        if (!regex.test(value)) {
        return 'Please enter a valid date in the format DD/MM/YY';
        }
        return null;
    }
*/

    // function to add a new buddy
    const addBuddy = async ()=>{
        if(!$addPetForm.valid) return;

        _adding = true;
        try {
            // Add valid form details to Appwrite collection
            const petDoc:any = await petstate.addPet($fname.value,$fbreed.value,$fgender.value,$ftype.value,$fdob.value,$fcolor.value,$fremarks.value);
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
                _uploadingPhoto = false;
            }

            toast.success('Added ' + $fname.value + ' to the family!', {icon: _photoSuccess ? '📸!' : ''});
            _adding = false;
            addPetForm.reset();
            clearThumbnail();
            throw redirect(307,'/pets');
        } catch (error: any) {
            // state.alert({ color: 'red', message: petName+' was not added. '+error.message})
            console.warn('Unable to add '+$fname.value+'. ',error.message);
            _adding = false;
            _uploadingPhoto = false;
            redirect(307,'/pets')
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

    function clearThumbnail() {
        const imagePreview = document.getElementById('imagePreview');
        imagePreview!.innerHTML = ``;
    }
</script>

<!-- HTML head -->
<svelte:head>
	<title>{$appSettings.app.name} | Add a Buddy</title>
	<meta name="description" content="Add a Buddy to the family" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">
    <h3 class="title text-center">Add a Buddy</h3>
    <p class="m-0 text-center font-light opacity-60">
        Grow the family
    </p>

    <section class="flex justify-center mt-2">
        <div class="flex-grow flex flex-col max-w-lg justify-center">

            <form on:submit|preventDefault={addBuddy}>

                <!-- Pet Photo -->

                <div on:click={()=>document.getElementById('uploader')?.click()} on:keypress id="imagePreview"
                    class="w-32 h-32 bg-surface-400 bg-opacity-30 rounded-full flex justify-center items-center overflow-hidden mx-auto transition-transform hover:scale-110 ease-out duration-300">
                    <iconify-icon icon="mdi:image" class="text-2xl "></iconify-icon>
                </div>
                <input type="file" id="uploader" bind:value={$ffile.value} style="display:none" accept="image/*" on:change={handleFileUpload} />

                <!-- Pet Name -->

                <label class="block mt-2" for="name"> Name</label>
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
                    <label class="block mt-4" for="type"> Species</label>
                    <select
                        id="type" placeholder="Animal Type" class:invalid={!$ftype.valid}
                        bind:value={$ftype.value}>
                        <option value={Type.DOG}>{Type.DOG}</option>
                        <option value={Type.CAT}>{Type.CAT}</option>
                        <option value={Type.BIRD}>{Type.BIRD}</option>
                        <option value={Type.RABBIT}>{Type.RABBIT}</option>
                        <option value={Type.RODENT}>{Type.RODENT}</option>
                        <option value={Type.HORSE}>{Type.HORSE}</option>
                    </select>
                    </div>

                    <!-- Gender -->

                    <div class="flex-grow">
                    <label class="block mt-4" for="gender"> Gender</label>
                    <select
                        id="gender" placeholder="Gender" class:invalid={!$fgender.valid} bind:value={$fgender.value}>
                        <option value={Gender.UNSPECIFIED}>{Gender.UNSPECIFIED}</option>
                        <option value={Gender.MALE}>{Gender.MALE}</option>
                        <option value={Gender.FEMALE}>{Gender.FEMALE}</option>
                    </select>
                    </div>
                </div>


                <div class="flex gap-3">
                    <!-- Breed -->
                    <div class="flex-grow">
                        <label class="block mt-4" for="breed"> Breed</label>
                        <input
                            name="breed" type="text" placeholder="Breed" class:invalid={!$fbreed.valid}
                            bind:value={$fbreed.value}/>
                    </div>
                    
                    <!-- Date of Birth -->
                    <div class="flex-grow">
                        <label class="block mt-4" for="dob"> Date of Birth</label>
                        <input
                            id="dob" type="date" placeholder="DD / MM / YYYY" pattern="(0[1-9]|1\d|2\d|3[01])/(0[1-9]|1[0-2])/\d{2}"
                            max={Date.now()} class:invalid={!$fdob.valid} inputmode="numeric"
                            bind:value={$fdob.value}/>
                        <p class="hidden text-sm opacity-60 text-right">Estimate if unsure.</p>
                    </div>
                </div>

                <div class="flex gap-3">
                    <!-- Color -->
                    <div class="flex-grow">
                        <label class="block mt-4" for="color"> Color</label>
                        <input
                            name="color" type="text" placeholder="Color" class:invalid={!$fcolor.valid}
                            bind:value={$fcolor.value}/>
                    </div>
                    
                    <!-- Special Remarks -->
                    <div class="flex-grow">
                        <label class="block mt-4" for="remarks"> Special Remarks</label>
                        <input
                            id="remarks" type="text" placeholder="Special Remarks" class:invalid={!$fremarks.valid} 
                            bind:value={$fremarks.value}/>
                    </div>
                </div>

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