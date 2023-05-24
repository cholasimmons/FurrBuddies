<script lang="ts">
	import { goto } from "$app/navigation";
	import LoadingCircle from "$lib/_components/icons/Loading_Circle.svelte";
    import { state, type Alert } from "$lib/store";

    export let data;

    let name: string,
        email: string,
        password: string = "";

    const signup = async () => {
        if (!checkform) {
            return;
        }
        try {
            await state.signup(email, password, name);
            await state.login(email, password);
            name = email = password = "";
            goto("/");
        } catch (error: any) {
            state.alert({ color: "red", message: error.message });
        }
    };

    $: checkform = name !== "" && email !== "" && password !== "";
</script>

<svelte:head>
	<title>{data.appName} | Sign Up</title>
	<meta name="description" content="Sign up for a new account!" />
</svelte:head>

<main>
    <h3 class="title text-center">Sign Up</h3>
    <p class="mt-0 text-center">
        Already registered ?
        <span class="text-primary-500">
            <a href="/auth/login"> Login </a>
        </span>
    </p>

    <section class="container flex">
        <div class="flex-grow flex flex-col max-w-xl justify-center">
            
            <form on:submit|preventDefault="{signup}">
                <label class="block mt-6" for="name"> Name</label>
                <input id="name" type="text"
                    class="w-full p-4 placeholder-gray-400 text-gray-700 bg-white text-lg border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-gray-900"
                    bind:value="{name}" />

                <label class="block mt-6" for="email"> Email</label>
                <input id="email"
                    class="w-full p-4 placeholder-gray-400 text-gray-700 bg-white text-lg border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-gray-900"
                    type="text" bind:value="{email}" />
                <label class="block mt-6" for="password"> Password</label>
                <input id="password"
                    class="w-full p-4 placeholder-gray-400 text-gray-700 bg-white text-lg border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-gray-900"
                    type="password" bind:value="{password}" />

                <div class="mt-6 text-center">
                    <button disabled="{!checkform || $state._loading}" type="submit"
                        class="flex items-center mx-auto mt-4 py-4 px-16 font-light btn variant-filled rounded-lg text-white hover:text-gray-900 hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                        {#if $state._loading}<LoadingCircle/>{:else}Register{/if} 
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
        border-radius: 0.6rem;
        background-color: rgba(255, 255, 255, 0.2);
        color: white;
        font-size: 1.2rem;
    }
    form label {
        opacity: 0.75
    }
</style>