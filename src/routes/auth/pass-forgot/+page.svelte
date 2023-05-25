<script lang="ts">
	import { goto } from '$app/navigation';
    import { form, field } from 'svelte-forms';
    import { required, email, pattern } from 'svelte-forms/validators';
	import toast from 'svelte-french-toast';
	import { fly } from 'svelte/transition';

    export let data;

    // "isLoading" type of boolean
    let _sending: boolean = false;

    // svelte-forms form and validation = https://chainlist.github.io/svelte-forms/
    const femail = field('email', '', [required(), email()]);
    const resetForm = form(femail);

    // Forgotten password function
    const requestLink = async () => {
        if (!$resetForm.valid) {
            return;
        }
        try {
            _sending = true;
            // (await) function to send password-reset link
            toast.loading('Method not yet implemented');
            resetForm.reset();
            // goto("/");
        } catch (error: any) {
            // state.alert({ color: "red", message: error.message });
            toast.error(error.message, { style: "red" });
        } finally {
            _sending = false;
        }
    };
</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | Forgotten Password</title>
	<meta name="description" content="Request for a password reset link" />
</svelte:head>

<!-- HTML body -->
<main>
    <h3 class="title text-center">Forgotten Password</h3>
    <p class="mt-0 text-center">
        Enter your email address for a password reset link</p>

    <section class="flex justify-center">
        <div class="flex-grow flex flex-col max-w-lg justify-center">

            <form on:submit|preventDefault={requestLink}>

            <!-- User Email-->

                <label class="block mt-6" for="email"> Email</label>
                <input id="email" type="text" class:invalid={!$femail.valid} placeholder="yourname@email.add"
                    bind:value="{$femail.value}"/>
                <p class="text-gray-300 text-right">&nbsp;
                    {#if !$femail.valid && $femail.value}<span in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }}>This is not a valid email address.</span>{/if}</p>

            <!-- Form Buttons (Clear Form & Submit) -->

                <div class="mt-6 flex justify-between">
                    <button disabled={!$resetForm.dirty} on:click={resetForm.reset} type="reset">
                        Clear Form
                    </button>
                    <button disabled={!($resetForm.valid && $femail.value) || _sending} type="submit">
                        {#if _sending}Submitting{:else}Submit{/if} 
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