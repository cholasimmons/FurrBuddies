<script lang="ts">
	import { goto } from "$app/navigation";
    import { state } from "$lib/store";
    import { form, field } from 'svelte-forms';
    import { required, email, pattern } from 'svelte-forms/validators';
	import toast from "svelte-french-toast";
	import { fly } from "svelte/transition";

    export let data;

    // "isLoading" type of boolean
    let _authenticating: boolean = false;

    // Minimum of 6 alphabetic characters with at least 1 uppercase letter
    const regExPattern1 = /^(?=.*[A-Z]).{6,}$/;
    // Minimum of 6 alphanumeric characters with at least 1 uppercase letter
    const regExPattern2 = /^(?=.*[A-Z])[a-zA-Z0-9]{6,}$/;
    // Minimum of 6 alphanumeric characters, at least 1 uppercase letter,
    // and allows (or not) the use of any non-alphanumeric characters
    const regExPattern3 = /^(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*()-_+=~`[\]{}|\\:;"'<>,.?/]{6,}$/;

    // svelte-forms form and validation = https://chainlist.github.io/svelte-forms/
    const femail = field('email', '', [required(), email()]);
    const fpassword = field('password', '', [required(), pattern(regExPattern3)]);
    const loginForm = form(femail,fpassword);

    // Log Ip with Appwrite :)
    const login = async () => {
        if (!$loginForm.valid) {
            return;
        }
        _authenticating = true;
        try {
            await state.login($femail.value, $fpassword.value);
            history.back();
            _authenticating = false;
        } catch (error: any) {
            // state.alert({ color: "red", message: error.message });
            toast.error(error.message)
            _authenticating = false;
        }
    };

</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | Login</title>
	<meta name="description" content="{data.appName} authenticated login" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">
    <!--h3 class="title text-center">Login</h3-->
    <p class="mt-0 text-center">
        Don't have an account yet?
        <span class="text-surface-600 font-bold">
            <a href="/auth/register"> Sign Up </a>
        </span>
    </p>

    <section class="flex justify-center">
        <div class="flex-grow flex flex-col max-w-lg justify-center">

            <form on:submit|preventDefault={login}>

            <!-- User Email-->

                <label class="block mt-6" for="email"> Email</label>
                <!-- svelte-ignore a11y-autofocus -->
                <input id="email" type="text" class:invalid={!$femail.valid} placeholder="yourname@email.add"
                    bind:value="{$femail.value}"/>
                    {#if !$femail.valid && $femail.value}
                        <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-surface-800 dark:text-surface-300 text-right">This is not a valid email address.</p>
                    {/if}

            <!-- User Password-->

                <label class="block mt-6" for="password"> Password</label>
                <input id="password" type="password" class:invalid={!$fpassword.valid} placeholder="passWORD"
                    bind:value="{$fpassword.value}" />
                    {#if !$fpassword.valid && $fpassword}
                        <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-surface-800 dark:text-surface-300 text-right">Minimum 6 alphanumeric characters, one uppercase letter.</p>
                    {/if}
    
            <!-- Form Buttons (Clear Form & Submit) -->

                <div class="mt-6 flex justify-between items-center">
                    <button disabled={!$loginForm.dirty} on:click={loginForm.reset} type="reset">
                        Clear Form
                    </button>
                    <button disabled={ !($loginForm.valid && $femail.value) || _authenticating} class="btn variant-filled-warning" type="submit">
                        {#if _authenticating}Logging In{:else}Log In{/if} 
                    </button>
                </div>
            </form>

            <p class="mt-8 text-center">
                Can't remember your password?
                <span class="text-primary-500">
                    <a href="/auth/pass-forgot"> Reset Password </a>
                </span>
            </p>
        </div>
    </section>
</main>