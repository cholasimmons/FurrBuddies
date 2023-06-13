<script lang="ts">
	import { goto } from "$app/navigation";
    import { state } from "$lib/_stores/auth_store.js";
	import toast from "svelte-french-toast";
	import { fly } from "svelte/transition";
    import { form, field } from 'svelte-forms';
    import { required, email, pattern, min, matchField, max } from 'svelte-forms/validators';
	import { appSettings } from "$lib/_stores/settings_store.js";

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
    const phoneRegEx2 = /^(?!.*[a-zA-Z])(\d{1,12})?$/;

    // svelte-forms form and validation = https://chainlist.github.io/svelte-forms/
    const fname = field('name', '', [required(),min(1)]);
    const fphone = field('phoneNumber', '', [pattern(phoneRegEx2), min(9), max(12)]);
    const fgender = field('gender', undefined, []);
    const femail = field('email', '', [required(), email()]);
    const fpassword = field('password', '', [required(), pattern(regExPattern3)]);
    const fconfirmpassword = field('confirm-password', '', [required(), matchField(fpassword)]);
    const ftc = field('terms', false, [required()]);
    const registrationForm = form(fname,fphone,fgender,femail,fpassword,fconfirmpassword,ftc);

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

            <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <div class="flex-grow">
                <!-- User Password-->
                    <label class="block mt-6" for="password"> Password</label>
                    <input id="password" type="password" inputmode="text" class:invalid={!$fpassword.valid} placeholder="passWORD"
                        bind:value="{$fpassword.value}" />
                </div>

                <div class="flex-grow">
                <!-- User Password Confirmation -->
                    <label class="block mt-6" for="confirmpassword"> Confirm Password</label>
                    <input id="confirmpassword" type="password" inputmode="text" class:invalid={!$fconfirmpassword.valid} placeholder="passWORD"
                        bind:value="{$fconfirmpassword.value}" />
                </div>
                {#if !$fpassword.valid && $fpassword}
                    <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="col-span-2 text-gray-300 text-left">Minimum 6 characters, at least one uppercase letter.</p>
                {/if}
            </div>

            <!--div class="w-full grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <div class="flex-grow">
                <!-- User Password-->
                    <!--label class="block mt-6" for="district"> District</label>
                    <input id="district" type="district" inputmode="text" class:invalid={!$fdistrict.valid} placeholder="The city you live in"
                        bind:value="{$fdistrict.value}" />
                </div>

                <div class="flex-grow">
                <!-- User Password Confirmation -->
                    <!--label class="block mt-6" for="confirmpassword"> Confirm Password</label>
                    <input id="confirmpassword" type="password" inputmode="text" class:invalid={!$fconfirmpassword.valid} placeholder="passWORD"
                        bind:value="{$fconfirmpassword.value}" />
                </div>
                {#if !$fpassword.valid && $fpassword}
                    <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="col-span-2 text-gray-300 text-left">Minimum 6 characters, at least one uppercase letter.</p>
                {/if}
            </div-->
            

            <!-- Optional -->
                <hr class="w-full mt-6">
                <p class="text-primary-500">Optional</p>

                <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <div class="flex-grow">
                    <!-- User Phone Number (Optional) -->
                        <label class="block mt-6" for="phoneNumber"> Phone Number</label>
                        <!-- svelte-ignore a11y-autofocus -->
                        <input id="phoneNumber" type="tel" on:input={validateNumericInput} bind:value="{$fphone.value}"
                            inputmode="tel" maxlength="12" class:invalid={!$fphone.valid} placeholder="Optional"/>
                    </div>
                
                    <div class="flex-grow">
                    <!-- User Gender (Optional) -->
                        <label class="block mt-6" for="gender"> Gender</label>
                        <!-- svelte-ignore a11y-autofocus -->
                        <select id="gender" bind:value="{$fgender.value}" class:invalid={!$fphone.valid} placeholder="Optional">
                            <option value={null}>Undisclosed</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                </div>
            

            
            
            <!-- Legal -->
                <section class="w-full flex p-2 pl-0">
                    <span class="p-4 pl-0">
                        <input type="checkbox" bind:value={$ftc.value} class="w-8">
                    </span>
                    <p class="opacity-50">I agree to the <a href="/legal/terms">{$appSettings.app.name} Terms and Conditions</a> concerning Account registration and community behavior</p>
                </section>
                <hr>

            <!-- Form Buttons (Clear Form & Submit) -->

                <div class="mt-6 flex justify-between items-center">
                    <button disabled={!$registrationForm.dirty} on:click={registrationForm.reset} type="reset">
                        Clear Form
                    </button>
                    <button disabled={!$registrationForm.valid || _registering || !$fname.value.length || $ftc.value===false} class="btn variant-filled-warning" type="submit">
                        {#if _registering}Registering{:else}Register{/if} 
                    </button>
                </div>
            </form>
        </div>
    </section>
</main>

<style>
a:hover {
        @apply text-tertiary-500;
    }
</style>