<script lang="ts">
	import { goto } from "$app/navigation";
    import { state } from "$lib/_stores/auth_store.js";
	import toast from "svelte-french-toast";
	import { fly } from "svelte/transition";
    import { form, field } from 'svelte-forms';
    import { required, email, pattern, min } from 'svelte-forms/validators';

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

    // RegEx pattern for the phoneNumber input field
    const phoneRegEx = /^(\d{1,12})?$/;

    // svelte-forms form and validation = https://chainlist.github.io/svelte-forms/
    const fname = field('name', '', [required(),min(1)]);
    const fphone = field('phoneNumber', '', [pattern(phoneRegEx)]);
    const fgender = field('gender', undefined, []);
    const femail = field('email', '', [required(), email()]);
    const fpassword = field('password', '', [required(), pattern(regExPattern3)]);
    const registrationForm = form(fname,fphone,fgender,femail,fpassword);

    // Sign Up with Appwrite :)
    const signup = async () => {
        if (!$registrationForm.valid) {
            return;
        }
        try {
            _registering = true;
            await state.signup($femail.value, $fpassword.value, $fname.value);
            await submitPrefs(parseInt($fphone.value),$fgender.value);
            toast.success("Your account has been created.");
            registrationForm.reset;
            _registering = false;
            goto("/", {replaceState: true});
            toast.custom('Verification link sent to your email', {icon: '📨'})
        } catch (error: any) {
            toast.error(error.message, { style: "red" });
            _registering = false;
        }
    };

    async function submitPrefs(phoneNumber: number|undefined, gender: string|undefined) {
        await state.updateUserPrefs({'phoneNumber': phoneNumber, 'gender': gender})
    }

    // Sanitize numeric input in form, phone number
    function validateNumericInput(event:any) {
        // console.log(event.target.value);
        
        const value = event.target.value;
        const numericValue = value.replace(/\D/g, '').slice(0, 12);
        fphone.set(numericValue);
    }

</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | Sign Up</title>
	<meta name="description" content="Sign up for a new account!" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding} pb-24">
    <!--h3 class="title text-center">Sign Up</h3-->
    <p class="mt-0 text-center text-sm">
        Already registered ?
        <span class="text-primary-500">
            <a href="/auth/login"> Log In </a>
        </span>
    </p>

    <section class="flex justify-center">
        <div class="flex-grow flex flex-col max-w-lg justify-center">
            
            <form on:submit|preventDefault={signup}>
                
            <!-- User Names-->

                <label class="block mt-6" for="fullname"> Full Name</label>
                <!-- svelte-ignore a11y-autofocus -->
                <input id="fullname" type="text" autofocus class:invalid={!$fname.valid} placeholder="Chola Simmons"
                    bind:value="{$fname.value}" />
                    <!-- I use the red border notification above, instead of the below text -->
                    <!--
                    {#if $registrationForm.hasError('name.required')}
                        <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-gray-300 text-right">Your names are required</p>
                    {/if}
                    -->

            <!-- User Email-->

                <label class="block mt-6" for="email"> Email</label>
                <input id="email" type="text" inputmode="email" class:invalid={!$femail.valid} placeholder="yourname@email.add"
                    bind:value="{$femail.value}"/>
                    {#if !$femail.valid && $femail.value}
                        <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-gray-300 text-right">This is not a valid email address.</p>
                    {/if}

            <!-- User Password-->

                <label class="block mt-6" for="password"> Password</label>
                <input id="password" type="password" inputmode="text" class:invalid={!$fpassword.valid} placeholder="passWORD"
                    bind:value="{$fpassword.value}" />
                    {#if !$fpassword.valid && $fpassword}
                        <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-gray-300 text-right"
                        >Minimum 6 characters, at least one uppercase letter.</p>
                    {/if}

            <!-- Optional -->
                <hr>

            <!-- User Phone Number (Optional) -->

                <label class="block mt-6" for="phoneNumber"> Phone Number</label>
                <!-- svelte-ignore a11y-autofocus -->
                <input id="phoneNumber" type="tel" on:input={validateNumericInput} bind:value="{$fphone.value}"
                    inputmode="tel" class:invalid={!$fphone.valid} placeholder="Optional"/>

            <!-- User Gender (Optional) -->

                <label class="block mt-6" for="gender"> Gender</label>
                <!-- svelte-ignore a11y-autofocus -->
                <select id="gender" bind:value="{$fgender.value}" class:invalid={!$fphone.valid} placeholder="Optional">
                    <option value={null}>Undisclosed</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

            <!-- Form Buttons (Clear Form & Submit) -->

                <div class="mt-6 flex justify-between items-center">
                    <button disabled={!$registrationForm.dirty} on:click={registrationForm.reset} type="reset">
                        Clear Form
                    </button>
                    <button disabled={!$registrationForm.valid || _registering || $fname.value.length < 1} class="btn variant-filled-warning" type="submit">
                        {#if _registering}Registering{:else}Register{/if} 
                    </button>
                </div>
            </form>
        </div>
    </section>
</main>