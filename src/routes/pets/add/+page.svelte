<script lang="ts">
	import { Gender, type Pet } from "$lib/_models/pet-model";
	import { petstate } from "$lib/store";
	import toast from "svelte-french-toast";

    let emptypet = {name:'', breed:'',gender:Gender.UNSPECIFIED, photo: ''};
    let pet = emptypet;
    let photoFile: string;
    let _adding: boolean = false;

    const addBuddy = async ()=>{
        _adding = true;
        
        try {
            console.log('Male: ',Gender.MALE);
            
            await petstate.addPet(pet.name, pet.gender, pet.breed, photoFile);
            pet = emptypet
            toast.success('Added '+pet.name+' to the family!');            
        } catch (error: any) {
            // state.alert({ color: 'red', message: petName+' was not added. '+error.message})
            console.warn('Unable to add '+pet.name,error.message);
        } finally {
            _adding = false;
        }        
    }

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];
        photoFile = file;
    };

    $: checkForm = pet.name !== "";
</script>

<svelte:head>
	<title>Furr Buddies | Add a Buddy</title>
	<meta name="description" content="Add to the family" />
</svelte:head>

<main>
    <h3 class="title text-center">Add a Buddy</h3>
    <p class="mt-0 text-center">
        Grow your family
        <!--span class="text-primary-500">
            <a href="/auth/register"> Sign Up </a>
        </span-->
    </p>

    <section class="flex justify-center">
        <div class="flex-grow flex flex-col max-w-lg justify-center">

            <form on:submit|preventDefault={addBuddy}>
                <img src={photoFile} alt="">
                <input type="file" id="uploader" accept="image/*" on:change={(e)=>handleFileUpload} />

                <label class="block mt-6" for="name"> Name</label>
                <input
                    id="name" placeholder="Pet Name"
                    class="w-full p-4 placeholder-gray-400 text-gray-700 bg-white text-lg border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-gray-900"
                    type="text"
                    bind:value="{pet.name}"
                />

                <label class="block mt-6" for="breed"> Breed</label>
                <input
                    id="breed" placeholder="Breed"
                    class="w-full p-4 placeholder-gray-400 text-gray-700 bg-white text-lg border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-gray-900"
                    type="text"
                    bind:value="{pet.breed}"
                />

                <label class="block mt-6" for="gender"> Gender</label>
                <select
                    id="gender" placeholder="Gender" bind:value="{pet.gender}"
                    class="w-full p-4 placeholder-gray-400 text-gray-700 bg-white text-lg border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-gray-900"
                    >
                    <option value="UNSPECIFIED">Unspecified</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                </select>

                <div class="mt-6 flex justify-center">
                    <button
                        disabled="{!checkForm || _adding}"
                        type="submit"
                        class="mx-auto mt-4 py-4 px-16 font-light btn variant-filled rounded-lg text-white hover:text-gray-900 hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                        {_adding ? 'Adding...' : 'Add'}
                    </button>
                </div>
            </form>
        </div>
    </section>
</main>

<style>
    *:focus {
        outline: none;
    }
</style>