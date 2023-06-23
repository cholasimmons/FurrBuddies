<script lang="ts">
	import { petbucketstate, petstate, state, userbucketstate } from "$lib/_stores/auth_store";
	import { Avatar, modalStore } from "@skeletonlabs/skeleton";
	import { field, form } from "svelte-forms";
	import toast from "svelte-french-toast";
	import type { Models } from "appwrite";
	import { Type, type IPet, Gender } from "$lib/_models/pet-model";
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
    const fcolor = field('color', buddy.color, []);
    const fremarks = field('remarks', buddy.remarks, []);
    const ffile = field('uploader', buddy.photoID);
    const editBuddyForm = form(fname,fgender,fbreed,ftype,fdob,fowner,ffile);


    // Status of form, Loaders
    let _saving: boolean = false;
    let _uploadingPhoto = false;

    let photofile: File|undefined = undefined;

    let imageURL: string = '/images/FurrPrints.webp';

    onMount(async ()=>{
        try {
            const file: URL|undefined = await petbucketstate.getPreview(buddy?.photoID?.[0]??'');
            if(!file) return;
            imageURL = file!.href;
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
                color: $fcolor.value,
                remarks: $fremarks.value,
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

<main class="w-full my-3">
    <div class=" bg-surface-400 dark:bg-slate-800 p-6 rounded-2xl mx-auto w-full sm:w-3/4 lg:w-[48rem]">
        <h3 class="title">Edit { buddy.name }'s Details</h3>

        <form on:submit|preventDefault={submitEditedForm}>
            <div class="mb-8 grid grid-cols-3 gap-3">
                <div on:click={()=>document.getElementById('uploader')?.click()} on:keypress class="col-span-3 flex flex-col gap-2 items-center justify-center rounded-xl p-6 bg-opacity-10 hover:bg-surface-800">
                    <input type="file" id="uploader" bind:value={$ffile.value} accept="image/*" style="display:none" on:change={onChangeHandler}/>
                    
                    {#if photofile || buddy.photoID?.[0] !== ''}
                        <div class="w-32 h-32 rounded-full overflow-hidden border-2 " id="imagePreview">
                            <img src={ imageURL } alt="" class="w-full h-full object-center object-cover" />
                        </div>
                    {:else}
                        <iconify-icon icon="mdi:file" class="text-2xl"></iconify-icon>
                    {/if}

                    <div class="flex flex-col md:flex-row justify-evenly items-center gap-6">
                        <span>Click here to upload an image</span>
                        <span hidden={!photofile}><button on:click={()=>photofile=undefined} class="btn variant-ghost-surface" type="button"><iconify-icon icon="mdi:close" class="mr-2"></iconify-icon>Remove image</button> </span>
                    </div>
                </div>
                
                <div class="col-span-3 md:col-span-2">
                    <label for="petname">Name</label>
                    <input type="text" name="petname" id="petname" bind:value={$fname.value}>
                </div>

                <div class="col-span-3 md:col-span-1">
                    <label for="animaltype"> Species</label>
                    <select
                        id="animaltype" name="animaltype" placeholder="Animal Type" class:invalid={!$ftype.valid}
                        bind:value={$ftype.value}>
                        <option value={Type.DOG}>{Type.DOG}</option>
                        <option value={Type.CAT}>{Type.CAT}</option>
                        <option value={Type.BIRD}>{Type.BIRD}</option>
                        <option value={Type.RABBIT}>{Type.RABBIT}</option>
                        <option value={Type.RODENT}>{Type.RODENT}</option>
                        <option value={Type.HORSE}>{Type.HORSE}</option>
                    </select>
                </div>

                <div class="col-span-3 md:col-span-1">
                    <label for="breed">Breed</label>
                    <input type="text" id="breed" name="breed" inputmode="text" bind:value={$fbreed.value}>
                </div>

                <div class="col-span-1 md:col-span-1">
                    <label for="gender">Gender</label>
                    <select id="gender" name="gender" bind:value={$fgender.value}>
                        <option value={Gender.UNSPECIFIED}>{Gender.UNSPECIFIED}</option>
                        <option value={Gender.MALE}>{Gender.MALE}</option>
                        <option value={Gender.FEMALE}>{Gender.FEMALE}</option>
                    </select>
                </div>

                <div class="col-span-2 md:col-span-1">
                    <label for="dob">Date of Birth</label>
                    <input type="date" id="dob" name="dob" bind:value={$fdob.value}>
                </div>

                <div class="col-span-1">
                    <label for="color">Color</label>
                    <input type="text" id="color" name="color" bind:value={$fcolor.value}>
                </div>

                <div class="col-span-2">
                    <label for="remarks">Remarks</label>
                    <input type="text" id="remarks" name="remarks" bind:value={$fremarks.value}>
                </div>
            </div>
            
            <section class="flex justify-end gap-3">
                <button type="button" class="btn btn-lg" on:click={()=>modalStore.close()}>Cancel</button>
                <button disabled={ !($editBuddyForm.valid) || _saving } type="submit" class="btn btn-lg variant-filled-secondary">{ _saving ? _uploadingPhoto ? 'Uploading...' : 'Saving...' : 'Save'}</button>
            </section>
        </form>
    </div>
</main>
