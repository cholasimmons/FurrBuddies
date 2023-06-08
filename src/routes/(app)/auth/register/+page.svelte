<script lang="ts">
	import { goto } from "$app/navigation";
    import { state } from "$lib/store";
	import toast from "svelte-french-toast";
	import { fly } from "svelte/transition";
    import { form, field } from 'svelte-forms';
    import { required, email, pattern } from 'svelte-forms/validators';

    export let data;

    // "isLoading" type of boolean
    let _registering: boolean = false;

    // Minimum of 6 alphabetic characters with at least 1 uppercase letter
    const regExPattern1 = /^(?=.*[A-Z]).{6,}$/;
    // Minimum of 6 alphanumeric characters with at least 1 uppercase letter
    const regExPattern2 = /^(?=.*[A-Z])[a-zA-Z0-9]{6,}$/;
    // Minimum of 6 alphanumeric characters, at least 1 uppercase letter,
    // and allows (or not) the use of any non-alphanumeric characters
    const regExPattern3 = /^(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*()-_+=~`[\]{}|\\:;"'<>,.?/]{6,}$/;

    // svelte-forms form and validation = https://chainlist.github.io/svelte-forms/
    const fname = field('name', '', [required()]);
    const femail = field('email', '', [required(), email()]);
    const fpassword = field('password', '', [required(), pattern(regExPattern3)]);
    const registrationForm = form(fname,femail,fpassword);

    // Sign Up with Appwrite :)
    const signup = async () => {
        if (!$registrationForm.valid) {
            return;
        }
        try {
            _registering = true;
            await state.signup($femail.value, $fpassword.value, $fname.value);
            await state.login($femail.value, $fpassword.value);
            registrationForm.clear;
            goto("/");
        } catch (error: any) {
            // state.alert({ color: "red", message: error.message });
            toast.error(error.message, { style: "red" });
        } finally {
            _registering = false;
        }
    };

</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | Sign Up</title>
	<meta name="description" content="Sign up for a new account!" />
</svelte:head>

<!-- HTML body -->
<main>
    <!--h3 class="title text-center">Sign Up</h3-->
    <p class="mt-0 text-center">
        Already registered ?
        <span class="text-primary-500">
            <a href="/auth/login"> Log In </a>
        </span>
    </p>

    <section class="flex justify-center">
        <div class="flex-grow flex flex-col max-w-lg justify-center">
            
            <form on:submit|preventDefault="{signup}">
                
            <!-- User Names-->

                <label class="block mt-6" for="name"> Full Name</label>
                <!-- svelte-ignore a11y-autofocus -->
                <input id="name" type="text" autofocus class:invalid={!$fname.valid} placeholder="Chola Simmons"
                    bind:value="{$fname.value}" />
                    <!-- I use the red border notification above, instead of the below text -->
                    <!--
                    {#if $registrationForm.hasError('name.required')}
                        <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-gray-300 text-right">Your names are required</p>
                    {/if}
                    -->

            <!-- User Email-->

                <label class="block mt-6" for="email"> Email</label>
                <input id="email" type="text" class:invalid={!$femail.valid} placeholder="yourname@email.add"
                    bind:value="{$femail.value}"/>
                    {#if !$femail.valid && $femail.value}
                        <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-gray-300 text-right">This is not a valid email address.</p>
                    {/if}

            <!-- User Password-->

                <label class="block mt-6" for="password"> Password</label>
                <input id="password" type="password" class:invalid={!$fpassword.valid} placeholder="passWORD"
                    bind:value="{$fpassword.value}" />
                    {#if !$fpassword.valid && $fpassword}
                        <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-gray-300 text-right"
                        >Minimum 6 characters, at least one uppercase letter.</p>
                    {/if}

            <!-- Form Buttons (Clear Form & Submit) -->

                <div class="mt-6 flex justify-between items-center">
                    <button disabled={!$registrationForm.dirty} on:click={registrationForm.reset} type="reset">
                        Clear Form
                    </button>
                    <button disabled={!$registrationForm.valid || _registering} type="submit">
                        {#if _registering}Registering{:else}Register{/if} 
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