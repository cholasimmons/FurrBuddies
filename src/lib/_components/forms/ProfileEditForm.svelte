<script lang="ts">
	import { getFirstName } from "$lib/_utilities/split-names";
	import { state, userbucketstate } from "$lib/_stores/auth_store";
	import { modalStore } from "@skeletonlabs/skeleton";
	import { field, form } from "svelte-forms";
	import { pattern } from "svelte-forms/validators";
	import toast from "svelte-french-toast";
	import type { Models } from "appwrite";

    // RegEx pattern for the phoneNumber input field
    const phoneRegEx = /^(\d{1,12})?$/;

    // svelte-forms form and validation = https://chainlist.github.io/svelte-forms/
    const fphone = field('phone', $state.account?.prefs.phoneNumber, [pattern(phoneRegEx)]);
    const fdob = field('dob', $state.account?.prefs.dob, []);
    const fgender = field('gender', $state.account?.prefs.gender);
    const faddress = field('address', $state.account?.prefs.address);
    const fdistrict = field('district', $state.account?.prefs.district);
    const ffile = field('uploader', $state.account?.prefs.photoID);
    const editProfileForm = form(fphone,fdob,fgender,faddress,fdistrict,ffile);

    // Status of form, Loaders
    let _saving: boolean = false;
    let _uploadingPhoto = false;

    let photofile: File|undefined = undefined;

    // Form submit function
    async function submitEditedForm(){
        if(!$editProfileForm.valid)return;

        _saving = true;
        let bucketResponse: Models.File|undefined;

        try {
            let _photoSuccess: boolean = false;

            let prefs = {
                phoneNumber: $fphone.value,
                gender: $fgender.value,
                address: $faddress.value,
                district: $fdistrict.value,
                photoID: ''
            };

            if(photofile){
                _uploadingPhoto = true;
                bucketResponse = await userbucketstate.addUserPhoto(photofile);
                _photoSuccess = true;
                _uploadingPhoto = false;

                prefs = { ...prefs, photoID: bucketResponse!.$id};
            }
            
            await state.updateUserPrefs(prefs);
            modalStore.clear();
            editProfileForm.clear();
            toast.success('Your profile has been updated!',{icon: _photoSuccess ? '📸' : ''});
        } catch (error) {
            console.error('Unable to update User details. ',error);
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
            imagePreview!.innerHTML = '<img src="' + e.target!.result + '" alt="User Photo" class="w-28 h-28 object-cover object-center" />';
            };

            reader.readAsDataURL(photofile);
        }
    }

    // Validate numeric input in form, phone number
    function validateNumericInput(event:any) {
        console.log(event);
        
        const value = event.target.value;
        const numericValue = value.replace(/\D/g, '').slice(0, 12);
        fphone.set(numericValue);
    }
</script>

<main class=" w-full">
    <div class=" bg-surface-100 dark:bg-slate-800 p-6 rounded-2xl mx-auto w-full sm:w-3/4 lg:w-[48rem]">
        <h3 class="title">Edit { getFirstName($state.account?.name ?? 'User')}'s Details</h3>

        <form on:submit|preventDefault={submitEditedForm}>
            <div class="my-6 grid grid-cols-4 gap-3">
                <div on:click={()=>document.getElementById('uploader')?.click()} on:keypress class="col-span-4 flex flex-col gap-2 items-center justify-center bg-surface-300 rounded-xl p-6 dark:text-surface-700">
                    <input type="file" id="uploader" bind:value={$ffile.value} accept="image/*" style="display:none" on:change={onChangeHandler}/>
                    
                    {#if photofile}
                        <div class="w-28 h-28 rounded-full overflow-hidden border-2 " id="imagePreview"></div>
                    {:else}
                        <iconify-icon icon="mdi:file" class="text-2xl"></iconify-icon>
                    {/if}

                    <div class="flex flex-col md:flex-row justify-evenly items-center gap-6">
                        <span >Click here to upload an image</span>
                        <span hidden={!photofile}><button on:click={()=>photofile=undefined} class="btn variant-ghost-surface" type="button"><iconify-icon icon="mdi:close" class="mr-2"></iconify-icon>Remove image</button> </span>
                    </div>
                </div>
                
                <div class="col-span-4 md:col-span-2">
                    <label for="gender">Gender</label>
                    <select id="gender" bind:value={$fgender.value}>
                        <option value="">Undisclosed</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <div class="col-span-4 md:col-span-2">
                    <label for="phoneNumber">Phone Number</label>
                    <input type="tel" id="phoneNumber" placeholder="260" inputmode="tel" on:input={validateNumericInput} bind:value={$fphone.value}>
                </div>

                <div class="col-span-4">
                    <label for="dob">Date of Birth</label>
                    <input type="date" id="dob" placeholder="dd/mm/yyyy" inputmode="numeric" bind:value={$fdob.value}>
                </div>

                <div class="col-span-4 md:col-span-2">
                    <label for="address">Physical Address</label>
                    <input type="text" id="address" inputmode="text" bind:value={$faddress.value}>
                </div>
                <div class="col-span-4 md:col-span-2">
                    <label for="district">District</label>
                    <select id="district" inputmode="text" bind:value={$fdistrict.value}>
                        <option value="">None</option>
                        <option value="lusaka">Lusaka</option>
                        <option value="chirundu">Chirundu</option>
                        <option value="kafue">Kafue</option>
                        <option value="rufunsa">Rufunsa</option>
                        <option value="mufulira">Mufulira</option>
                    </select>
                </div>
            </div>
            
            <section class="flex justify-end gap-3">
                <button type="button" class="btn btn-lg" on:click={()=>modalStore.close()}>Close</button>
                <button disabled={ !($editProfileForm.valid) || _saving } type="submit" class="btn btn-lg variant-filled-secondary">{ _saving ? _uploadingPhoto ? 'Uploading...' : 'Saving...' : 'Save'}</button>
            </section>
        </form>
    </div>
</main>
