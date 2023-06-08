<script lang="ts">
	import { getFirstName } from "$lib/_utilities/split-names";
	import { state, userbucketstate } from "$lib/store";
	import { modalStore } from "@skeletonlabs/skeleton";
	import { field, form } from "svelte-forms";
	import { pattern } from "svelte-forms/validators";
	import toast from "svelte-french-toast";

    // RegEx pattern for the phoneNumber input field
    const phoneRegEx = /^(\d{1,12})?$/;

    // svelte-forms form and validation = https://chainlist.github.io/svelte-forms/
    const fphone = field('phone', $state.account?.prefs.phoneNumber, [pattern(phoneRegEx)]);
    const fgender = field('gender', $state.account?.prefs.gender);
    const faddress = field('address', $state.account?.prefs.address);
    const fdistrict = field('district', $state.account?.prefs.district);
    const ffile = field('uploader', $state.account?.prefs.photoID);
    const editProfileForm = form(fphone,fgender,faddress,fdistrict,ffile);
    
    export let name: any;

    // Status of form, Loaders
    let _saving: boolean = false;
    let _uploadingPhoto = false;

    let photofile: File|undefined = undefined;

    // Form submit function
    async function submitEditedForm(){
        if(!$editProfileForm.valid)return;
        _saving = true;
        let bucketResponse: any;

        try {
            let _photoSuccess: boolean = false;

            let prefs = {
                phoneNumber: $fphone.value,
                gender: $fgender.value,
                address: $faddress.value,
                district: $fdistrict.value,
                photoID: null
            };

            if(photofile){
                _uploadingPhoto = true;
                bucketResponse = await userbucketstate.addUserPhoto(photofile);
                _photoSuccess = true;
                _uploadingPhoto = false;

                prefs = {
                    phoneNumber: $fphone.value,
                    gender: $fgender.value,
                    address: $faddress.value,
                    district: $fdistrict.value,
                    photoID: bucketResponse.$id
                };
            }

            
            await state.updateUserPrefs(prefs);
            modalStore.close();
            editProfileForm.clear();
            toast.success('Your profile has been updated!',{icon: _photoSuccess ? '📸' : ''});
            setTimeout(()=>{
                userbucketstate.getPreview($state.account?.prefs.photoID);
            },2000);
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

<main>
    <div class=" bg-surface-100 dark:bg-slate-800 p-8 rounded-2xl w-96 md:w-[40rem]">
        <h3 class="title">Edit { getFirstName(name)}'s Details</h3>

        <form on:submit|preventDefault={submitEditedForm}>
            <div class="my-6 grid grid-cols-3 gap-3">
                <div class="col-span-3 flex flex-col gap-2 items-center justify-center bg-surface-300 rounded-xl p-6">
                    <input type="file" id="uploader" bind:value={$ffile.value} accept="image/*" style="display:none" on:change={onChangeHandler}/>
                    
                    {#if photofile}
                        <div class="w-28 h-28 rounded-full overflow-hidden border-2 " id="imagePreview"></div>
                    {:else}
                        <iconify-icon icon="mdi:file" class="text-2xl"></iconify-icon>
                    {/if}

                    <div class="flex flex-col md:flex-row justify-evenly items-center gap-6">
                        <span on:click={()=>document.getElementById('uploader')?.click()} on:keypress >Click here to upload an image</span>
                        <span hidden={!photofile}><button on:click={()=>photofile=undefined} class="btn variant-ghost-surface" type="button"><iconify-icon icon="mdi:close" class="mr-2"></iconify-icon>Remove image</button> </span>
                    </div>
                </div>
                
                <div class="col-span-3 md:col-span-1">
                    <label for="gender">Gender:</label>
                    <select id="gender" bind:value={$fgender.value}>
                        <option value="">Undisclosed</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div class="col-span-3 md:col-span-2">
                    <label for="phoneNumber">Phone Number:</label>
                    <input type="tel" id="phoneNumber" placeholder="260" inputmode="tel" on:input={validateNumericInput} bind:value={$fphone.value}>
                </div>

                <div class="col-span-3 md:col-span-2">
                    <label for="address">Physical Address:</label>
                    <input type="text" id="address" inputmode="text" bind:value={$faddress.value}>
                </div>
                <div class="col-span-3 md:col-span-1">
                    <label for="district">District:</label>
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
