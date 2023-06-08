<script lang="ts">
	import { goto } from '$app/navigation';
    import { form, field } from 'svelte-forms';
    import { required, pattern } from 'svelte-forms/validators';
	import toast from 'svelte-french-toast';
	import { fly } from 'svelte/transition';

    export let data;

    // "isLoading" type of boolean
    let _resetting: boolean = false;

    // Minimum of 6 alphabetic characters with at least 1 uppercase letter
    const regExPattern1 = /^(?=.*[A-Z]).{6,}$/;
    // Minimum of 6 alphanumeric characters with at least 1 uppercase letter
    const regExPattern2 = /^(?=.*[A-Z])[a-zA-Z0-9]{6,}$/;
    // Minimum of 6 alphanumeric characters, at least 1 uppercase letter,
    // and allows (or not) the use of any non-alphanumeric characters
    const regExPattern3 = /^(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*()-_+=~`[\]{}|\\:;"'<>,.?/]{6,}$/;

    // svelte-forms form and validation = https://chainlist.github.io/svelte-forms/
    const fpassword = field('password', '', [required(), pattern(regExPattern3)]);
    const fpassword2 = field('confirmpassword', '', [required(), pattern(regExPattern3)]);
    const resetForm = form(fpassword);

    // Reset password function
    const resetPassword = async () => {
        if (!$resetForm.valid) {
            return;
        }
        try {
            _resetting = true;
            // (await) function to reset password
            toast.loading('Method not yet implemented');
            resetForm.reset();
            // goto("/");
        } catch (error: any) {
            // state.alert({ color: "red", message: error.message });
            toast.error(error.message, { style: "red" });
        } finally {
            _resetting = false;
        }
    };
</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | Password Reset</title>
	<meta name="description" content="Securely reset your {data.appName} password" />
</svelte:head>

<!-- HTML body -->
<main>
    <h3 class="title text-center">Password Reset</h3>
    <p class="mt-0 text-center">
        Enter your new password</p>

    <section class="flex justify-center">
        <div class="flex-grow flex flex-col max-w-lg justify-center">

            <form on:submit|preventDefault={resetPassword}>

            <!-- User Password-->

                <label class="block mt-6" for="password"> Password</label>
                <input id="password" type="password" class:invalid={!$fpassword.valid} placeholder="passWORD"
                    bind:value="{$fpassword.value}" />
                    {#if !$fpassword.valid && $fpassword}
                        <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-gray-300 text-right"
                        >Minimum 6 characters, at least one uppercase letter.</p>
                    {/if}

            <!-- User Confirmation Password-->

                <label class="block mt-6" for="password"> Password</label>
                <input id="password" type="password" class:invalid={!$fpassword2.valid} placeholder="passWORD"
                    bind:value="{$fpassword2.value}" />
                    {#if !$fpassword2.valid && $fpassword2}
                        <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-gray-300 text-right"
                        >Minimum 6 characters, at least one uppercase letter.</p>
                    {/if}

            <!-- Form Buttons (Clear Form & Submit) -->

                <div class="mt-6 flex justify-between">
                    <button disabled={!$resetForm.dirty} on:click={resetForm.reset} type="reset">
                        Clear Form
                    </button>
                    <button disabled={!($resetForm.valid && $fpassword.value) || _resetting} type="submit">
                        {#if _resetting}Resetting{:else}Reset{/if} 
                    </button>
                </div>
            </form>
        </div>
    </section>
</main>

<style>
* {
    outline: none
}
form input {
    width: 100%;
    padding: 1.2rem 1.6rem;

    border-radius: 0.6rem;
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 1.2rem;
    border: 3px transparent solid;
    transition: border 0.2s ease-in;
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
input.invalid {
    border: 3px red solid;
}
</style>