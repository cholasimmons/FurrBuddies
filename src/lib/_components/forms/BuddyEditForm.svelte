<script lang="ts">
	import { petbucketstate, petstate, state, userbucketstate } from "$lib/_stores/auth_store";
	import { Avatar, modalStore } from "@skeletonlabs/skeleton";
	import { field, form } from "svelte-forms";
	import toast from "svelte-french-toast";
	import type { Models } from "appwrite";
	import type { IPet } from "$lib/_models/pet-model";
	import { required } from "svelte-forms/validators";
	import { onMount } from "svelte";

    export let buddy: IPet;

    // svelte-forms form and validation = https://chainlist.github.io/svelte-forms/
    const fname = field('name', buddy.name, [required()]);
    const fgender = field('gender', buddy.gender, []);
    const fbreed = field('breed', buddy.breed, []);
    const ftype = field('type', buddy.type, [required()]);
    const fdob = field('dob', buddy.dob, []);
    const fowner = field('owner', buddy.ownerID, []);
    const ffile = field('uploader', buddy.photoID);
    const editBuddyForm = form(fname,fgender,fbreed,ftype,fdob,fowner,ffile);
    


    // Status of form, Loaders
    let _saving: boolean = false;
    let _uploadingPhoto = false;

    let photofile: File|undefined = undefined;

    let imageURL: string = '/images/FurrPrints.webp';

    onMount(async ()=>{
        try {
            const file = await petbucketstate.getPreview(buddy!.photoID?.[0] ?? '0');
            imageURL = file?.href ?? '';
        } catch (error) {
            console.log('Couldn\'t retrieve image');
        }
        
    });

    // Form submit function
    async function submitEditedForm(){
        if(!$editBuddyForm.valid)return;

        _saving = true;

        let bucketResponse: Models.File|null|undefined;

        try {
            let body = {
                name: $fname.value,
                gender: $fgender.value,
                breed: $fbreed.value,
                type: $ftype.value,
                dob: $fdob.value,
                photoID: ''
            };

            
            let _photoSuccess: boolean = false;

            if(photofile){
                _uploadingPhoto = true;
                bucketResponse = await petbucketstate.addPetPhoto(photofile);
                _photoSuccess = true;
                _uploadingPhoto = false;

                body = { ...body, photoID: bucketResponse!.$id};
            }
            await petstate.updatePet(buddy, body);
            
            modalStore.clear();
            editBuddyForm.clear();
            toast.success(buddy.name + '\'s profile has been updated!',{icon: _photoSuccess ? '📸' : ''});
            await petstate.fetch();
        } catch (error) {
            console.error('Unable to update details. ',error);
            _saving = false;
            _uploadingPhoto =false;
        }
    }

    // File selection handler
    function onChangeHandler(e: any): void {
        photofile = e.target?.files[0]
        // console.log('file data:', e);
        // console.log('file:', photofile);
        previewImage();
    }

    // Function that creates preview of selected image
    function previewImage() {
        if (photofile) {
            const reader = new FileReader();

            reader.onload = function(e) {
            const imagePreview = document.getElementById('imagePreview');
            imagePreview!.innerHTML = '<img src="' + e.target!.result + '" alt="Photo" class="w-28 h-28 object-cover object-center" />';
            };

            reader.readAsDataURL(photofile);
        }
    }

</script>

<main>
    <div class=" bg-surface-400 dark:bg-slate-800 p-8 rounded-2xl w-96 md:w-[40rem]">
        <h3 class="title">Edit { buddy.name }'s Details</h3>

        <form on:submit|preventDefault={submitEditedForm}>
            <div class="my-6 grid grid-cols-2 gap-3">
                <div class="col-span-2 flex flex-col gap-2 items-center justify-center  rounded-xl p-6">
                    <input type="file" id="uploader" bind:value={$ffile.value} accept="image/*" style="display:none" on:change={onChangeHandler}/>
                    
                    {#if photofile}
                        <div class="w-28 h-28 rounded-full overflow-hidden border-2 " id="imagePreview">
                            <Avatar src={imageURL} />
                        </div>
                    {:else}
                        <iconify-icon icon="mdi:file" class="text-2xl"></iconify-icon>
                    {/if}

                    <div class="flex flex-col md:flex-row justify-evenly items-center gap-6">
                        <span on:click={()=>document.getElementById('uploader')?.click()} on:keypress >Click here to upload an image</span>
                        <span hidden={!photofile}><button on:click={()=>photofile=undefined} class="btn variant-ghost-surface" type="button"><iconify-icon icon="mdi:close" class="mr-2"></iconify-icon>Remove image</button> </span>
                    </div>
                </div>
                
                <div class="col-span-2 md:col-span-2">
                    <label for="name">Name</label>
                    <input type="text" name="name" id="name" bind:value={$fname.value}>
                </div>

                <div class="col-span-2 md:col-span-1">
                    <label for="gender">Gender</label>
                    <select id="gender" name="gender" bind:value={$fgender.value}>
                        <option value="">Undisclosed</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <div class="col-span-2 md:col-span-1">
                    <label for="breed">Breed</label>
                    <input type="text" id="breed" name="breed" inputmode="text" bind:value={$fbreed.value}>
                </div>

                <div class="col-span-2 md:col-span-1">
                    <label for="type"> Animal Type</label>
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

                <div class="col-span-2 md:col-span-1">
                    <label for="dob">Date of Birth</label>
                    <input type="date" id="dob" name="dob" bind:value={$fdob.value}>
                </div>
            </div>
            
            <section class="flex justify-end gap-3">
                <button type="button" class="btn btn-lg" on:click={()=>modalStore.close()}>Cancel</button>
                <button disabled={ !($editBuddyForm.valid) || _saving } type="submit" class="btn btn-lg variant-filled-secondary">{ _saving ? _uploadingPhoto ? 'Uploading...' : 'Saving...' : 'Save'}</button>
            </section>
        </form>
    </div>
</main>
